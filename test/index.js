'use strict';

// Load modules

const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

// Declare internals

const internals = {
  config: require('../config')
};

// Test shortcuts

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.test;
const beforeEach = lab.beforeEach;

let server;

beforeEach((done) => {

  server = new Hapi.Server();
  server.connection();

  done();
});

describe('Plugin registration', () => {

  it('should fail if no options are specified', (done) => {

    server.register({
      register: require('../'),
      options: {}
    }, (err) => {

      if (err) {
        done();
      }
    });
  });

});

describe('Model creation', () => {

  beforeEach((done) => {
    server.register({
      register: require('../'),
      options: internals.config
    }, (err) => {
      if (err) {
        return console.error('Can not register plugins', err);
      }
    });
    done();
  });

  it('should expose dal', (done) => {
    expect(server.plugins).to.exist();
    expect(server.plugins).to.include('dal');

    done();
  });

  it('should expose Repository', (done) => {
    expect(server.plugins.dal).to.exist();
    expect(server.plugins.dal).to.include('Repository');

    done();
  });

  it('should expose db', (done) => {
    expect(server.plugins.dal).to.exist();
    expect(server.plugins.dal).to.include('db');

    done();
  });

  it('should expose Sequelize', (done) => {
    expect(server.plugins.dal).to.exist();
    expect(server.plugins.dal).to.include('Sequelize');

    done();
  });
  it('should expose models', (done) => {
    expect(server.plugins.dal).to.exist();
    expect(server.plugins.dal).to.include('models');

    done();
  });

});
