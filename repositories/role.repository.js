'use strict';

const Path = require('path');
const Promise = require('bluebird');
const Repository = require(Path.join(__dirname, '../dao'));

function RoleRepository(dao) {
    Repository.call(this, dao);
    this.__includeHash.users = {
        association: dao.userIncludes,
        through: { attributes: [] }
    };
    
}

RoleRepository.prototype = Object.create(Repository.prototype);

module.exports = RoleRepository;