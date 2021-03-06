import { entities } from "./entities";

import "./ha-demo-card";
// Not duplicate, one is for typing.
// tslint:disable-next-line
import { HADemoCard } from "./ha-demo-card";
import { MockHomeAssistant } from "../../src/fake_data/provide_hass";
import { HUIView } from "../../src/panels/lovelace/hui-view";
import { selectedDemoConfig } from "./configs/demo-configs";

export const mockLovelace = (hass: MockHomeAssistant) => {
  hass.addEntities(entities);

  hass.mockWS("lovelace/config", () =>
    selectedDemoConfig.then((config) => config.lovelace())
  );

  hass.mockWS("frontend/get_translations", () => Promise.resolve({}));
  hass.mockWS("lovelace/config/save", () => Promise.resolve());
};

// Patch HUI-VIEW to make the lovelace object available to the demo card
const oldCreateCard = HUIView.prototype.createCardElement;

HUIView.prototype.createCardElement = function(config) {
  const el = oldCreateCard.call(this, config);
  if (el.tagName === "HA-DEMO-CARD") {
    (el as HADemoCard).lovelace = this.lovelace;
  }
  return el;
};
