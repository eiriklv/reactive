/*global before, after, describe, it */

var supertest = require('supertest'),
    sinon = require('sinon'),
    server = require('../server'),
    Store = require('../src/Store')

describe('server', function() {
  before(function() {
    sinon
      .stub(Store.prototype, 'fetchUrl')
      .yields(null, {message: 'Hello'})
  })

  after(function() {
    Store.prototype.fetchUrl.restore()
  })

  it('should respond with "Hello" in both markup and initial client data', function(done) {
    supertest(server)
      .get('/')
      .expect(200)
      .expect(/<span[^>]+>Hello<\/span>/)
      .expect(/{"message":"Hello"}/)
      .end(done)
  })
  it('should pass request parameters to components', function(done) {
    supertest(server)
      .get('/products/fancy-jacket')
      .expect(200)
      .expect(/Product #<\/span><span[^>]+>fancy-jacket<\/span>/, done)
  })

  it('should handle components with event listeners', function(done) {
    supertest(server)
      .get('/products')
      .expect(200)
      .expect(/<h1[^>]+>Products<\/h1>/, done)
  })
})
