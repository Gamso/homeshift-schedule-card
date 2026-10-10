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
  appliesOn,
  daySegments,
  formatMinutes,
  scheduleEntities,
  schedulesFor,
  segmentColors,
} from "./timeline";

/** Days in the order of the day selector, as Date.getDay() indexes. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const KIND_ICONS: Record<string, string> = {
  heat: "mdi:radiator",
  cool: "mdi:snowflake",
  on: "mdi:toggle-switch-outline",
  off: "mdi:toggle-switch-off-outline",
  other: "mdi:calendar-clock",
};

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
  /** Day shown by the timelines, as a Date.getDay() index. */
  @state() private _day = new Date().getDay();
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

  private _activate(name: string) {
    const entityId = this._config.mode_entity!;
    const domain = entityId.split(".")[0];
    this.hass.callService(domain, "select_option", { entity_id: entityId, option: name });
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
      <div class="root" style="--hsc-accent: ${accent}">
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
        ${this._renderModeBar(selected, active, modes)}
        <div class="content" role="tabpanel">${this._renderContent(selected)}</div>
      </div>
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
    const today = new Date().getDay();
    const isToday = this._day === today;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const schedules = schedulesFor(this._schedules ?? [], mode.tag, mode.entities).filter((s) =>
      appliesOn(s, this._day),
    );

    return html`
      <div class="timeline">
        <div class="days">
          ${WEEK_ORDER.map(
            (day) => html`
              <button
                class="day ${day === this._day ? "selected" : ""} ${day === today ? "today" : ""}"
                aria-pressed=${day === this._day ? "true" : "false"}
                @click=${() => (this._day = day)}
              >
                ${this._dayLabel(day)}
              </button>
            `,
          )}
        </div>
        ${this._schedules && !schedules.length
          ? html`<div class="empty">${localize(this.hass, "timeline.empty")}</div>`
          : html`
              ${schedules.map((s) => this._renderRow(s, isToday ? nowMinutes : undefined))}
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

  private _renderRow(schedule: Schedule, nowMinutes?: number) {
    const segments = daySegments(schedule);
    const entities = scheduleEntities(schedule, true);
    const label =
      entities.length === 1
        ? (this.hass.states[entities[0]]?.attributes?.friendly_name ?? entities[0])
        : schedule.name;
    const kind = segments[0]?.value.kind ?? "other";
    const enabled = this.hass.states[schedule.entity_id]
      ? this.hass.states[schedule.entity_id].state !== "off"
      : schedule.enabled;
    const next =
      nowMinutes != null && enabled ? segments.find((s) => s.start > nowMinutes) : undefined;

    return html`
      <div class="row ${enabled ? "" : "disabled"}" title=${schedule.name}>
        <div class="row-head">
          <ha-icon class="kind ${kind}" icon=${KIND_ICONS[kind]}></ha-icon>
          <span class="row-name">${label}</span>
          ${next
            ? html`<span class="row-next">
                ${localize(this.hass, "timeline.next", {
                  value: this._label(next.value),
                  time: formatMinutes(next.start),
                })}
              </span>`
            : nothing}
          <button
            class="switch ${enabled ? "on" : ""}"
            role="switch"
            aria-checked=${enabled ? "true" : "false"}
            aria-label=${schedule.name}
            @click=${() => this._toggle(schedule.entity_id, enabled)}
          ></button>
        </div>
        <div class="bar">
          ${segments.map((s) => this._renderSegment(s))}
          ${nowMinutes != null
            ? html`<div class="now" style="left: ${(nowMinutes / DAY_MINUTES) * 100}%"></div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderSegment(segment: Segment) {
    const { background, color } = segmentColors(segment.value);
    const width = ((segment.end - segment.start) / DAY_MINUTES) * 100;
    const range = `${formatMinutes(segment.start)} – ${formatMinutes(segment.end)}`;
    return html`<div
      class="segment"
      style="left: ${(segment.start / DAY_MINUTES) * 100}%; width: ${width}%; background: ${background}; color: ${color}"
      title="${range} · ${this._label(segment.value)}"
    >
      ${width >= 8 ? this._label(segment.value) : nothing}
    </div>`;
  }

  /** Text of a value, with the temperature in the user's number format (20.5° / 20,5°). */
  private _label(value: SlotValue): string {
    if (value.temperature == null) return value.label;
    const language = this.hass.locale?.language ?? this.hass.language ?? "en";
    return `${value.temperature.toLocaleString(language)}°`;
  }

  private _dayLabel(day: number): string {
    // 2024-01-07 is a Sunday: adding the Date.getDay() index gives that weekday.
    const date = new Date(2024, 0, 7 + day);
    const language = this.hass.locale?.language ?? this.hass.language ?? "en";
    return date.toLocaleDateString(language, { weekday: "short" }).replace(".", "");
  }

  private _toggle(entityId: string, enabled: boolean) {
    this.hass.callService("switch", enabled ? "turn_off" : "turn_on", { entity_id: entityId });
  }

  /** Offers to switch the mode entity to the viewed tab's mode. */
  private _renderModeBar(selected: ResolvedMode, active: string | undefined, modes: ResolvedMode[]) {
    if (
      this._config.allow_mode_change === false ||
      !this._config.mode_entity ||
      !active ||
      selected.name === active
    ) {
      return nothing;
    }
    const activeLabel = modes.find((m) => m.name === active)?.label ?? active;
    return html`
      <div class="mode-bar">
        <span>${localize(this.hass, "mode_bar.current", { mode: activeLabel })}</span>
        <button class="activate" @click=${() => this._activate(selected.name)}>
          ${localize(this.hass, "mode_bar.activate", { mode: selected.label })}
        </button>
      </div>
    `;
  }

  static styles = css`
    .root {
      display: flex;
      flex-direction: column;
    }
    .tabs {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tab {
      flex: 1 0 auto;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 14px 16px;
      border: none;
      background: none;
      cursor: pointer;
      font: inherit;
      font-size: 16px;
      font-weight: 500;
      color: var(--secondary-text-color);
      border-radius: 4px 4px 0 0;
    }
    .tab:hover {
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
    }
    .tab:focus-visible {
      outline: 2px solid var(--hsc-accent);
      outline-offset: -2px;
    }
    .tab.selected {
      color: var(--hsc-accent);
    }
    .tab.selected::after {
      content: "";
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--hsc-accent);
    }
    .active-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--state-active-color, var(--success-color, #43a047));
      flex: none;
    }
    .mode-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      margin: 8px 0 0;
      padding: 6px 6px 6px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--hsc-accent) 15%, transparent);
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .activate {
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      background: var(--hsc-accent);
      color: #fff;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
    }
    .content {
      margin-top: 8px;
    }
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--ha-card-background, var(--card-background-color));
    }
    .days {
      display: flex;
      gap: 4px;
    }
    .day {
      flex: 1;
      padding: 4px 0;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      text-transform: capitalize;
    }
    .day.today {
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .day.selected {
      background: color-mix(in srgb, var(--hsc-accent) 25%, transparent);
      border-color: var(--hsc-accent);
      color: var(--primary-text-color);
    }
    .row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .row.disabled .bar {
      opacity: 0.35;
    }
    .row.disabled .row-name {
      color: var(--secondary-text-color);
    }
    .row-head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    .kind {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }
    .kind.heat {
      color: #ef9f27;
    }
    .kind.cool {
      color: #378add;
    }
    .row-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }
    .row-next {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
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
      margin-top: -6px;
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
