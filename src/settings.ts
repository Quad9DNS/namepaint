
export interface SettingsChangedEvent {
  field_changed: string;
}

/**
  * Holds all currently selected customizable settings
  * Changes should be made using methods, to ensure that events are triggered
  */
export class Settings extends EventTarget {
  private readonly eventType = "settings-changed";
  showWebsocketStatus: boolean = false;
  showDateAndTime: boolean = true;
  showLogo: boolean = true;
  itemsPerSecond: number = 4;
  maxQueuedItems: number = 10000;

  websocketUrl: string = import.meta.env.VITE_WEBSOCKET_URL || "wss://view.quad9.net/websocket/5003";
  websocketUsername: string = "";
  websocketPassword: string = "";
  websocketAutoreconnectIntervalMs: number = import.meta.env.VITE_AUTORECONNECT_INTERVAL_MS || 5000;
  autoconnect: boolean = false;

  setShowWebsocketStatus(newValue: boolean): void {
    this.showWebsocketStatus = newValue;
    this.dispatchChangedEvent("showWebsocketStatus");
  }

  setShowDateAndTime(newValue: boolean): void {
    this.showDateAndTime = newValue;
    this.dispatchChangedEvent("showDateAndTime");
  }

  setShowLogo(newValue: boolean): void {
    this.showLogo = newValue;
    this.dispatchChangedEvent("showLogo");
  }

  setItemsPerSecond(newValue: number): void {
    this.itemsPerSecond = newValue;
    this.dispatchChangedEvent("itemsPerSecond");
  }

  setMaxQueuedItems(newValue: number): void {
    this.maxQueuedItems = newValue;
    this.dispatchChangedEvent("maxQueuedItems");
  }

  setWebsocketUrl(newValue: string): void {
    this.websocketUrl = newValue;
    this.dispatchChangedEvent("websocketUrl");
  }

  setWebsocketUsername(newValue: string): void {
    this.websocketUsername = newValue;
    this.dispatchChangedEvent("websocketUsername");
  }

  setWebsocketPassword(newValue: string): void {
    this.websocketPassword = newValue;
    this.dispatchChangedEvent("websocketPassword");
  }

  setWebsocketAutoreconnectIntervalMs(newValue: number): void {
    this.websocketAutoreconnectIntervalMs = newValue;
    this.dispatchChangedEvent("websocketAutoreconnectIntervalMs");
  }

  setAutoconnect(newValue: boolean): void {
    this.autoconnect = newValue;
    this.dispatchChangedEvent("autoconnect");
  }

  addChangedListener(callback: (event: CustomEvent<SettingsChangedEvent>) => void): void {
    return this.addEventListener(this.eventType, (event: Event) => callback(event as CustomEvent<SettingsChangedEvent>));
  }

  removeChangedListener(callback: (event: CustomEvent<SettingsChangedEvent>) => void): void {
    return this.removeEventListener(this.eventType, (event: Event) => callback(event as CustomEvent<SettingsChangedEvent>));
  }

  dispatchChangedEvent(field_changed: string): boolean {
    return this.dispatchEvent(new CustomEvent<SettingsChangedEvent>(this.eventType, { detail: { field_changed: field_changed } }));
  }

  getValidProperties() {
    return Object.getOwnPropertyNames(this)
      .filter((name) => !["eventType"].includes(name))
  }

  getPropertySetter(property: keyof typeof this): keyof typeof this {
    return "set" + property.toString().charAt(0).toUpperCase() + property.toString().slice(1) as keyof typeof this;
  }

  loadUrlSeachParameters(parameters: URLSearchParams) {
    const validProperties = this.getValidProperties();
    parameters
      .forEach((value, key, _parent) => {
        if (validProperties.includes(key)) {
          const field = this[key as keyof typeof this];
          const setter = this.getPropertySetter(key as keyof typeof this);
          switch (typeof field) {
            case "string":
              (this[setter] as (newValue: string) => void)(value);
              break;
            case "number":
              (this[setter] as (newValue: number) => void)(parseFloat(value));
              break;
            case "boolean":
              (this[setter] as (newValue: boolean) => void)(value === "true");
              break;
            case "bigint":
            case "symbol":
            case "undefined":
            case "object":
            case "function":
              console.log("Failed setting URL property: " + key);
              break;
          }
        }
      });
  }

  toUrlSearchParameters(): URLSearchParams {
    var defaults = new Settings();
    var params =
      this.getValidProperties()
        .reduce((acc, name, _index, _array) => {
          const key = name as keyof typeof defaults;
          const value = this[key];
          if (value != defaults[key]) {
            acc[name] = value as string;
          }
          return acc;
        }, {} as Record<string, string>);
    return new URLSearchParams(params);
  }
}
