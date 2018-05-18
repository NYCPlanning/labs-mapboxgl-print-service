# labs-mapboxgl-print-service

Print Layout Service for MapboxGL Web Maps.

This is a simple express.js server that receives a print config object as JSON via `POST`, stores it using an express session, and serves it up again on `GET`.  The frontend is a simple react.js application that provides a print-friendly layout, complete with title, subtitle, legend, source text, and content.

## How to Use

The service is deployed at https://map-print.planninglagbs.nyc.

Configure your mapboxGL mapping application to `POST` a valid config object to `/config`, then open https://map-print.planninglagbs.nyc in a new tab.  

Example using the fetch API:
```
// define printConfig object
const printConfig = {...};

fetch('https://map-print.planninglagbs.nyc/config', {
  method: 'POST',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(printConfig),
})
  .then(res => res.json())
  .then((res) => {
    if (res.status === 'success') {
      window.open('https://map-print.planninglagbs.nyc','_blank');
    }
  });

```

### Endpoints

`POST /config` - receives a JSON config object and stores it in a session.  If invalid, returns a JSON error message

`GET /config` - gets the JSON config object associated with this session.  If none exist, returns a JSON encoded error message.

### Config

`printConfig.title` (string) *required*

The title of the printed map

`printConfig.titleEditable` (boolean, default: `true`)

Whether the user can edit the title in the print view.

`printConfig.subtitle` (string)

The subtitle of the printed map

`printConfig.subtitleEditable` (boolean, default: `true`)

Whether the user can edit the subtitle in the print view.

`printConfig.mapConfig` (object) *required*
  - `mapConfig.style` (object) *required*
    A valid mapboxGL style object, usually the result of `map.getStyle()`.
  - `mapConfig.center` (array) *required*
    The center of the current map view, usually the result of `map.getCenter()`.
  - `mapConfig.zoom` (number) *required*
    The zoom level of the current map view, usually the result of `map.getZoom()`.
  - `mapConfig.bearing` (number, default: `0`)
    The rotation of the current map view, usually the result of `map.getBearing()`.
  - `mapConfig.pitch` (number, default: `0`)
    The pitch of the current map view, usually the result of `map.getPitch()`.

`printConfig.content` (string) *required*

Text for the "content" area of the print layout.  This can be used for disclaimer text, or any other multi-line text, which will be overlaid on the map.

`printConfig.contentEditable` (boolean, default: `true`)

Whether the user can edit the content in the print view.

`printConfig.source` (string) *required*

Text for the "source" area of the print layout.  This is meant to be a one-line string that will appear in the far bottom-left of the layout.

`printConfig.sourceEditable` (boolean, default: `true`)

Whether the user can edit the source text in the print view.



#### legend Config




### Example

To create a landscape print map from the js console, assuming `map` exists as a global variable, POST to the `/config` endpoint.  On success, open `/` in a new tab:
```
fetch('http://localhost:3000/config', {
  method: 'POST',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    mapConfig: {
      style: map.getStyle(),
      center: map.getCenter(),
      zoom: map.getZoom(),
      bearing: map.getBearing(),
      pitch: map.getPitch(),
    },
    logo: 'https://raw.githubusercontent.com/NYCPlanning/logo/master/dcp_logo_772.png',
    title: 'This is a test title',
    subtitle: 'This is a test subtitle',
    content: 'This is a test string for the content field',
  }),
})
  .then(res => res.json())
  .then((res) => {
    console.log(res)
    if (res.status === 'success') {
      window.open('http://localhost:3000','_blank');
    }
  })
```
