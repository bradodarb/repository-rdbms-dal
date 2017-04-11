'use strict';

const Path = require('path');
const Repository = require(Path.join(__dirname, '../dao'));
const _ = require('lodash');

function LocationRepository(dao) {
    Repository.call(this, dao);
   this.__includeHash.state = {
     association: dao.stateInclude,
     attributes: ['abbrev', 'name']
     };
    this.__includeHash.users = {
        association: dao.profileIncludes
    };
    this.__includeHash.events = {
        association: dao.eventInclude
    };
    
}

LocationRepository.prototype = Object.create(Repository.prototype);

LocationRepository.prototype.setState = function (location, state) {

    return this.associationMethod(location, state, 'setState');

};

module.exports = LocationRepository;
