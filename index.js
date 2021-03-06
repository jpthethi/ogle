var logger= require('log4js').getLogger();
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var path = require('path');
var server = require('http').createServer(app);
var config = require("./config/environment");
var bodyParser = require('body-parser')
var wss = new require('ws').Server({ server: server , path : "/", perMessageDeflate: false});
var busboy = require('connect-busboy');

app.use(busboy());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(function (err, req, res, next) {
  if(err) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use("/plugins", express.static(path.join(__dirname, './bower_components')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.moment = require('moment')

app.use(function (err, req, res, next) {
  if(err) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  }
})

var apiRouter = express.Router({mergeParams: true});
app.use('/api', apiRouter);
app.use('/', require('./routes/pages/main'));
apiRouter.use('/', require('./routes/api/main'));

//Websocket
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    wss.broadcast(message);
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    try{
      client.send(data);
    }
    catch(e){
      console.log("err"+e);
      console.log(data);
    }
  });
};

server.listen(config.port, function () {
  logger.info('Serving App on port ' + server.address().port)
});

exports.broadcast =  wss.broadcast;
