'use strict';

const Path = require('path');
const Promise = require('bluebird');
const Repository = require(Path.join(__dirname, '../dao'));

function ProfileRepository(dao) {
    Repository.call(this, dao);
    this.__includeHash.user = {
        association: dao.userInclude,
        attributes: {
            exclude: ['pass', 'salt']
        }
    };
    this.__includeHash.location = {
        association: dao.locationInclude,
        as: 'location'
    };
    
}

ProfileRepository.prototype = Object.create(Repository.prototype);

ProfileRepository.prototype.setLocation = function (profile, location) {

    return this.associationMethod(profile, location, 'setLocation');

};

ProfileRepository.prototype.setWebUser = function (profile, webUser) {

    return this.associationMethod(profile, webUser, 'setWebUser');

};

module.exports = ProfileRepository;
