
var Server = require('../index');
var Q = require('q');
var request = require('request');

describe('voicer-web', function () {
  var peernames = [ 
    { 
      "name": "name",
      "target": "target",
      "variants": [
        "variant1",
        "variant2"
      ]
    }
  ];

  var peernamesString = JSON.stringify(peernames);

  var source = {
    getData: function () {    
      return Q.resolve(peernamesString);
    },
    saveData: function (data) {
      return Q.resolve('ok');
    }
  };

  var config = {
    port: 30011,
    auth: true,
    username: 'vasiliy',
    password: 'test',
    realm: 'Hello!'
  };

  var server = new Server(source, config);
  server.start();

  it('not auth access', function (done) {
    var callback = function (err, response, body) {
      expect(response.statusCode).toEqual(401);
      expect(body).toEqual('401 Unauthorized');
      done();
    }
    request.get('http://localhost:30011', callback);
  });

  it('auth access', function (done) {
    var callback = function (err, response, body) {
      expect(response.statusCode).toBe(200);
      done();
    }
    request.get('http://localhost:30011', callback).auth('vasiliy', 'test');
  });

  it('get right peernames.json', function (done) {
    var callback = function (err, response, body) {
      expect(body).toBe(peernamesString);
      done();
    }
    request.get('http://localhost:30011/peernames.json', callback).auth('vasiliy', 'test');
  });

  it('get right peernames.json', function (done) {
    var callback = function (err, response, body) {      
      expect(body).toBe('ok');
      done();
    }
    request.post('http://localhost:30011/peernames.json', callback).auth('vasiliy', 'test');
  });

});