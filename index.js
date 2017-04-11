'use strict';
const Path = require('path');
const Sequelize = require('sequelize');
const Joi = require('joi');
const Promise = require('bluebird');

const internals = {
  optionsSchema: Joi.object({
    db: Joi.object({
      database: Joi.string().required(),
      user: Joi.string().required(),
      password: Joi.string().required(),
      host: Joi.string().required(),
      port: Joi.number().integer().min(1),
      dialect: Joi.string().required(),
      logging: Joi.any().required(),
      sync: Joi.boolean().default(false),
      forceSync: Joi.boolean().default(false),
      seedDB: Joi.boolean().default(false),
      outputPath: Joi.string().min(1)
    }).required()
  }).unknown()
};

exports.register = (server, options, next) => {

  const validateOptions = internals.optionsSchema.validate(options);

  if (validateOptions.error) {
    return next(validateOptions.error);
  }

  let sequelize = null;

  let dbConfig = {
    host: options.db.host,
    dialect: options.db.dialect,
    logging: options.db.logging,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    query: {
      raw: false
    }
  };
  let exposeData = () => {
    return new Promise((resolve, reject) => {

      require(Path.join(__dirname, '/models'))(sequelize, options)
        .then((result) => {
          let models = result;

          server.expose('db', sequelize);
          server.expose('Sequelize', Sequelize);
          server.expose('models', models);

          console.log('DB connection success');

          let repository = require(Path.join(__dirname, '/dao'));
          server.expose('Repository', repository);

          let repositories = require(Path.join(__dirname, '/repositories'))(server);
          server.expose('repositories', repositories);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  if (options.db.port) {
    dbConfig.port = options.db.port;
  }

  sequelize = new Sequelize(options.db.database,
    options.db.user, options.db.password, dbConfig);

  // test the database connection
  if (process.env.NODE_ENV !== 'test') {
    sequelize.authenticate()
      .then(exposeData)
      .catch(err => next(err))
      .finally(() => next());
  } else {
    exposeData()
      .catch(err => next(err))
      .finally(() => next());
  }

};

exports.register.attributes = {
  name: 'dal',
  /* version */
  version: '1.0.0-3.1.5'
  /* versionStop */
};
