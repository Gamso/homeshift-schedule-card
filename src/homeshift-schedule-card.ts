import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { localize } from "./localize/localize";
import {
  DEFAULT_ACCENT,
  activeMode,
  resolveModes,
  schedulerConfig,
  validateConfig,
} from "./config";
import { ResolvedMode, HomeShiftScheduleCardConfig } from "./types";
import {
  DAY_MINUTES,
  Schedule,
  Segment,
  SlotValue,
  daySegments,
  formatMinutes,
  scheduleEntities,
  schedulesFor,
  segmentColors,
} from "./timeline";

const KIND_ICONS: Record<string, string> = {
  heat: "mdi:radiator",
  cool: "mdi:snowflake",
  // A preset alone does not say heating or cooling: heating, as for the exclusion.
  preset: "mdi:radiator",
  on: "mdi:toggle-switch-outline",
  off: "mdi:toggle-switch-off-outline",
  other: "mdi:calendar-clock",
};

/** Schedules sharing a heading: those driving the same room's thermostat. */
interface Room {
  name: string;
  /** Entity the schedules drive, when they drive a single one. */
  entity?: string;
  schedules: Schedule[];
}

/** Whether a timeline heats or cools, for the heating / cooling exclusion. */
function climateSide(kind: string): "heat" | "cool" | undefined {
  if (kind === "cool") return "cool";
  if (kind === "heat" || kind === "preset") return "heat";
  return undefined;
}

/** Order of a room's timelines: heating first, then cooling. */
const KIND_ORDER = ["heat", "preset", "cool", "on", "off", "other"];

/**
 * Kind of a timeline, for its icon: cooling wins, then heating, then
 * presets; turning off alone does not tell what the schedule is for.
 */
function rowKind(segments: Segment[]): string {
  const kinds = new Set(segments.map((s) => s.value.kind));
  return (
    ["cool", "heat", "preset", "on", "off"].find((kind) => kinds.has(kind as any)) ?? "other"
  );
}

export class HomeShiftScheduleCard extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @state() private _config!: HomeShiftScheduleCardConfig;
  /** Name of the mode whose tab is shown. */
  @state() private _selected?: string;
  /** Bumped when a scheduler card is (re)built, to render it. */
  @state() private _cardsVersion = 0;
  /** Mode entity option seen at the last update, to notice mode changes. */
  private _lastActive?: string;
  /** One scheduler card per mode, built once and kept while switching tabs. */
  private _cards = new Map<string, HTMLElement>();
  /** Modes whose scheduler card is being built. */
  private _building = new Set<string>();
  private _helpers?: Promise<any>;
  /** Every schedule of the scheduler component (timeline layout). */
  @state() private _schedules?: Schedule[];
  @state() private _schedulesError = false;
  /** Whether the timeline layout shows the scheduler card, to edit schedules. */
  @state() private _editing = false;
  /** Fingerprint of the schedule switches, to refetch the schedules when they change. */
  private _schedulesKey?: string;
  private _clock?: ReturnType<typeof setInterval>;

  connectedCallback() {
    super.connectedCallback();
    // Moves the "now" marker along the timelines.
    this._clock = setInterval(() => this.requestUpdate(), 60_000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._clock);
  }

  public static getStubConfig(): Partial<HomeShiftScheduleCardConfig> {
    return {
      mode_entity: "select.homeshift_day_mode",
      entities: [],
    };
  }

  public setConfig(config: HomeShiftScheduleCardConfig): void {
    validateConfig(config);
    this._config = config;
    this._cards = new Map();
    this._building.clear();
  }

  public getCardSize(): number {
    return 6;
  }

  public getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  private get _modes(): ResolvedMode[] {
    return resolveModes(this._config, this.hass);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (!changed.has("hass") || !this.hass) return;
    const active = activeMode(this._config, this.hass);
    const modes = this._modes;
    const followed = this._config.follow_mode !== false && active !== this._lastActive;
    if (active && modes.some((m) => m.name === active) && (followed || !this._selected)) {
      this._selected = active;
    } else if (!modes.some((m) => m.name === this._selected)) {
      this._selected = modes[0]?.name;
    }
    this._lastActive = active;
    if (this._timeline) this._refreshSchedules();
  }

  private get _timeline(): boolean {
    return this._config.layout !== "list";
  }

  /**
   * Fetches the schedules again when a schedule switch changes: the
   * component updates them whenever a schedule is edited, toggled or run.
   */
  private _refreshSchedules() {
    const key = Object.values(this.hass.states)
      .filter((s: any) => s.entity_id.startsWith("switch.schedule"))
      .map((s: any) => `${s.entity_id}:${s.last_updated}`)
      .join("|");
    if (key === this._schedulesKey) return;
    this._schedulesKey = key;
    this.hass
      .callWS({ type: "scheduler" })
      .then((schedules: Schedule[]) => {
        this._schedules = schedules;
        this._schedulesError = false;
      })
      .catch(() => {
        this._schedulesError = true;
      });
  }

  protected updated(): void {
    const card = this._selected ? this._cards.get(this._selected) : undefined;
    if (card && (card as any).hass !== this.hass) (card as any).hass = this.hass;
  }

  /** Scheduler card of a mode, built on first display. */
  private _card(mode: ResolvedMode): HTMLElement | undefined {
    const card = this._cards.get(mode.name);
    if (card) return card;
    if (!this._building.has(mode.name)) {
      this._building.add(mode.name);
      this._buildCard(mode).finally(() => this._building.delete(mode.name));
    }
    return undefined;
  }

  private async _buildCard(mode: ResolvedMode): Promise<void> {
    const config = schedulerConfig(this._config, mode, this.hass);
    const generation = this._cards;
    this._helpers ??= (window as any).loadCardHelpers?.() ?? Promise.resolve(undefined);
    const helpers = await this._helpers;
    let card: HTMLElement;
    if (helpers) {
      card = helpers.createCardElement(config);
    } else {
      await customElements.whenDefined("scheduler-card");
      card = document.createElement("scheduler-card");
      (card as any).setConfig(config);
    }
    // The configuration changed while the card was being built.
    if (generation !== this._cards) return;
    // Home Assistant asks for a rebuild once a card that loaded late is defined.
    card.addEventListener("ll-rebuild", (ev) => {
      ev.stopPropagation();
      this._cards.delete(mode.name);
      this._cardsVersion++;
    });
    (card as any).hass = this.hass;
    this._cards.set(mode.name, card);
    this._cardsVersion++;
  }

  private _select(name: string) {
    this._selected = name;
    this._editing = false;
  }

  private _onTabKeydown(ev: KeyboardEvent, modes: ResolvedMode[]) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[ev.key];
    if (!step) return;
    const index = modes.findIndex((m) => m.name === this._selected);
    const next = modes[(index + step + modes.length) % modes.length];
    this._select(next.name);
    ev.preventDefault();
    this.updateComplete.then(() =>
      this.shadowRoot?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus(),
    );
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const modes = this._modes;
    if (!modes.length) {
      return html`<ha-alert alert-type="warning">
        ${localize(this.hass, "errors.no_modes", { entity: this._config.mode_entity ?? "" })}
      </ha-alert>`;
    }
    const active = activeMode(this._config, this.hass);
    const selected = modes.find((m) => m.name === this._selected) ?? modes[0];
    const accent = this._config.accent_color ?? DEFAULT_ACCENT;

    return html`
      <ha-card class="root" style="--hsc-accent: ${accent}">
        <div
          class="tabs"
          role="tablist"
          @keydown=${(ev: KeyboardEvent) => this._onTabKeydown(ev, modes)}
        >
          ${modes.map((mode) => {
            const isSelected = mode.name === selected.name;
            return html`
              <button
                class="tab ${isSelected ? "selected" : ""}"
                role="tab"
                aria-selected=${isSelected ? "true" : "false"}
                tabindex=${isSelected ? 0 : -1}
                @click=${() => this._select(mode.name)}
              >
                <span class="label">${mode.label}</span>
                ${mode.name === active
                  ? html`<span
                      class="active-dot"
                      title=${localize(this.hass, "tabs.active_mode")}
                      aria-label=${localize(this.hass, "tabs.active_mode")}
                    ></span>`
                  : nothing}
              </button>
            `;
          })}
        </div>
        <div class="content" role="tabpanel">${this._renderContent(selected)}</div>
      </ha-card>
    `;
  }

  private _renderContent(mode: ResolvedMode) {
    if (!this._timeline) return this._card(mode) ?? nothing;
    if (this._editing) {
      return html`
        <button class="link" @click=${() => (this._editing = false)}>
          <ha-icon icon="mdi:chart-timeline"></ha-icon>${localize(this.hass, "timeline.back")}
        </button>
        ${this._card(mode) ?? nothing}
      `;
    }
    return this._renderTimeline(mode);
  }

  private _renderTimeline(mode: ResolvedMode) {
    if (this._schedulesError) {
      return html`<ha-alert alert-type="error">${localize(this.hass, "errors.schedules_unavailable")}</ha-alert>`;
    }
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const schedules = schedulesFor(this._schedules ?? [], mode.tag, mode.entities);

    return html`
      <div class="timeline">
        ${this._schedules && !schedules.length
          ? html`<div class="empty">${localize(this.hass, "timeline.empty")}</div>`
          : html`
              ${this._rooms(schedules).map((room) => this._renderRoom(room, nowMinutes))}
              <div class="axis" aria-hidden="true">
                ${[0, 6, 12, 18, 24].map(
                  (h) => html`<span style="left: ${(h / 24) * 100}%">${h}h</span>`,
                )}
              </div>
            `}
        <div class="footer">
          <button class="link" @click=${() => (this._editing = true)}>
            <ha-icon icon="mdi:pencil"></ha-icon>${localize(this.hass, "timeline.edit")}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Schedules grouped by room: those driving the same single entity (e.g.
   * the heating and the cooling of the living room) share a heading; any
   * other schedule is a room of its own, named after itself.
   */
  private _rooms(schedules: Schedule[]): Room[] {
    const rooms = new Map<string, Room>();
    for (const schedule of schedules) {
      const entities = scheduleEntities(schedule, true);
      const entity = entities.length === 1 ? entities[0] : undefined;
      const key = entity ?? schedule.entity_id;
      if (!rooms.has(key)) {
        const name = entity
          ? (this.hass.states[entity]?.attributes?.friendly_name ?? entity)
          : schedule.name;
        rooms.set(key, { name, entity, schedules: [] });
      }
      rooms.get(key)!.schedules.push(schedule);
    }
    for (const room of rooms.values()) {
      room.schedules.sort(
        (a, b) => KIND_ORDER.indexOf(rowKind(daySegments(a))) - KIND_ORDER.indexOf(rowKind(daySegments(b))),
      );
    }
    return [...rooms.values()];
  }

  private _renderRoom(room: Room, nowMinutes: number) {
    const measured = room.entity?.startsWith("climate.")
      ? this.hass.states[room.entity]?.attributes?.current_temperature
      : undefined;
    const allDisabled = room.schedules.every((s) => !this._enabled(s));
    return html`
      <div class="room">
        <div class="room-head">
          <span class="room-name ${allDisabled ? "disabled" : ""}">${room.name}</span>
          ${typeof measured === "number"
            ? html`<span class="measured">${this._number(measured)}°</span>`
            : nothing}
        </div>
        ${room.schedules.map((s) => this._renderRow(s, room, nowMinutes))}
      </div>
    `;
  }

  private _enabled(schedule: Schedule): boolean {
    const state = this.hass.states[schedule.entity_id];
    return state ? state.state !== "off" : schedule.enabled;
  }

  /** One schedule: its kind, its timeline and its switch. */
  private _renderRow(schedule: Schedule, room: Room, nowMinutes: number) {
    const segments = daySegments(schedule);
    const kind = rowKind(segments);
    const enabled = this._enabled(schedule);

    return html`
      <div class="row ${enabled ? "" : "disabled"}" title=${schedule.name}>
        <ha-icon class="kind ${kind}" icon=${KIND_ICONS[kind]}></ha-icon>
        <div class="bar">
          ${segments.map((s) => this._renderSegment(s))}
          <div class="now" style="left: ${(nowMinutes / DAY_MINUTES) * 100}%"></div>
        </div>
        <button
          class="switch ${enabled ? "on" : ""}"
          role="switch"
          aria-checked=${enabled ? "true" : "false"}
          aria-label=${schedule.name}
          @click=${() => this._toggle(schedule, room, enabled)}
        ></button>
      </div>
    `;
  }

  private _renderSegment(segment: Segment) {
    const { background, color } = segmentColors(segment.value);
    const width = ((segment.end - segment.start) / DAY_MINUTES) * 100;
    const range = `${formatMinutes(segment.start)} – ${formatMinutes(segment.end)}`;
    return html`<div
      class="segment"
      style="left: ${(segment.start / DAY_MINUTES) * 100}%; width: ${width}%; background-color: ${background}; color: ${color}"
      title="${range} · ${this._label(segment.value)}"
    >
      ${width >= 8 ? this._label(segment.value) : nothing}
    </div>`;
  }

  /** A number in the user's format (20.5 / 20,5). */
  private _number(value: number): string {
    const language = this.hass.locale?.language ?? this.hass.language ?? "en";
    return value.toLocaleString(language, { maximumFractionDigits: 1 });
  }

  /** Text of a value, with the temperature in the user's number format (20.5° / 20,5°). */
  private _label(value: SlotValue): string {
    const stateObj = value.entity ? this.hass.states[value.entity] : undefined;
    if (value.temperature != null) return `${this._number(value.temperature)}°`;
    // Presets and HVAC modes as Home Assistant names them ("Confort", "Éteint"...).
    if (value.preset != null) {
      return stateObj && this.hass.formatEntityAttributeValue
        ? this.hass.formatEntityAttributeValue(stateObj, "preset_mode", value.preset)
        : value.preset;
    }
    if (value.hvacMode != null) {
      return stateObj && this.hass.formatEntityState
        ? this.hass.formatEntityState(stateObj, value.hvacMode)
        : value.hvacMode;
    }
    if (value.kind === "on" || value.kind === "off") {
      return localize(this.hass, `timeline.${value.kind}`);
    }
    return value.label;
  }


  /**
   * Turns a schedule on or off. Heating and cooling the same room at once
   * makes no sense: turning one on first turns off the room's enabled
   * schedules of the other side.
   */
  private async _toggle(schedule: Schedule, room: Room, enabled: boolean) {
    if (enabled) {
      await this.hass.callService("switch", "turn_off", { entity_id: schedule.entity_id });
      return;
    }
    const side = climateSide(rowKind(daySegments(schedule)));
    const opposite = side
      ? room.schedules.filter((s) => {
          const other = climateSide(rowKind(daySegments(s)));
          return s !== schedule && other && other !== side && this._enabled(s);
        })
      : [];
    if (opposite.length) {
      await this.hass.callService("switch", "turn_off", {
        entity_id: opposite.map((s) => s.entity_id),
      });
    }
    await this.hass.callService("switch", "turn_on", { entity_id: schedule.entity_id });
  }

  static styles = css`
    .root {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
    }
    /* Segmented control: one button per mode, the shown one filled. */
    .tabs {
      display: flex;
      gap: 2px;
      padding: 3px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tab {
      flex: 1 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 6px 10px;
      border: none;
      border-radius: 8px;
      background: none;
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .tab:hover:not(.selected) {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .tab:focus-visible {
      outline: 2px solid var(--hsc-accent);
      outline-offset: 1px;
    }
    .tab.selected {
      background: var(--hsc-accent);
      color: #fff;
    }
    .active-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--state-active-color, var(--success-color, #43a047));
      flex: none;
    }
    /* The scheduler card (list layout, editing) blends into this card's frame. */
    .content {
      --ha-card-border-width: 0;
      --ha-card-box-shadow: none;
      --ha-card-background: transparent;
    }
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .room {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .room-head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    .room-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }
    .room-name.disabled {
      color: var(--secondary-text-color);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .row .bar {
      flex: 1;
    }
    /* A disabled schedule keeps its colors, hatched, so inactive modes stay readable. */
    .row.disabled .segment {
      background-image: repeating-linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.3) 0 4px,
        transparent 4px 8px
      );
    }
    .kind {
      flex: none;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }
    .kind.heat,
    .kind.preset {
      color: #ef9f27;
    }
    .kind.cool {
      color: #378add;
    }
    .measured {
      flex: none;
      padding: 1px 8px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      font-size: 12px;
    }
    .switch {
      position: relative;
      flex: none;
      width: 34px;
      height: 18px;
      border: none;
      border-radius: 9px;
      background: var(--disabled-color, #888);
      cursor: pointer;
      padding: 0;
    }
    .switch::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fff;
      transition: left 0.15s;
    }
    .switch.on {
      background: var(--switch-checked-track-color, var(--primary-color));
    }
    .switch.on::after {
      left: 19px;
    }
    .bar {
      position: relative;
      height: 22px;
      border-radius: 6px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      overflow: hidden;
    }
    .segment {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      box-shadow: inset -1px 0 0 var(--ha-card-background, var(--card-background-color));
    }
    .now {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      margin-left: -1px;
      background: var(--primary-text-color);
    }
    .axis {
      position: relative;
      height: 14px;
      /* Under the bars only: past the kind icon (18 + 8 px) and before the switch (34 + 8 px). */
      margin: -6px 42px 0 26px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .axis span {
      position: absolute;
      transform: translateX(-50%);
    }
    .axis span:first-child {
      transform: none;
    }
    .axis span:last-child {
      transform: translateX(-100%);
    }
    .empty {
      padding: 16px 0;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .footer {
      display: flex;
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      background: none;
      padding: 4px 0;
      color: var(--primary-color);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
  `;
}

customElements.define("homeshift-schedule-card", HomeShiftScheduleCard);
