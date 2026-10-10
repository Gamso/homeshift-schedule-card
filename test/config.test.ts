import { describe, expect, it } from "vitest";
import { resolveModes, schedulerConfig, validateConfig } from "../src/config";
import { makeHass } from "./helpers";

const base = { type: "custom:homeshift-schedule-card", mode_entity: "select.homeshift_day_mode" };

describe("validateConfig", () => {
  it("needs a mode entity or modes", () => {
    expect(() => validateConfig({ type: "x" })).toThrow(/mode_entity/);
    expect(() => validateConfig({ type: "x", modes: ["Maison"] })).not.toThrow();
  });

  it("rejects modes without a name", () => {
    expect(() => validateConfig({ type: "x", modes: [{} as any] })).toThrow(/name/);
  });
});

describe("resolveModes", () => {
  it("uses the options of the mode entity", () => {
    const modes = resolveModes(base, makeHass());
    expect(modes.map((m) => m.name)).toEqual(["Maison", "Télétravail", "Travail", "Absence"]);
  });

  it("prefers explicit modes, with their own label and tag", () => {
    const modes = resolveModes(
      { ...base, modes: ["Maison", { name: "Absence", label: "Vacances", tag: "away" }] },
      makeHass(),
    );
    expect(modes).toEqual([
      { name: "Maison", label: "Maison", tag: "Maison", entities: [] },
      { name: "Absence", label: "Vacances", tag: "away", entities: [] },
    ]);
  });

  it("adds per-mode entities to the shared ones, without duplicates", () => {
    const modes = resolveModes(
      {
        ...base,
        entities: ["climate.salon", "climate.bureau"],
        extra_entities: { Travail: ["input_boolean.force_presence", "climate.salon"] },
      },
      makeHass(),
    );
    expect(modes.find((m) => m.name === "Travail")!.entities).toEqual([
      "climate.salon",
      "climate.bureau",
      "input_boolean.force_presence",
    ]);
    expect(modes.find((m) => m.name === "Maison")!.entities).toEqual([
      "climate.salon",
      "climate.bureau",
    ]);
  });
});

describe("schedulerConfig", () => {
  const mode = { name: "Maison", label: "Maison", tag: "Maison", entities: ["climate.salon"] };

  it("filters the scheduler on the mode's tag and entities", () => {
    const config = schedulerConfig(base, mode, makeHass());
    expect(config).toMatchObject({
      type: "custom:scheduler-card",
      tags: ["Maison"],
      include: ["climate.salon"],
      discover_existing: false,
      time_step: 5,
    });
    expect(config.display_options.secondary_info[0]).toContain(
      "Prochain lancement</b></i> {relative-time}",
    );
  });

  it("lets scheduler options override the defaults but not the tab filter", () => {
    const config = schedulerConfig(
      { ...base, scheduler: { time_step: 10, tags: ["other"] } },
      mode,
      makeHass(),
    );
    expect(config.time_step).toBe(10);
    expect(config.tags).toEqual(["Maison"]);
  });

  it("shows every entity when none is configured", () => {
    const config = schedulerConfig(base, { ...mode, entities: [] }, makeHass());
    expect(config).not.toHaveProperty("include");
  });
});
