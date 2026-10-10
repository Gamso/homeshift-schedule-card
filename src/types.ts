/** One tab of the card: a day mode and the schedules tagged with it. */
export interface ModeConfig {
  /** Option of the mode entity this tab stands for. */
  name: string;
  /** Tab label (defaults to `name`). */
  label?: string;
  /** Scheduler tag of the tab's schedules (defaults to `name`). */
  tag?: string;
  /** Entities offered in this tab only, on top of the card's `entities`. */
  entities?: string[];
}

export interface HomeShiftScheduleCardConfig {
  type: string;
  /** `select` or `input_select` holding the current day mode. */
  mode_entity?: string;
  /** Tabs to show, in order; defaults to the options of `mode_entity`. */
  modes?: (string | ModeConfig)[];
  /** Entities offered in every tab's scheduler. */
  entities?: string[];
  /** Entities offered in one tab only, keyed by mode name. */
  extra_entities?: Record<string, string[]>;
  /** Jump to the active mode's tab whenever the mode changes (default true). */
  follow_mode?: boolean;
  /** Offer to activate the viewed mode when it is not the active one (default true). */
  allow_mode_change?: boolean;
  /** Tab and indicator color. */
  accent_color?: string;
  /** Color of the schedule names. */
  name_color?: string;
  /** "timeline" (default): a 24 h timeline per schedule; "list": the scheduler-card list. */
  layout?: "timeline" | "list";
  /** scheduler-card options, merged over the card's defaults. */
  scheduler?: Record<string, any>;
}

/** A mode with every default resolved. */
export interface ResolvedMode {
  name: string;
  label: string;
  tag: string;
  entities: string[];
}
