import {
  html,
  LitElement,
  PropertyDeclarations,
  TemplateResult,
} from "lit-element";

import "../components/hui-generic-entity-row";
import "../components/hui-timestamp-display";
import "./hui-error-entity-row";

import { HomeAssistant } from "../../../types";
import { EntityRow, EntityConfig } from "./types";

import computeStateDisplay from "../../../common/entity/compute_state_display";
import { hassLocalizeLitMixin } from "../../../mixins/lit-localize-mixin";

interface SensorEntityConfig extends EntityConfig {
  format?: "relative" | "date" | "time" | "datetime";
}

class HuiSensorEntityRow extends hassLocalizeLitMixin(LitElement)
  implements EntityRow {
  public hass?: HomeAssistant;
  private _config?: SensorEntityConfig;

  static get properties(): PropertyDeclarations {
    return {
      hass: {},
      _config: {},
    };
  }

  public setConfig(config: SensorEntityConfig): void {
    if (!config) {
      throw new Error("Configuration error");
    }
    this._config = config;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];

    if (!stateObj) {
      return html`
        <hui-error-entity-row
          .entity="${this._config.entity}"
        ></hui-error-entity-row>
      `;
    }

    return html`
      ${this.renderStyle()}
      <hui-generic-entity-row .hass="${this.hass}" .config="${this._config}">
        <div>
          ${
            stateObj.attributes.device_class === "timestamp"
              ? html`
                  <hui-timestamp-display
                    .hass="${this.hass}"
                    .ts="${new Date(stateObj.state)}"
                    .format="${this._config.format}"
                  ></hui-timestamp-display>
                `
              : computeStateDisplay(this.localize, stateObj, this.hass.language)
          }
        </div>
      </hui-generic-entity-row>
    `;
  }

  private renderStyle(): TemplateResult {
    return html`
      <style>
        div {
          text-align: right;
        }
      </style>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-sensor-entity-row": HuiSensorEntityRow;
  }
}

customElements.define("hui-sensor-entity-row", HuiSensorEntityRow);
