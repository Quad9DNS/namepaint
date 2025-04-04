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
