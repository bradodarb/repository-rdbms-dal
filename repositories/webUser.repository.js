'use strict';

const Path = require('path');
const Promise = require('bluebird');
const Repository = require(Path.join(__dirname, '../dao'));

function WebUserRepository(dao) {
  Repository.call(this, dao);
  this.__includeHash.roles = {
      association: dao.roleIncludes,
      through: {attributes: []}
    };
  this.__includeHash.profile = {
      association: dao.profileInclude
    };
}

WebUserRepository.prototype = Object.create(Repository.prototype);

WebUserRepository.prototype.addRole = function (user, role) {

    return this.associationMethod(user, role, 'addRole');

  };

WebUserRepository.prototype.addRoles = function (user, roles) {

    return this.associationMethod(user, roles, 'addRoles');

  };

WebUserRepository.prototype.removeExpression = function (user, role) {

    return this.associationMethod(user, role, 'removeRole');

  };
WebUserRepository.prototype.removeExpressions = function (user, roles) {

    return this.associationMethod(user, roles, 'removeRoles');

  };


module.exports = WebUserRepository;
