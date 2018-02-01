var express = require('express');
var router = express.Router();
var index = require("../../index.js");
var fs = require("fs");
var moment = require("moment");

var latest_file = "";
router.get('/fetch',function(req,res){
  index.broadcast(JSON.stringify({"recognized":req.query.obj, "confidence": "100"}));
  res.send(JSON.stringify({status:"ok"}))
});

router.post('/upload',function(req,res){
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
      latest_file = moment().format("DDMMYY_HHmmss") + ".jpg";
      //console.log("Uploading: " + filename);
      var fstream = fs.createWriteStream(__dirname + '/../..//public/files/' + latest_file);
      file.pipe(fstream);
      fstream.on('close', function () {
        console.log("send on socket_" + latest_file);
        index.broadcast(JSON.stringify({"file":latest_file}));
        console.log("done - send on socket" + latest_file);
        res.send({status:"ok"})
      });
  });
});

module.exports = router;
