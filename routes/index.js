var express = require('express');
var router = express.Router();

/* POST to render a map */
router.post('/', function(req, res, next) {
  const json = JSON.stringify(req.body);
  res.render('index', { json });
});

/* GET for testing and development */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
