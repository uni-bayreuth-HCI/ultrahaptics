let express = require('express');
let router = express.Router();
let renderCoordinates = require('../src/js/renderCoordinates')
/* GET users listing. */
router.post('/', function(req, res, next) {
  renderCoordinates(req.body.coordinates);
  return "Rendering"
});

module.exports = router;
