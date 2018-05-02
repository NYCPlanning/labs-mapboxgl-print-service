const express = require('express');

const router = express.Router();

const defaultConfig = {
  mapConfig: {
    container: 'map',
    style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json',
    center: [-73.93181409196421, 40.708434183373726],
    zoom: 10.2,
    bearing: 0,
    pitch: 0,
  },
  title: 'New York City',
  logo: 'https://raw.githubusercontent.com/NYCPlanning/logo/master/dcp_logo_772.png',
  content: '',
};


/* POST /config */
router.post('/', (req, res, next) => {
  const {
    style, center, zoom, bearing, pitch, title, content, legendConfig
  } = req.body;

  req.session.config = req.body;
  res.json({ status: 'success' });
});

/* GET /config */
router.get('/', (req, res, next) => {
  if (req.session.config) {
    res.json(req.session.config);
  } else {
    res.json(defaultConfig);
  }
});

module.exports = router;
