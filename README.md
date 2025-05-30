# namepaint
Take a websocket of data in JSON format and randomly place string data in a window

Install dependencies with `npm install`

To build: `npm run build`
To run development server: `npm run dev`

## Websocket data

Data that is expected from websocket is defined in [websocket.ts (WsData)](./src/websocket.ts#L151).
| Key        | Default value    | Description                                                             |
|------------|------------------|-------------------------------------------------------------------------|
| name       | - (required)     | Name to display, exact text                                             |
| font       | QuadSans         | Font to use. "random" is a valid value (picks out of available fonts)   |
| size       | 24               | Font size. "random" is a valid value, which picks between 3..50         |
| color      | random           | Color to use. May be a hex string or a HTML color code                  |
| stayTime   | 250              | Time in milliseconds to display text before starting the fade animation |
| decayTime  | 20000            | Time in milliseconds for the fade animation to last, before removal     |
| rotation   | random(-60, 60)  | Text rotation in degrees                                                |

## Configuration

There are some environment variables which can be used to control the app in build time (when using `npm run build`):
| Variable name                  | Default value                       | Description                                                                      |
|--------------------------------|-------------------------------------|----------------------------------------------------------------------------------|
| VITE_WEBSOCKET_URL             | wss://view.quad9.net/websocket/5000 | Default websocket URL                                                            |
| VITE_AUTORECONNECT_INTERVAL_MS | 5000                                | Automatically reconnect to websocket on disconnection in given interval          |
| VITE_RELOAD_INTERVAL_MS        | undefined                           | If defined, page will be reloaded automatically in given interval                |
| VITE_APP_INFO_DIALOG_CONTENTS  | Quad9 Newly Observed Domains info   | Text for app info dialog (logo click triggered). Expects HTML formatted content. |


Besides environment variables which can be used to control the app in build time, there are also runtime options that can control the app in runtime, which are set as URL query params:

| Variable name                    | Default value                       | Description                                                                                    |
|----------------------------------|-------------------------------------|------------------------------------------------------------------------------------------------|
| showWebsocketStatus              | false                               | Whether to display current websocket status in bottom right corner                             |
| showDateAndTime                  | true                                | Whether to display current date and time in bottom right corner                                |
| showLogo                         | true                                | Whether to display Quad9 logo in top right corner                                              |
| itemsPerSecond                   | 50                                  | Max number of items to add to display per second. Anything above this will be queued up        |
| maxQueuedItems                   | 10000                               | Max number of items to keep in queue and wait for display. Anything above this will be dropped |
| websocketUrl                     | VITE_WEBSOCKET_URL                  | Default websocket URL                                                                          |
| websocketUsername                |                                     | Username to prepopulate for websocket connection                                               |
| websoscketPassword               |                                     | Password to prepopulate for websocket connection                                               |
| websocketAutoreconnectIntervalMs | VITE_AUTORECONNECT_INTERVAL_MS      | Automatically reconnect to websocket on disconnection in given interval                        |
| autoconnnect                     | false                               | Automatically connect to websocket on page laod. Prompts for password if not provided          |
