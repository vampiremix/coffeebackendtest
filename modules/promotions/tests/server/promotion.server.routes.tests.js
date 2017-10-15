'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Promotion = mongoose.model('Promotion'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  promotion;

/**
 * Promotion routes tests
 */
describe('Promotion CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Promotion
    user.save(function () {
      promotion = {
        name: 'Promotion name',
        code:'10346452555',
        description:'sssssssssssssssssssssssssss',
        discountType:'ice',
        discountValue: 25,
        startdate:'10-02-2537',
        enddate:'11-02-2537',
        status:'sucess',
      };

      done();
    });
  });

  it('should be able to save a Promotion if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Promotion
        agent.post('/api/promotions')
          .send(promotion)
          .expect(200)
          .end(function (promotionSaveErr, promotionSaveRes) {
            // Handle Promotion save error
            if (promotionSaveErr) {
              return done(promotionSaveErr);
            }

            // Get a list of Promotions
            agent.get('/api/promotions')
              .end(function (promotionsGetErr, promotionsGetRes) {
                // Handle Promotions save error
                if (promotionsGetErr) {
                  return done(promotionsGetErr);
                }

                // Get Promotions list
                var promotions = promotionsGetRes.body;

                // Set assertions
                (promotions[0].user._id).should.equal(userId);
                (promotions[0].name).should.match('Promotion name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Promotion if not logged in', function (done) {
    agent.post('/api/promotions')
      .send(promotion)
      .expect(403)
      .end(function (promotionSaveErr, promotionSaveRes) {
        // Call the assertion callback
        done(promotionSaveErr);
      });
  });

  it('should not be able to save an Promotion if no name is provided', function (done) {
    // Invalidate name field
    promotion.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Promotion
        agent.post('/api/promotions')
          .send(promotion)
          .expect(400)
          .end(function (promotionSaveErr, promotionSaveRes) {
            // Set message assertion
            (promotionSaveRes.body.message).should.match('Please fill Promotion name');

            // Handle Promotion save error
            done(promotionSaveErr);
          });
      });
  });

  it('should be able to update an Promotion if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Promotion
        agent.post('/api/promotions')
          .send(promotion)
          .expect(200)
          .end(function (promotionSaveErr, promotionSaveRes) {
            // Handle Promotion save error
            if (promotionSaveErr) {
              return done(promotionSaveErr);
            }

            // Update Promotion name
            promotion.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Promotion
            agent.put('/api/promotions/' + promotionSaveRes.body._id)
              .send(promotion)
              .expect(200)
              .end(function (promotionUpdateErr, promotionUpdateRes) {
                // Handle Promotion update error
                if (promotionUpdateErr) {
                  return done(promotionUpdateErr);
                }

                // Set assertions
                (promotionUpdateRes.body._id).should.equal(promotionSaveRes.body._id);
                (promotionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Promotions if not signed in', function (done) {
    // Create new Promotion model instance
    var promotionObj = new Promotion(promotion);

    // Save the promotion
    promotionObj.save(function () {
      // Request Promotions
      request(app).get('/api/promotions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Promotion if not signed in', function (done) {
    // Create new Promotion model instance
    var promotionObj = new Promotion(promotion);

    // Save the Promotion
    promotionObj.save(function () {
      request(app).get('/api/promotions/' + promotionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', promotion.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Promotion with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/promotions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Promotion is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Promotion which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Promotion
    request(app).get('/api/promotions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Promotion with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Promotion if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Promotion
        agent.post('/api/promotions')
          .send(promotion)
          .expect(200)
          .end(function (promotionSaveErr, promotionSaveRes) {
            // Handle Promotion save error
            if (promotionSaveErr) {
              return done(promotionSaveErr);
            }

            // Delete an existing Promotion
            agent.delete('/api/promotions/' + promotionSaveRes.body._id)
              .send(promotion)
              .expect(200)
              .end(function (promotionDeleteErr, promotionDeleteRes) {
                // Handle promotion error error
                if (promotionDeleteErr) {
                  return done(promotionDeleteErr);
                }

                // Set assertions
                (promotionDeleteRes.body._id).should.equal(promotionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Promotion if not signed in', function (done) {
    // Set Promotion user
    promotion.user = user;

    // Create new Promotion model instance
    var promotionObj = new Promotion(promotion);

    // Save the Promotion
    promotionObj.save(function () {
      // Try deleting Promotion
      request(app).delete('/api/promotions/' + promotionObj._id)
        .expect(403)
        .end(function (promotionDeleteErr, promotionDeleteRes) {
          // Set message assertion
          (promotionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Promotion error error
          done(promotionDeleteErr);
        });

    });
  });

  it('should be able to get a single Promotion that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Promotion
          agent.post('/api/promotions')
            .send(promotion)
            .expect(200)
            .end(function (promotionSaveErr, promotionSaveRes) {
              // Handle Promotion save error
              if (promotionSaveErr) {
                return done(promotionSaveErr);
              }

              // Set assertions on new Promotion
              (promotionSaveRes.body.name).should.equal(promotion.name);
              should.exist(promotionSaveRes.body.user);
              should.equal(promotionSaveRes.body.user._id, orphanId);

              // force the Promotion to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Promotion
                    agent.get('/api/promotions/' + promotionSaveRes.body._id)
                      .expect(200)
                      .end(function (promotionInfoErr, promotionInfoRes) {
                        // Handle Promotion error
                        if (promotionInfoErr) {
                          return done(promotionInfoErr);
                        }

                        // Set assertions
                        (promotionInfoRes.body._id).should.equal(promotionSaveRes.body._id);
                        (promotionInfoRes.body.name).should.equal(promotion.name);
                        should.equal(promotionInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Promotion.remove().exec(done);
    });
  });
});
