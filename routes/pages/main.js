var express = require('express');
var router = express.Router();
var index = require("../../index.js");
var fs = require("fs");
var moment = require("moment");
var latest_file = "";

var history = [];
var current = {}

fs.readFile('./history.json', (err, data) => {
  if(err) {flush_history(); console.log(err);}
  if(data!=undefined) history = JSON.parse(data);
});


router.get('/',function(req,res){
  res.render("main/index")
});

router.get('/history',function(req,res){
  res.render("main/history", {"history":history})
});

router.get('/fetch',function(req,res){
  index.broadcast(JSON.stringify({"recognized":req.query.obj, "confidence": req.query.confidence}));
  current.recognized = req.query.obj;
  current.confidence = req.query.confidence;
  current.recorded = new Date();
  history.unshift(current);
  current={}
  flush_history();
  res.send(JSON.stringify({status:"ok"}))
});

router.post('/upload',function(req,res){
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
      latest_file = moment().format("DDMMYY_HHmmss") + ".jpg";
      if(current.file!=undefined) flush_history();
      current={};
      current.file = latest_file;
      current.captured = new Date();
      var fstream = fs.createWriteStream(__dirname + '/../../public/files/' + latest_file);
      file.pipe(fstream);
      fstream.on('close', function () {
        index.broadcast(JSON.stringify({"file":latest_file}));
        res.send({status:"ok"})
      });
  });
});

function flush_history(){
  fs.writeFile('./history.json', JSON.stringify(history), (err) => {
    if(err) console.log(err);
  });
}

module.exports = router;
