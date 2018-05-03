# labs-map-print

Print Layout Service for MapboxGL Web Maps

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
