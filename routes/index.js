var express = require('express');
var router = express.Router();

let defaults = {
  mapConfig: JSON.stringify({
    container: 'map',
    style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json',
    center: [-73.93181409196421,40.708434183373726],
    zoom: 10.2,
    bearing: 0,
    pitch: 0,
  }),
  title: 'Map Title',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
}


/* POST to render a map */
router.post('/', function(req, res, next) {
  const { style, center, zoom, bearing, pitch, title, content } = req.body;
  res.render('index', {
    mapConfig: JSON.stringify({
      container: 'map',
      style,
      center,
      zoom,
      bearing,
      pitch
    }),
    title,
    content,
  });
});

/* GET for testing and development */
router.get('/', function(req, res, next) {
  res.render('index', defaults);
});

module.exports = router;
