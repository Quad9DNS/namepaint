# namepaint
Take a websocket of data in JSON format and randomly place string data in a window

Install dependencies with `npm install`

To build: `npm run build`
To run development server: `npm run dev`

## Configuration

There are some environment variables which can be used to control the app in build time (when using `npm run build`):
| Variable name                  | Default value                       | Description                                                             |
|--------------------------------|-------------------------------------|-------------------------------------------------------------------------|
| VITE_WEBSOCKET_URL             | wss://view.quad9.net/websocket/5000 | Default websocket URL                                                   |
| VITE_AUTORECONNECT_INTERVAL_MS | 5000                                | Automatically reconnect to websocket on disconnection in given interval |
| VITE_RELOAD_INTERVAL_MS        | undefined                           | If defined, page will be reloaded automatically in given interval       |

Besides environment variables which can be used to control the app in build time, there are also runtime options that can control the app in runtime, which are set as URL query params:

| Variable name                  | Default value                       | Description                                                             |
|--------------------------------|-------------------------------------|-------------------------------------------------------------------------|
| showWebsocketStatus              | false                               | Whether to display current websocket status in bottom right corner                             |
| showDateAndTime                  | true                                | Whether to display current date and time in bottom right corner                                |
| itemsPerSecond                   | 50                                  | Max number of items to add to display per second. Anything above this will be queued up        |
| maxQueuedItems                   | 10000                               | Max number of items to keep in queue and wait for display. Anything above this will be dropped |
| websocketUrl                     | VITE_WEBSOCKET_URL                  | Default websocket URL                                                                          |
| websocketUsername                |                                     | Username to prepopulate for websocket connection                                               |
| websoscketPassword               |                                     | Password to prepopulate for websocket connection                                               |
| websocketAutoreconnectIntervalMs | VITE_AUTORECONNECT_INTERVAL_MS      | Automatically reconnect to websocket on disconnection in given interval                        |
| autoconnnect                     | false                               | Automatically connect to websocket on page laod. Prompts for password if not provided          |
