'use strict';

module.exports = (function() {
  const env = process.env.NODE_ENV || 'development';
  const host = process.env.host || 'localhost';
  const port = process.env.port || 3030;

  const dbConstants = databaseConfig();
  const appConstants = applicationConfig();

  console.info('CONFIG VERSION =   ' + env);

  const obj = {
    application: {
      url: appConstants[env].url,
      host: appConstants[env].host,
      port: appConstants[env].port
    },
    db: {
      host: dbConstants[env].host,
      user: dbConstants[env].user,
      password: dbConstants[env].password,
      database: dbConstants[env].database,
      dialect: dbConstants[env].dialect,
      sync: dbConstants[env].sync,
      forceSync: dbConstants[env].forceSync,
      seedDB: dbConstants[env].seedDB,
      logging: dbConstants[env].logging
    },
    server: {
      defaultHost: 'http://localhost:8001'
    }
  };

  if (!obj.application.host) {
    throw new Error('Missing constant application.host. ' +
      'Check your environment variables NODE_HOST.');
  } else if (!obj.application.port) {
    throw new Error('Missing constant application.port. ' +
      'Check your environment variable NODE_PORT.');
  } else if (!obj.db.host) {
    throw new Error('Missing constant database.host. ' +
      'Check your environment variables.');
  } else if (!obj.db.user) {
    throw new Error('Missing constant database.user. ' +
      'Check your environment variables.');
  } else if (!obj.db.password) {
    throw new Error('Missing constant database.password. ' +
      'Check your environment variables.');
  } else if (!obj.db.database) {
    throw new Error('Missing constant database.database. ' +
      'Check your environment variables.');
  } else if (!obj.db.dialect) {
    throw new Error('Missing constant database.dialect. ' +
      'Check your environment variables.');
  }

  return obj;

  function databaseConfig() {
    return {
      'production': {
        'host': 'fb3d-dev-cluster.cluster-c7o4drslekdy.us-east-1.rds.amazonaws.com',
        'port': 3306,
        'user': 'F3DADMIN',
        'password': 'allyourdatabase',
        'database': 'FB3D',
        'dialect': 'mysql',
        'sync': true,
        'forceSync': false,
        'seedDB': false,
        'logging': false
      },
      'development': {
        'host': '127.0.0.1',
        'port': 3306,
        'user': 'F3DADMIN',
        'password': 'allyourdatabase',
        'database': 'FB3D',
        'dialect': 'mysql',
        'sync': true,
        'forceSync': false,
        'seedDB': false,
        'logging': console.log
      },
      'test': {
        'host': 'localhost',
        'port': 3306,
        'user': 'root',
        'password': 'root',
        'database': 'f3d_test',
        'dialect': 'mysql',
        'sync': false,
        'forceSync': false,
        'seedDB': false,
        'logging': console.log
      }
    };
  }

  function cacheConfig() {
    return {
      'production': {
        'url': 'https://' + host + ':' + port,
        'host': host,
        'port': port
      },
      'development': {
        'url': 'http://' + host + ':' + port,
        'host': host,
        'port': port
      },
      'test': {
        'url': 'http://' + host + ':' + port,
        'host': host,
        'port': port
      }
    };
  }

  function applicationConfig() {
    return {
      'production': {
        'url': 'https://' + host + ':' + port,
        'host': host,
        'port': port
      },
      'development': {
        'url': 'http://' + host + ':' + port,
        'host': host,
        'port': port
      },
      'test': {
        'url': 'http://' + host + ':' + port,
        'host': host,
        'port': port
      }
    };
  }
})
();
