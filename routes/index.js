var express = require('express');
var router = express.Router();

/* GET home page. */
const diploma = require("../controllers/diplomaController");

router.get('/', diploma.index);

module.exports = router;
