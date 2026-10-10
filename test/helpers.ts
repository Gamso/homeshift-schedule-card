import { vi } from "vitest";
import { HomeShiftScheduleCard } from "../src/homeshift-schedule-card";
import "../src/homeshift-schedule-card";
import { Schedule } from "../src/timeline";

export function entity(entity_id: string, state: string, attributes = {}) {
  return { entity_id, state, attributes };
}

const heat = (entity_id: string, temperature: number) => ({
  service: "climate.set_temperature",
  entity_id,
  service_data: { temperature, hvac_mode: "heat" },
});

/** Schedules as the scheduler component's websocket command returns them. */
export function sampleSchedules(): Schedule[] {
  return [
    {
      schedule_id: "a1",
      entity_id: "switch.schedule_chauffage_maison_salon",
      name: "Chauffage maison salon",
      enabled: true,
      weekdays: ["daily"],
      tags: ["Maison"],
      timeslots: [
        { start: "00:00:00", stop: "07:00:00", actions: [heat("climate.salon", 18)] },
        { start: "07:00:00", stop: "00:00:00", actions: [heat("climate.salon", 20.5)] },
      ],
    },
    {
      schedule_id: "a2",
      entity_id: "switch.schedule_chauffage_travail_salon",
      name: "Chauffage travail salon",
      enabled: true,
      weekdays: ["mon", "tue", "wed", "thu", "fri"],
      tags: ["Travail"],
      timeslots: [{ start: "06:00:00", stop: "08:00:00", actions: [heat("climate.salon", 20)] }],
    },
  ];
}

export function makeHass(mode = "Maison", language = "fr") {
  const states: Record<string, any> = {
    "select.homeshift_day_mode": entity("select.homeshift_day_mode", mode, {
      options: ["Maison", "Télétravail", "Travail", "Absence"],
    }),
    "climate.salon": entity("climate.salon", "heat", { friendly_name: "Salon" }),
    "switch.schedule_chauffage_maison_salon": entity(
      "switch.schedule_chauffage_maison_salon",
      "on",
    ),
  };
  return {
    states,
    locale: { language },
    language,
    callService: vi.fn().mockResolvedValue(undefined),
    callWS: vi.fn().mockResolvedValue(sampleSchedules()),
  };
}

/** Stands in for scheduler-card, recording the configuration it receives. */
export class FakeScheduler extends HTMLElement {
  config: any;
  hass: any;
  setConfig(config: any) {
    this.config = config;
  }
}
if (!customElements.get("scheduler-card")) customElements.define("scheduler-card", FakeScheduler);

export async function renderCard(hass: any, config: Record<string, unknown> = {}) {
  const card = document.createElement("homeshift-schedule-card") as HomeShiftScheduleCard;
  card.setConfig({ type: "custom:homeshift-schedule-card", ...config } as any);
  card.hass = hass;
  document.body.appendChild(card);
  await settle(card);
  return card;
}

/** Waits for the scheduler card of the shown tab to be built and rendered. */
export async function settle(card: HomeShiftScheduleCard) {
  for (let i = 0; i < 5; i++) {
    await card.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
  }
}

export function $(card: HomeShiftScheduleCard, selector: string) {
  return card.shadowRoot!.querySelector(selector) as HTMLElement | null;
}

export function $$(card: HomeShiftScheduleCard, selector: string) {
  return [...card.shadowRoot!.querySelectorAll(selector)] as HTMLElement[];
}
