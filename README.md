# labs-map-print

Print Layout Service for MapboxGL Web Maps

## How to use

`POST` a json object with style, center, zoom, bearing, pitch, and header properties.

`style` should be a valid mapboxGL style.  See below.

To create a landscape print map from the js console, assuming `map` exists as a global variable:
```
fetch('http://localhost:3000',{
  method:'POST',
  headers:{
    Accept:'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    style: map.getStyle(),
    center: map.getCenter(),
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  })
})
  .then(res => res.text())
  .then((text) => { var w = window.open('about:blank');
    w.document.open();
    w.document.write(text);
    w.document.close();
  });
```
