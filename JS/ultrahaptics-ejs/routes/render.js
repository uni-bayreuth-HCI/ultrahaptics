let express = require('express');
let router = express.Router();
let renderCoordinates = require('../src/js/renderCoordinates')
/* GET users listing. */
router.post('/', function(req, res, next) {
  
  res.send(renderCoordinates(req.body.coordinates));
});

module.exports = router;
