import { afterEach, describe, expect, it } from "vitest";
import { $, $$, FakeScheduler, makeHass, renderCard, sampleSchedules, settle } from "./helpers";

const config = {
  mode_entity: "select.homeshift_day_mode",
  entities: ["climate.salon"],
  layout: "list",
};

afterEach(() => {
  document.body.innerHTML = "";
});

function tabLabels(card: any) {
  return $$(card, ".tab").map((t) => t.querySelector(".label")!.textContent);
}

function selectedTab(card: any) {
  return $(card, '.tab[aria-selected="true"] .label')!.textContent;
}

function scheduler(card: any) {
  return $(card, ".content scheduler-card") as FakeScheduler | null;
}

describe("homeshift-schedule-card, list layout", () => {
  it("shows one tab per mode and opens the active one", async () => {
    const card = await renderCard(makeHass("Travail"), config);
    expect(tabLabels(card)).toEqual(["Maison", "Télétravail", "Travail", "Absence"]);
    expect(selectedTab(card)).toBe("Travail");
    expect($(card, '.tab[aria-selected="true"] .active-dot')).not.toBeNull();
    expect(scheduler(card)!.config.tags).toEqual(["Travail"]);
  });

  it("switches the scheduler when another tab is clicked", async () => {
    const card = await renderCard(makeHass("Maison"), config);
    $$(card, ".tab")[3].click();
    await settle(card);
    expect(selectedTab(card)).toBe("Absence");
    expect(scheduler(card)!.config.tags).toEqual(["Absence"]);
  });

  it("follows the mode entity when it changes", async () => {
    const card = await renderCard(makeHass("Maison"), config);
    card.hass = makeHass("Télétravail");
    await settle(card);
    expect(selectedTab(card)).toBe("Télétravail");
  });

  it("stays on the viewed tab when follow_mode is off", async () => {
    const card = await renderCard(makeHass("Maison"), { ...config, follow_mode: false });
    $$(card, ".tab")[2].click();
    await settle(card);
    card.hass = makeHass("Absence");
    await settle(card);
    expect(selectedTab(card)).toBe("Travail");
  });

  it("moves between tabs with the arrow keys", async () => {
    const card = await renderCard(makeHass("Maison"), config);
    $(card, ".tabs")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    await settle(card);
    expect(selectedTab(card)).toBe("Absence");
  });

  it("passes hass to the shown scheduler", async () => {
    const card = await renderCard(makeHass("Maison"), config);
    const hass = makeHass("Maison");
    card.hass = hass;
    await settle(card);
    expect(scheduler(card)!.hass).toBe(hass);
  });
});

describe("homeshift-schedule-card, timeline layout", () => {
  const timeline = { mode_entity: "select.homeshift_day_mode", entities: ["climate.salon"] };

  it("draws one timeline per schedule of the tab", async () => {
    const card = await renderCard(makeHass("Maison"), timeline);
    const rows = $$(card, ".row");
    expect(rows).toHaveLength(1);
    expect($(card, ".room-name")!.textContent).toBe("Salon");
    const labels = [...rows[0].querySelectorAll(".segment")].map((s) => s.textContent!.trim());
    expect(labels).toEqual(["18°", "20,5°"]);
  });

  it("shows the room temperature", async () => {
    const card = await renderCard(makeHass("Maison"), timeline);
    expect($(card, ".measured")!.textContent).toBe("19,2°");
  });

  it("hatches a disabled schedule", async () => {
    const hass = makeHass("Maison");
    hass.states["switch.schedule_chauffage_maison_salon"].state = "off";
    const card = await renderCard(hass, timeline);
    expect($(card, ".row")!.classList.contains("disabled")).toBe(true);
  });

  it("names presets and modes as Home Assistant does", async () => {
    const hass: any = makeHass("Maison");
    hass.formatEntityAttributeValue = (_s: any, attr: string, v: string) => `${attr}:${v}`;
    hass.formatEntityState = (_s: any, v: string) => `state:${v}`;
    const action = (service: string, service_data: object) => ({
      service,
      entity_id: "climate.salon",
      service_data,
    });
    hass.callWS.mockResolvedValue([
      {
        schedule_id: "p1",
        entity_id: "switch.schedule_climatisation_maison_salon",
        name: "Climatisation maison salon",
        enabled: true,
        weekdays: ["daily"],
        tags: ["Maison"],
        timeslots: [
          { start: "00:00:00", stop: "13:00:00", actions: [action("climate.set_hvac_mode", { hvac_mode: "off" })] },
          { start: "13:00:00", stop: "21:30:00", actions: [action("climate.set_preset_mode", { preset_mode: "comfort" })] },
          { start: "21:30:00", stop: "00:00:00", actions: [action("climate.set_preset_mode", { preset_mode: "boost" })] },
        ],
      },
    ]);
    const card = await renderCard(hass, timeline);
    const labels = $$(card, ".segment").map((s) => s.textContent!.trim());
    expect(labels).toEqual(["state:off", "preset_mode:comfort", "preset_mode:boost"]);
    expect($(card, ".row ha-icon")!.getAttribute("icon")).toBe("mdi:thermostat");
  });

  describe("heating and cooling of the same room", () => {
    const cooling = {
      ...sampleSchedules()[0],
      schedule_id: "c1",
      entity_id: "switch.schedule_climatisation_maison_salon",
      name: "Climatisation maison salon",
      timeslots: [
        {
          start: "12:00:00",
          stop: "19:00:00",
          actions: [
            {
              service: "climate.set_temperature",
              entity_id: "climate.salon",
              service_data: { temperature: 26, hvac_mode: "cool" },
            },
          ],
        },
      ],
    };

    function roomHass(heating: string, cool: string) {
      const hass = makeHass("Maison");
      // Cooling listed first: the card still puts heating on top.
      hass.callWS.mockResolvedValue([cooling, sampleSchedules()[0]]);
      hass.states["switch.schedule_chauffage_maison_salon"].state = heating;
      hass.states[cooling.entity_id] = { entity_id: cooling.entity_id, state: cool, attributes: {} };
      return hass;
    }

    it("share one heading, heating first", async () => {
      const card = await renderCard(roomHass("on", "off"), timeline);
      expect($$(card, ".room")).toHaveLength(1);
      const icons = $$(card, ".row ha-icon").map((i) => i.getAttribute("icon"));
      expect(icons).toEqual(["mdi:radiator", "mdi:snowflake"]);
    });

    it("turning cooling on turns heating off first", async () => {
      const hass = roomHass("on", "off");
      const card = await renderCard(hass, timeline);
      $$(card, ".row .switch")[1].click();
      await settle(card);
      expect(hass.callService.mock.calls).toEqual([
        ["switch", "turn_off", { entity_id: ["switch.schedule_chauffage_maison_salon"] }],
        ["switch", "turn_on", { entity_id: cooling.entity_id }],
      ]);
    });

    it("turning a schedule off leaves the other side alone", async () => {
      const hass = roomHass("on", "on");
      const card = await renderCard(hass, timeline);
      $$(card, ".row .switch")[0].click();
      await settle(card);
      expect(hass.callService.mock.calls).toEqual([
        ["switch", "turn_off", { entity_id: "switch.schedule_chauffage_maison_salon" }],
      ]);
    });
  });

  it("shows every schedule of the tab, whatever its days", async () => {
    const card = await renderCard(makeHass("Travail"), timeline);
    expect($$(card, ".row")).toHaveLength(1);
    $$(card, ".tab")[3].click(); // Absence: no schedule
    await settle(card);
    expect($(card, ".empty")!.textContent).toContain("Aucune planification");
  });

  it("toggles a schedule from its switch", async () => {
    const hass = makeHass("Maison");
    const card = await renderCard(hass, timeline);
    $(card, ".row .switch")!.click();
    expect(hass.callService).toHaveBeenCalledWith("switch", "turn_off", {
      entity_id: "switch.schedule_chauffage_maison_salon",
    });
  });

  it("opens the scheduler card to edit, and comes back", async () => {
    const card = await renderCard(makeHass("Maison"), timeline);
    expect(scheduler(card)).toBeNull();
    ($(card, ".footer .link") as HTMLButtonElement).click();
    await settle(card);
    expect(scheduler(card)!.config.tags).toEqual(["Maison"]);
    ($(card, ".content > .link") as HTMLButtonElement).click();
    await settle(card);
    expect($(card, ".timeline")).not.toBeNull();
  });

  it("fetches the schedules again only when a schedule switch changes", async () => {
    const hass = makeHass("Maison");
    const card = await renderCard(hass, timeline);
    const same = { ...hass, states: { ...hass.states } };
    card.hass = same;
    await settle(card);
    expect(hass.callWS).toHaveBeenCalledTimes(1);
    const id = "switch.schedule_chauffage_maison_salon";
    card.hass = {
      ...same,
      states: { ...same.states, [id]: { ...same.states[id], last_updated: "later" } },
    };
    await settle(card);
    expect(hass.callWS).toHaveBeenCalledTimes(2);
  });

  it("explains when the schedules cannot be read", async () => {
    const hass = makeHass("Maison");
    hass.callWS.mockRejectedValue(new Error("unknown command"));
    const card = await renderCard(hass, timeline);
    expect($(card, "ha-alert")!.textContent).toContain("Scheduler");
  });
});
