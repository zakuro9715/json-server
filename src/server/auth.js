var basicAuthConnect = require('basic-auth-connect')

function basicAuth (value) {
  var splitedValue = value.split(':')
  var username = splitedValue[0]
  var password = splitedValue[1]
  return basicAuthConnect(username, password)
}

function unauthorized (res, scheme, realm) {
  res.statusCode = 401
  res.setHeader('WWW-Authenticate', scheme + ' realm="' + realm + '"')
  res.end()
}

function genericAuth (scheme, value) {
  return function (req, res, next) {
    var authorization = req.headers.authorization
    if (!authorization) {
      return unauthorized(res, scheme, 'Authorization Required')
    }
    var parts = authorization.split(' ')
    if (parts[0] !== scheme || parts.slice(1).join(' ') !== value) {
      return unauthorized(res, scheme, 'Authorization Failed')
    }
    next()
  }
}

module.exports = function (opt) {
  var splitedOpt = opt.split(' ')
  var scheme = splitedOpt[0]
  var value = splitedOpt.slice(1).join(' ')

  switch (scheme.toLowerCase()) {
    case 'basic':
      return basicAuth(value)
    default:
      return genericAuth(scheme, value)
  }
}
