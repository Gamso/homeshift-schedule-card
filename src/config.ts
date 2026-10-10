import { localize } from "./localize/localize";
import { ResolvedMode, HomeShiftScheduleCardConfig } from "./types";

export const DEFAULT_ACCENT = "#44739E";
export const DEFAULT_NAME_COLOR = "orange";

/** Throws the message Home Assistant shows in place of a misconfigured card. */
export function validateConfig(config: HomeShiftScheduleCardConfig): void {
  if (!config) throw new Error("Invalid configuration");
  if (!config.mode_entity && !config.modes?.length) {
    throw new Error("Set `mode_entity` (a select) or a list of `modes`.");
  }
  if (config.entities != null && !Array.isArray(config.entities)) {
    throw new Error("`entities` must be a list of entity ids.");
  }
  for (const mode of config.modes ?? []) {
    if (typeof mode !== "string" && !mode?.name) {
      throw new Error("Each entry of `modes` needs a `name`.");
    }
  }
}

/**
 * The tabs of the card: `modes` when given, else the options of the mode
 * entity, each with its own entities added to the shared ones.
 */
export function resolveModes(config: HomeShiftScheduleCardConfig, hass: any): ResolvedMode[] {
  const options: string[] = hass?.states?.[config.mode_entity ?? ""]?.attributes?.options ?? [];
  const modes = config.modes?.length ? config.modes : options;
  return modes.map((entry) => {
    const mode = typeof entry === "string" ? { name: entry } : entry;
    const entities = [
      ...(config.entities ?? []),
      ...(mode.entities ?? []),
      ...(config.extra_entities?.[mode.name] ?? []),
    ];
    return {
      name: mode.name,
      label: mode.label ?? mode.name,
      tag: mode.tag ?? mode.name,
      entities: [...new Set(entities)],
    };
  });
}

/** Current option of the mode entity, if it has a usable one. */
export function activeMode(config: HomeShiftScheduleCardConfig, hass: any): string | undefined {
  const state = hass?.states?.[config.mode_entity ?? ""]?.state;
  return state && state !== "unavailable" && state !== "unknown" ? state : undefined;
}

/** scheduler-card configuration of one tab. */
export function schedulerConfig(
  config: HomeShiftScheduleCardConfig,
  mode: ResolvedMode,
  hass: any,
): Record<string, any> {
  const nameColor = config.name_color ?? DEFAULT_NAME_COLOR;
  const defaults = {
    title: false,
    discover_existing: false,
    show_header_toggle: false,
    time_step: 5,
    sort_by: ["title"],
    display_options: {
      primary_info: [`<i><b><font color="${nameColor}">{name}</font></b></i>`],
      secondary_info: [
        `<i><b>${localize(hass, "scheduler.next_run")}</b></i> {relative-time}`,
        `<i><b>${localize(hass, "scheduler.days")}</b></i> {days}`,
        "additional-tasks",
      ],
      icon: "entity",
    },
  };
  return {
    ...defaults,
    ...config.scheduler,
    type: "custom:scheduler-card",
    tags: [mode.tag],
    ...(mode.entities.length ? { include: mode.entities } : {}),
  };
}
