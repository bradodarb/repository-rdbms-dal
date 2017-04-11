'use strict';
const Path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const Repository = require(Path.join(__dirname, '../dao'));

let exclusions = ['index.js'];
let repos = {};

module.exports = ()=>{
 
 fs.readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (exclusions.indexOf(file) < 0);
    })
    .forEach((file) => {
        try {

            let repo = require(Path.join(__dirname, file))(server);
            let repoName = file.split('.')[0];
            repos[repoName] = Repository.repoManager[repoName + 'Repository'] = repo;
        }
        catch (ex) {
            console.log(ex);
        }

    });
    return repos;
};