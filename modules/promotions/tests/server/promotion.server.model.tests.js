'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Promotion = mongoose.model('Promotion');

/**
 * Globals
 */
var user,
  promotion;

/**
 * Unit tests
 */
describe('Promotion Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      promotion = new Promotion({
        name: 'Promotion Name',
        code:'10346452555',
        description:'sssssssssssssssssssssssssss',
        discountType:'ice',
        discountValue: 25,
        startdate:'10-02-2537',
        enddate:'11-02-2537',
        status:'sucess',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return promotion.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      promotion.name = '';

      return promotion.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Promotion.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
