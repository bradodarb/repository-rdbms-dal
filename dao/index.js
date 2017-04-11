'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
/*

 Assumes all entities have following fields:
 created (dateTime)
 modified (dateTime)
 modifiedBy (int)

 */
function Repository(dao) {
  this.__dao = dao;
  this.__includeHash = {};
  this.__isRaw = true;
  this.repoManager = Repository.repoManager;
}

Repository.prototype = {
  raw: function () {
    this.__isRaw = true;
    return this;
  },
  cooked: function () {
    this.__isRaw = false;
    return this;
  },
  create: function (defaults, user) {

    var op = new Promise((resolve, reject) => {
      defaults = defaults || {};

      defaults.modified = new Date();
      defaults.created = new Date();
      defaults.modifiedBy = user;

      this.__dao.create(defaults, {raw: true})
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error('Error creating object', err);
          reject({error: err, message: 'Error creating object'});
        });
    }).finally(() => {
        this.__isRaw = true;
    });
    if (this.__isRaw) {
      return Repository.result(op);
    } else {
      return op;
    }
  },
  save: function (entity, user) {

    var op = new Promise((resolve, reject) => {
      entity.modified = new Date();
      entity.modifiedBy = user;

      this.__dao.update(
        entity,
        {
          where: {id: entity.id}
        })
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.error('Error updating object', err);
          reject({error: err, message: 'Error updating object'});
        });
    }).finally(() => {
        this.__isRaw = true;
      });
    return op;
  },
  getPage: function (limit, offset, params) {

    var op = new Promise((resolve, reject) => {
      let criteria = {};
      criteria.limit = limit || 20;
      criteria.offset = offset || 0;
      if (params) {
        // Need to set false otherwise tries to use same ordering on included
        // models, despite no corresponding columns
        criteria.subQuery = false;
        if (params.include) {
          criteria.include = params.include;
        }
        var order = Repository.getOrderBy(params);
        if (order.length) {
          criteria.order = [order];
        }
      }

      this.__dao.findAndCountAll(criteria)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error('Error getting page:  offset = ' + offset +
            ' & limit = ' + limit, err, err.stack);
          reject({
            error: err, message: 'Error getting page:  offset = ' + offset +
            ' & limit = ' + limit
          });
        });
    }).finally(() => {
        this.__isRaw = true;
      });
    if (this.__isRaw) {
      return Repository.result(op);
    } else {
      return op;
    }
  },
  count: function (criteria) {

    var op = new Promise((resolve, reject) => {

      criteria = criteria || {};
      this.__dao.count(criteria)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error('Error getting count', err, err.stack);
          reject({
            error: err, message: 'Error getting count'
          });
        });
    }).finally(() => {
        this.__isRaw = true;
      });
    return op;
  },
  getById: function (id, attributes, includes) {

    var op = new Promise((resolve, reject) => {
      let q = {};

      if (attributes) {
        q.attributes = attributes;
      }
      if (includes) {
        q.include = [];
        includes.forEach(include => {
          if (this.__includeHash[include]) {
            q.include.push(this.__includeHash[include]);
          }
        });
      }
      this.__dao.findById(id, q)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error('Error getting object', err, err.stack);
          reject({error: err, message: 'Error getting object'});
        });
    }).finally(() => {
        this.__isRaw = true;
      });

    if (this.__isRaw) {
      return Repository.result(op);
    } else {
      return op;
    }
  },
  getOne: function (query, attributes, includes) {

    var op = new Promise((resolve, reject) => {

      let q = {
        where: query
      };

      if (attributes) {
        q.attributes = attributes;
      }
      if (includes) {
        q.include = [];
        includes.forEach(include => {
          if (this.__includeHash[include]) {
            q.include.push(this.__includeHash[include]);
          }
          if (_.has(include, 'model')) {
            q.include.push(include);
          }
        });
      }
      this.__dao.findOne(q)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error('Error finding one by query');
          reject({error: err, message: 'Error finding one by query'});
        });
    }).finally(() => {
        this.__isRaw = true;
      });
    if (this.__isRaw) {
      return Repository.result(op);
    } else {
      return op;
    }
  },
  getMany: function (query, attributes, includes, params) {

    var op = new Promise((resolve, reject) => {

      let q = {
        where: query
      };

      if (attributes) {
        q.attributes = attributes;
      }
      if (includes) {
        q.include = [];
        includes.forEach(include => {
          if (this.__includeHash[include]) {
            q.include.push(this.__includeHash[include]);
          }
          if (_.has(include, 'model')) {
            q.include.push(include);
          }
        });
      }
      if (params) {
        if (params.limit) {
          q.limit = params.limit;
        }
        if (params.offset) {
          q.offset = params.offset;
        }
        var order = Repository.getOrderBy(params);
        if (order.length) {
          q.order = [order];
        }
      }

      this.__dao.findAll(q)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error('Error finding by query');
          reject({error: err, message: 'Error finding many by query'});
        });
    }).finally(() => {
        this.__isRaw = true;
      });
    if (this.__isRaw) {
      return Repository.result(op);
    } else {
      return op;
    }
  },
  getOrCreate: function (query, defaults, user) {

    defaults = defaults || {};
    defaults.modifiedBy = user;

    var op = new Promise((resolve, reject) => {

      let q = {
        where: query
      };

      q.defaults = defaults;

      this.__dao.findOrCreate(q)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error('Error finding or creating by query');
          reject({error: err, message: 'Error finding or creating by query'});
        });
    }).finally(() => {
        this.__isRaw = true;
      });
    if (this.__isRaw) {
      return Repository.result(op);
    } else {
      return op;
    }
  },
  deleteById: function (id) {

    var op = new Promise((resolve, reject) => {

      this.__dao.destroy({
        where: {
          id: id
        }
      })
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.error('Error deleting object');
          reject({error: err, message: 'Error deleting object'});
        });
    }).finally(() => {
        this.__isRaw = true;
      });
    return op;
  },
  delete: function (query) {

    var op = new Promise((resolve, reject) => {

      this.__dao.destroy({
        where: query
      })
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.error('Error deleting object');
          reject({error: err, message: 'Error deleting object'});
        });
    }).finally(() => {
        this.__isRaw = true;
      });
    return op;
  },
  getInstance: function (param, accessor) {

    var op = new Promise((resolve, reject) => {
      if (accessor && param[accessor]) {//Seeing if object already has accessor method, if it does just return it
        resolve(param);
      } else if (Repository.isId(param)) {
        this.getById(param).then((m) => {
          resolve(m);
        });
      } else {// must be made of wood, and therefore a witch
        this.getOne(param).then((m) => {
          resolve(m);
        });
      }

    }).finally(() => {
        this.__isRaw = true;
      });
    return op;
  },
  associationMethod: function (model, dependency, accessor, options) {
    var op = new Promise((resolve, reject) => {
      this.cooked().getInstance(model, accessor).then((instance) => {
        instance[accessor](dependency, options || {})
          .then(result => resolve(result))
          .catch(err => {
            let message = 'Error managing association [' + accessor + ']';
            console.error(message, err);
            reject({error: err, message: message});
          });
      });
    }).finally(() => {
        this.__isRaw = true;
      });
    return op;
  }

};

//Util
Repository.isId = (model) => {
  return !isNaN(parseFloat(model)) && isFinite(model);
};

Repository.result = (promise) => {

  return new Promise((resolve, reject) => {
    promise.then((value) => {
      if (value && value.get && typeof value['get'] == 'function') {
        resolve(value.get({plain: true}));
      } else {
        resolve(value);
      }
    }).
      catch((err) => {
        reject(err);
      });
  });
};

/**
 * Ordering parameters, which should be in an array for proper escaping by ORM
 *
 * @param {Object} reqOrder Property and direction to order by
 * @returns {Array} Returned orderBy and order
 */
Repository.getOrderBy = (reqOrder) => {
  let orderBy = [];
  if (reqOrder.orderBy) {
    orderBy.push(reqOrder.orderBy);
    if (reqOrder.order) {
      orderBy.push(reqOrder.order);
    } else {
      orderBy.push('asc');
    }
  }
  return orderBy;
};

Repository.repoManager = {};

module.exports = Repository;
