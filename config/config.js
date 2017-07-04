var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    db: 'mongodb://localhost/auction',
    root: rootPath,
    app: {
      name: 'auction'
    },   
    login_redirect: '/auction',
    secret: 'ilovenodeexpress',
  },
  production: {
    db: 'mongodb://localhost/auction',
    root: rootPath,
    app: {
      name: 'auction'
    },
    login_redirect: '/auction',  
    secret: 'ilovenodeexpress',  
  },
  test: {
    db: 'mongodb://localhost/test_auction',
    root: rootPath,
    app: {
      name: 'auction'
    },
    login_redirect: '/auction',  
    secret: 'ilovenodeexpress',  
  }
  
}