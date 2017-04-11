'use strict';
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

let sqlPath = path.join(__dirname, 'tableCreation.sql');
let logSql = (logText) => {
  // Remove colon and space
  logText = logText.substr(logText.indexOf(':') + 2);
  fs.appendFile(sqlPath, logText + '\n',
    function(err) {
      if (err) {
        return console.log(err);
      }
      console.log(logText);
    });
};

module.exports = (sequelize, options) => {
  // Change output path for generated sql if present
  if (options.db.sqlOutputPath) {
    sqlPath = options.db.sqlOutputPath;
  }
  let exclusions = ['index.js', 'tableCreation.sql'];
  let db = {};
  fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (exclusions.indexOf(file) < 0);
  })
  .forEach((file) => {
    try {

      let model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    }
    catch (ex) {
      console.log(ex);
    }

  });

  // Build the associations in the ORM, then sync.
  // This way the ORM has knowledge of entire database and will not
  // get foreign key errors while building the tables.
  let associations = [];
  let scopes = [];
  Object.keys(db).forEach((modelName) => {
    associations.push(new Promise((resolve) => {
      if ('associate' in db[modelName]) {
        db[modelName].associate(db);
      }
      resolve(modelName);
    }));
    scopes.push(new Promise((resolve) => {
      if ('scopes' in db[modelName]) {
        db[modelName].scopes(db);
      }
      resolve(modelName);
    }));
  });
  return Promise.all(associations)
  .then(() => {
    return Promise.all(scopes);
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      if (options.db.sync) {
        fs.lstatAsync(sqlPath)
        .then(() => {
          if (!options.db.forceSync) {
            return fs.unlinkAsync(sqlPath);
          } else {
            return Promise.resolve();
          }
        })
        .catch((err) => {
          console.error('Could not find or delete', sqlPath, err.message);
        })
        .then(() => {
          // Do not log to file if force=true to prevent populating with
          // 'drop table'
          return sequelize.sync({
            force: options.db.forceSync,
            logging: options.db.forceSync ? console.log : logSql
          });
        })
        .then(() => {
          resolve(db);
        })
        .catch((err) => {
          reject(err);
        });
      } else {
        // Return unsynced models
        resolve(db);
      }
    });
  })
  .catch((err) => {
    console.error(err);
    return Promise.reject(err);
  });
};
