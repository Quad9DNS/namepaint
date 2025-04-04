import { updateDate } from './datetime';
import { setupPasswordPromptDialog } from './password_prompt';
import { Settings, SettingsChangedEvent } from './settings';
import './style.css'
import { setupWebsocket, updateWebsocketStatus, WsFields } from './websocket';
import { setupWordsVisualization, WordData } from './words';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; overflow: hidden;">
    <div id="visualization" style="width: 100%; height: 100vh;"></div>
    <div style="position: absolute; bottom: 10px; right: 10px; zIndex: 20px; padding: 10px;">
      <p id="datetimedisplay" style="font-size: 0.8em; text-align: end; margin-bottom: 5px; line-height: 1;"></p>
      <p id="wsstatus" style="font-size: 0.8em; text-align: end; margin-bottom: 5px; line-height: 1;" hidden>Websocket server: - </p>
      <div id="wsconfigcontainer" class="two-col-grid">
        <label for="wsusername">Username:</label>
        <input type="text" id="wsusername" name="wsusername" />
        <label for="wspassword">Password:</label>
        <input type="password" id="wspassword" name="wspassword" />
        <label for="wsurl" id="wsurllabel">Websocket url:</label>
        <input type="text" id="wsurl" name="wsurl" />
        <button id="connectbutton" type="button" style="grid-area: footer;">Connect</button>
      </div>
    </div>
    <div id="password-dialog-container"></div>
  </div>
`;
const container = document.querySelector<HTMLDivElement>('#visualization')!;

var settings = new Settings();
settings.loadUrlSeachParameters(new URLSearchParams(window.location.search));

var dateTimeDisplay = document.querySelector<HTMLParagraphElement>('#datetimedisplay')!;
var wsFields: WsFields = {
  status: document.querySelector<HTMLParagraphElement>('#wsstatus')!,
  connectButton: document.querySelector<HTMLButtonElement>('#connectbutton')!,
  url: document.querySelector<HTMLInputElement>('#wsurl')!,
  username: document.querySelector<HTMLInputElement>('#wsusername')!,
  password: document.querySelector<HTMLInputElement>('#wspassword')!,
  configurationContainer: document.querySelector<HTMLDivElement>('#wsconfigcontainer')!,
}

settings.addChangedListener((_event: CustomEvent<SettingsChangedEvent>) => {
  if (window.history.replaceState) {
    var currentUrl = new URL(window.location.toLocaleString());
    currentUrl.search = settings.toUrlSearchParameters().toString();
    window.history.replaceState(null, "", currentUrl.toString());
  }

  // Immediately update visibility
  updateDate(dateTimeDisplay, new Date(), settings);
  updateWebsocketStatus(wsFields, settings);
});

updateDate(dateTimeDisplay, new Date(), settings);
updateWebsocketStatus(wsFields, settings);

// Update date and websocket status every second
setInterval(() => {
  const currentTime = new Date();
  updateDate(dateTimeDisplay, currentTime, settings);
  updateWebsocketStatus(wsFields, settings);
}, 1000);

var newWordsQueue: WordData[] = [];

setupPasswordPromptDialog(document.querySelector<HTMLElement>('#password-dialog-container')!);
setupWebsocket(wsFields, newWordsQueue, settings, settings.autoconnect);
setupWordsVisualization(container, newWordsQueue);

declare global {
  interface Window {
    WordData: typeof WordData;
    addWord: (newWord: WordData) => void;
  }
}
if (import.meta.env.MODE == "development") {
  window.WordData = WordData;
  window.addWord = (newWord: WordData) => {
    newWordsQueue.push(newWord);
  };
}

if (import.meta.env.VITE_RELOAD_INTERVAL_MS) {
  setTimeout(() => {
    location.reload();
  }, import.meta.env.VITE_RELOAD_INTERVAL_MS);
}
