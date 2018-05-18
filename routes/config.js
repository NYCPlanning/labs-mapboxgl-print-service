const express = require('express');
const { Validator, ValidationError } = require('express-json-validator-middleware');
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

// Initialize a Validator instance first
const validator = new Validator({allErrors: true}); // pass in options to the Ajv instance

// Define a shortcut function
const validate = validator.validate;

// Define a JSON Schema
const PrintSchema = {
  type: 'object',
  required: ['title', 'mapConfig'],
  properties: {
    title: {
      type: 'string',
    },
    mapConfig: {
      type: 'object',
      required: ['style', 'center', 'zoom'],
      properties: {
        style: {
          type: 'object',
        },
        center: {
          type: 'object',
          properties: {
            lng: {
              type: 'number',
            },
            lat: {
              type: 'number',
            },
          }
        },
        zoom: {
          type: 'number',
        },
        bearing: {
          type: 'number',
        },
        pitch: {
          type: 'number',
        },
      }
    },
    content: {
      type: 'string',
    },
    legend: {
      type: 'array',
    },
  }
}

/* POST /config */
router.post('/', validate({body: PrintSchema}), (req, res, next) => {
  console.log(req);
  const {
    style, center, zoom, bearing, pitch, title, content, legend
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
