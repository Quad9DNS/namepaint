import { Settings } from "./settings";
import { promptPassword } from "./password_prompt";
import { WordData } from "./words";

var websocketCredentials: string | null = null;
const connectionStatus: { [key: number]: string } = {
  [WebSocket.CONNECTING]: 'Connecting',
  [WebSocket.OPEN]: 'Open',
  [WebSocket.CLOSING]: 'Closing',
  [WebSocket.CLOSED]: 'Closed',
};

var websocket: WebSocket | null = null;

/**
  * UI elements related to websocket control
  */
export interface WsFields {
  /**
    * Status element - used to display connection URL and status
    */
  status: HTMLElement,
  /**
    * Connect button element - used to initiate connection to websocket server
    */
  connectButton: HTMLButtonElement,
  /**
    * URL input element - field which can be used to customize websocket connection url
    */
  url: HTMLInputElement,
  /**
    * Username input element - field which can be used to customize username to use at connection - optional
    */
  username: HTMLInputElement,
  /**
    * Password input element - field which can be used to customize password to use at connection - optional
    */
  password: HTMLInputElement,
  /**
    * Container of websocket configuration elements - mainly used to hide and show as needed
    */
  configurationContainer: HTMLElement
}

/**
  * Prepares websocket options by connecting passed fields to event handler, connecting when connect button is pressed
  * All the data is converted into {@link WordData} before being pushed into the queue
  *
  * @param fields UI elements that are used to control websocket
  * @param settingsFields UI elements that are used for settings, to configure filters section
  * @param newWordsQueue queue to push incoming websocket data into - this should be shared with other components that need to consume this data
  * @param settings Settings container which is used for filter configuration
  */
export function setupWebsocket(
  fields: WsFields,
  newWordsQueue: WordData[],
  settings: Settings,
  autoConnect: boolean
) {
  fields.url.value = settings.websocketUrl;
  fields.username.value = settings.websocketUsername;
  if (settings.websocketUsername && !settings.websocketPassword && autoConnect) {
    promptPassword({
      text: "Password for " + settings.websocketUsername,
      buttonText: undefined,
      callback: (password: string) => {
        fields.password.value = password;
        if (autoConnect) {
          connectToWebsocket(fields, newWordsQueue, settings);
        }
      }
    });
  } else {
    fields.password.value = settings.websocketPassword;
  }
  if (autoConnect && fields.password.value.length > 0) {
    connectToWebsocket(fields, newWordsQueue, settings);
  }
  fields.connectButton.addEventListener("click", (_event: Event) => {
    connectToWebsocket(fields, newWordsQueue, settings);
  });
}

function connectToWebsocket(
  fields: WsFields,
  newWordsQueue: WordData[],
  settings: Settings
) {
  if (setWebsocketUrl(fields.url, settings) && setWebsocketCredentials(fields.username, fields.password, settings)) {
    connectWebsocket(fields, newWordsQueue, settings);
  }
}

/**
  * Updates UI elements related to websocket status
  * This should be called periodically to ensure status is updated in time
  *
  * @param fields UI elements that are used to display websocket status
  * @param settings Settings container which is used to optionally disable this element
  */
export function updateWebsocketStatus(fields: WsFields, settings: Settings) {
  if (websocket != null) {
    const status = connectionStatus[websocket.readyState];
    fields.status.hidden = !settings.showWebsocketStatus || websocket.readyState == WebSocket.CLOSED;
    fields.status.innerHTML = `Websocket server: ${settings.websocketUrl} - ${status}`;
  }
}

function setWebsocketUrl(
  urlField: HTMLInputElement,
  settings: Settings
): boolean {
  const newUrl = urlField.value;
  const parsedUrl = URL.parse(newUrl);
  if (parsedUrl == null) {
    urlField.setCustomValidity("Invalid URL!");
    return false;
  }
  urlField.setCustomValidity("");

  settings.setWebsocketUrl(newUrl);

  return true;
}

function setWebsocketCredentials(
  usernameField: HTMLInputElement,
  passwordField: HTMLInputElement,
  settings: Settings
): boolean {
  const username = usernameField.value;
  const password = passwordField.value;
  if (!username && !password) {
    settings.setWebsocketUsername(username);
    websocketCredentials = null;
    return true;
  }

  if (username.includes(":")) {
    usernameField.setCustomValidity("Username can't contain :");
    return false;
  }
  usernameField.setCustomValidity("");
  passwordField.setCustomValidity("");

  settings.setWebsocketUsername(username);
  websocketCredentials = encodeURIComponent(btoa(`${username}:${password}`));
  return true;
}

type WsData = {
  /**
    * Name to display, exact text
    */
  name: string,
  /**
    * Font to use. Defaults to QuadSans. "random" is a valid value, which will pick one of available fonts randomly.
    */
  font: string | null,
  /**
    * Font size to use. Defaults to 24. "random" is a valid value, which will pick a random font size between 3 and 50.
    */
  size: number | string | null,
  /**
    * Color to use. Default to a random color.
    */
  color: string | null,
  /**
    * Time to display text before starting fade animation. Defaults to 250ms.
    */
  stayTime: number | null,
  /**
    * How long to fade out the text before completely disappearing. Defaults to 20000ms.
    */
  decayTime: number | null,
  /**
    * Text rotation angle. Defaults to a random angle between -60 and 60.
    */
  rotation: number | null
};

function connectWebsocket(
  fields: WsFields,
  newWordsQueue: WordData[],
  settings: Settings
) {
  try {
    if (websocketCredentials != null) {
      websocket = new WebSocket(settings.websocketUrl, websocketCredentials);
    } else {
      websocket = new WebSocket(settings.websocketUrl);
    }
  } catch (e: any) {
    console.log("Websocket connection failed.");
    fields.url.setCustomValidity("Websocket error!");
    fields.username.setCustomValidity("Websocket error!");
    fields.password.setCustomValidity("Websocket error!");
    return;
  }
  websocket.addEventListener("error", (event: Event) => {
    fields.url.setCustomValidity("Websocket error!");
    console.log("WebSocket error: ", event);
    fields.status.hidden = true;
    fields.configurationContainer.style.display = "";
  });

  websocket.addEventListener("close", (event: CloseEvent) => {
    if (!event.wasClean) {
      fields.url.setCustomValidity("Websocket error!");
      fields.username.setCustomValidity("Websocket error!");
      fields.password.setCustomValidity("Websocket error!");
    }
    fields.status.hidden = true;
    fields.configurationContainer.style.display = "";
    setInterval(() => {
      connectWebsocket(fields, newWordsQueue, settings);
    }, settings.websocketAutoreconnectIntervalMs);
  })

  websocket.addEventListener("open", (_event: Event) => {
    fields.status.hidden = !settings.showWebsocketStatus;
    fields.configurationContainer.style.display = "none";
  })

  websocket.addEventListener("message", (event: MessageEvent) => {
    const incomingEvent: WsData = JSON.parse(event.data, (k: string, v: any) => {
      if (k == "size") {
        if (v == "random") {
          return v;
        } else {
          return parseFloat(v);
        }
      } else if (k == "stayTime" || k == "decayTime" || k == "rotation") {
        return parseInt(v);
      } else {
        return v;
      }
    });
    if (incomingEvent) {
      if (newWordsQueue.length < settings.maxQueuedItems) {
        newWordsQueue.push(new WordData(incomingEvent.name, incomingEvent.font, incomingEvent.size, incomingEvent.color, incomingEvent.stayTime, incomingEvent.decayTime, incomingEvent.rotation));
      } else {
        console.log("Ignoring incoming data, because the queue is full.");
      }
    } else {
      console.log("Incoming data didn't match expected format: " + event.data);
    }
  });
}
