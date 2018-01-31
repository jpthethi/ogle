var express = require('express');
var router = express.Router();
var moment = require("moment");

router.get('/test',function(req,res){
  res.send({});
});

module.exports = router;
