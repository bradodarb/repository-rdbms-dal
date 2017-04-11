'use strict';

const Path = require('path');
const Promise = require('bluebird');
const Repository = require(Path.join(__dirname, '../dao'));

function StateRepository(dao) {
    Repository.call(this, dao);
    this.__includeHash.locations = {
        association: dao.locationIncludes
    };
    
}

StateRepository.prototype = Object.create(Repository.prototype);

module.exports = StateRepository;
