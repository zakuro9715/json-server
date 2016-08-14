var request = require('supertest')
var jsonServer = require('../../src/server')

/* global beforeEach, describe, it */
describe('Server', function () {
  var server
  var router
  var db

  beforeEach(function () {
    db = { user: { id: 1, name: 'zakuro' } }
    server = jsonServer.create()
    router = jsonServer.router(db)
  })

  describe('Basic user:pass', function () {
    beforeEach(function () {
      server.use(jsonServer.defaults({ auth: 'Basic user:pass' }))
      server.use(router)
    })

    it('should return unauthorized if no authorization', function (done) {
      request(server)
        .get('/user')
        .expect('WWW-Authenticate', 'Basic realm="Authorization Required"')
        .expect(401, done)
    })

    it('should return unauthorized if invalid authorization', function (done) {
      request(server)
        .get('/user')
        .set('Authorization', 'Basic dTpw')
        .expect('WWW-Authenticate', 'Basic realm="Authorization Required"')
        .expect(401, done)
    })

    it('should respond when correct authorization', function (done) {
      request(server)
        .get('/user')
        .set('Authorization', 'Basic dXNlcjpwYXNz')
        .expect(200, done)
    })
  })

  describe('Token token', function () {
    beforeEach(function () {
      server.use(jsonServer.defaults({ auth: 'Token token' }))
      server.use(router)
    })

    it('should return unauthorized if no authorization', function (done) {
      request(server)
        .get('/user')
        .expect('WWW-Authenticate', 'Token realm="Authorization Required"')
        .expect(401, done)
    })

    it('should return unauthorized if invalid authorization', function (done) {
      request(server)
        .get('/user')
        .set('Authorization', 'Token hello')
        .expect('WWW-Authenticate', 'Token realm="Authorization Failed"')
        .expect(401, done)
    })
    it('should respond when correct authorization', function (done) {
      request(server)
        .get('/user')
        .set('Authorization', 'Token token')
        .expect(200, done)
    })
  })
})
