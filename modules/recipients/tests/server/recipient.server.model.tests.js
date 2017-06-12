'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Recipient = mongoose.model('Recipient');

/**
 * Globals
 */
var user, recipient;

/**
 * Unit tests
 */
describe('Recipient Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      recipient = new Recipient({
        title: 'Recipient Title',
        content: 'Recipient Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return recipient.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      recipient.title = '';

      return recipient.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Recipient.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
