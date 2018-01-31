'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

function requiredConfig(name) {
  var x = require('./' + process.env.NODE_ENV + '.js')
  if(!x[name]) {
    throw new Error('You must set the ' + name + ' config variable');
  }
  return x[name];
}

if(process.env.NODE_ENV==undefined) {process.env.NODE_ENV = 'development'}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/..'),

  // Server port
  port: process.env.PORT || 80,

  // Should we wipe out data clean
  datawipe: false,

  // Should we populate the DB with sample data?
  seedDB: false,

  authenticate: true,

  //Log SQL queries on console
  sqllogging:false

};
requiredProcessEnv("NODE_ENV");



// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
