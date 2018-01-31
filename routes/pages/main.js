var express = require('express');
var router = express.Router();
var index = require("../../index.js");

router.get('/fetch',function(req,res){
  index.broadcast(req.query.obj);
  res.send({status:"ok"})
});


module.exports = router;
