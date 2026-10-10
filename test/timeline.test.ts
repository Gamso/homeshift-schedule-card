import { describe, expect, it } from "vitest";
import {
  Schedule,
  daySegments,
  scheduleEntities,
  segmentColors,
  schedulesFor,
  slotValue,
} from "../src/timeline";
import { sampleSchedules } from "./helpers";

function schedule(timeslots: Schedule["timeslots"], weekdays = ["daily"]): Schedule {
  return { schedule_id: "x", entity_id: "switch.x", name: "x", enabled: true, weekdays, timeslots };
}

const on = { service: "input_boolean.turn_on", entity_id: "input_boolean.p" };
const off = { service: "input_boolean.turn_off", entity_id: "input_boolean.p" };
const span = (s: { start: number; end: number; value: { label: string } }) =>
  [s.start, s.end, s.value.label];

describe("daySegments", () => {
  it("spans timeslots from start to stop, midnight being the end of the day", () => {
    expect(daySegments(sampleSchedules()[0]).map(span)).toEqual([
      [0, 420, "18°"],
      [420, 1440, "20.5°"],
    ]);
  });

  it("splits a timeslot that runs past midnight", () => {
    const s = schedule([
      { start: "22:00:00", stop: "06:00:00", actions: [on] },
    ]);
    expect(daySegments(s).map(span)).toEqual([
      [0, 360, "on"],
      [1320, 1440, "on"],
    ]);
  });

  it("holds single actions until the next one, wrapping around midnight", () => {
    const s = schedule([
      { start: "17:00:00", stop: null, actions: [on] },
      { start: "22:30:00", stop: null, actions: [off] },
    ]);
    expect(daySegments(s).map(span)).toEqual([
      [0, 1020, "off"],
      [1020, 1350, "on"],
      [1350, 1440, "off"],
    ]);
  });

  it("holds a lone action all day", () => {
    const s = schedule([{ start: "08:00:00", stop: null, actions: [off] }]);
    expect(daySegments(s).map(span)).toEqual([[0, 1440, "off"]]);
  });
});

describe("slotValue", () => {
  const slot = (service: string, service_data = {}) => ({
    start: "00:00:00",
    stop: null,
    actions: [{ service, service_data }],
  });

  it("reads setpoints and modes", () => {
    expect(slotValue(slot("climate.set_temperature", { temperature: 19, hvac_mode: "heat" })))
      .toMatchObject({ kind: "heat", temperature: 19, label: "19°" });
    expect(slotValue(slot("climate.set_temperature", { temperature: 26, hvac_mode: "cool" })))
      .toMatchObject({ kind: "cool", label: "26°" });
    expect(slotValue(slot("climate.set_hvac_mode", { hvac_mode: "off" }))).toMatchObject({
      kind: "off",
    });
    expect(slotValue(slot("switch.turn_on"))).toMatchObject({ kind: "on", label: "on" });
  });

  it("reads presets", () => {
    expect(slotValue(slot("climate.set_preset_mode", { preset_mode: "comfort" }))).toMatchObject({
      kind: "preset",
      preset: "comfort",
    });
  });
});

describe("segmentColors", () => {
  const preset = (name: string) => segmentColors({ kind: "preset", preset: name, label: name });

  it("colors presets from cold to hot", () => {
    expect(preset("frost").background).toBe("#85B7EB");
    expect(preset("eco").background).toBe("#FAC775");
    expect(preset("comfort").background).toBe("#EF9F27");
    expect(preset("boost").background).toBe("#A32D2D");
    expect(preset("my_custom").background).toBe("#B4B2A9");
  });
});


describe("schedulesFor", () => {
  it("keeps the schedules of the tag acting on the tab's entities", () => {
    const all = sampleSchedules();
    expect(schedulesFor(all, "Maison", []).map((s) => s.schedule_id)).toEqual(["a1"]);
    expect(schedulesFor(all, "Maison", ["climate.bureau"])).toEqual([]);
    expect(schedulesFor(all, "Maison", ["climate.salon"])).toHaveLength(1);
  });
});

describe("schedules driving a thermostat and other entities", () => {
  const clim = schedule([
    { start: "10:00:00", stop: null, actions: [{ service: "switch.turn_on", entity_id: "switch.ac" }] },
    {
      start: "11:00:00",
      stop: "15:00:00",
      actions: [
        {
          service: "climate.set_temperature",
          entity_id: "climate.salon",
          service_data: { temperature: 26, hvac_mode: "cool" },
        },
      ],
    },
  ]);

  it("shows only the thermostat on the timeline", () => {
    expect(daySegments(clim).map(span)).toEqual([[660, 900, "26°"]]);
    expect(scheduleEntities(clim, true)).toEqual(["climate.salon"]);
    expect(scheduleEntities(clim)).toEqual(["switch.ac", "climate.salon"]);
  });
});

describe("merged segments", () => {
  it("joins back-to-back time slots setting the same value", () => {
    const eco = (start: string, stop: string) => ({
      start,
      stop,
      actions: [
        { service: "climate.set_preset_mode", entity_id: "climate.c", service_data: { preset_mode: "eco" } },
      ],
    });
    const s = schedule([eco("00:00:00", "07:00:00"), eco("07:00:00", "13:00:00"), eco("13:00:00", "00:00:00")]);
    expect(daySegments(s).map(span)).toEqual([[0, 1440, "eco"]]);
  });
});
