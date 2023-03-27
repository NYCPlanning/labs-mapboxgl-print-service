# labs-mapboxgl-print-service

Print Layout Service for MapboxGL Web Maps

## Requirements

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm) **version listed in .nvmrc**

## Local development

* Clone this repo: `git clone git@github.com:NYCPlanning/labs-mapboxgl-print-service.git`
* Navigate to the directory: `cd labs-mapboxgl-print-service`
* Install dependencies: `npm install`
* Start the server: `npm run start`
* Visit your app at [http://localhost:3000](http://localhost:3000).

## How to Use

The service consists of a single page react frontend served at `/`, and an API for POSTing and GETing configurations.

### Endpoints

`POST /config` - receives a JSON config object and stores it in a session.  If invalid, returns a JSON error message

`GET /config` - gets the JSON config object associated with this session.  If none exist, returns a JSON encoded error message.

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
