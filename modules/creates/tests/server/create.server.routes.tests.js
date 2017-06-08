'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Create = mongoose.model('Create'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  create;

/**
 * Create routes tests
 */
describe('Create CRUD tests', function () {

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

    // Save a user to the test db and create new Create
    user.save(function () {
      create = {
        name: 'Create name'
      };

      done();
    });
  });

  it('should be able to save a Create if logged in', function (done) {
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

        // Save a new Create
        agent.post('/api/creates')
          .send(create)
          .expect(200)
          .end(function (createSaveErr, createSaveRes) {
            // Handle Create save error
            if (createSaveErr) {
              return done(createSaveErr);
            }

            // Get a list of Creates
            agent.get('/api/creates')
              .end(function (createsGetErr, createsGetRes) {
                // Handle Creates save error
                if (createsGetErr) {
                  return done(createsGetErr);
                }

                // Get Creates list
                var creates = createsGetRes.body;

                // Set assertions
                (creates[0].user._id).should.equal(userId);
                (creates[0].name).should.match('Create name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Create if not logged in', function (done) {
    agent.post('/api/creates')
      .send(create)
      .expect(403)
      .end(function (createSaveErr, createSaveRes) {
        // Call the assertion callback
        done(createSaveErr);
      });
  });

  it('should not be able to save an Create if no name is provided', function (done) {
    // Invalidate name field
    create.name = '';

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

        // Save a new Create
        agent.post('/api/creates')
          .send(create)
          .expect(400)
          .end(function (createSaveErr, createSaveRes) {
            // Set message assertion
            (createSaveRes.body.message).should.match('Please fill Create name');

            // Handle Create save error
            done(createSaveErr);
          });
      });
  });

  it('should be able to update an Create if signed in', function (done) {
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

        // Save a new Create
        agent.post('/api/creates')
          .send(create)
          .expect(200)
          .end(function (createSaveErr, createSaveRes) {
            // Handle Create save error
            if (createSaveErr) {
              return done(createSaveErr);
            }

            // Update Create name
            create.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Create
            agent.put('/api/creates/' + createSaveRes.body._id)
              .send(create)
              .expect(200)
              .end(function (createUpdateErr, createUpdateRes) {
                // Handle Create update error
                if (createUpdateErr) {
                  return done(createUpdateErr);
                }

                // Set assertions
                (createUpdateRes.body._id).should.equal(createSaveRes.body._id);
                (createUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Creates if not signed in', function (done) {
    // Create new Create model instance
    var createObj = new Create(create);

    // Save the create
    createObj.save(function () {
      // Request Creates
      request(app).get('/api/creates')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Create if not signed in', function (done) {
    // Create new Create model instance
    var createObj = new Create(create);

    // Save the Create
    createObj.save(function () {
      request(app).get('/api/creates/' + createObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', create.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Create with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/creates/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Create is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Create which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Create
    request(app).get('/api/creates/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Create with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Create if signed in', function (done) {
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

        // Save a new Create
        agent.post('/api/creates')
          .send(create)
          .expect(200)
          .end(function (createSaveErr, createSaveRes) {
            // Handle Create save error
            if (createSaveErr) {
              return done(createSaveErr);
            }

            // Delete an existing Create
            agent.delete('/api/creates/' + createSaveRes.body._id)
              .send(create)
              .expect(200)
              .end(function (createDeleteErr, createDeleteRes) {
                // Handle create error error
                if (createDeleteErr) {
                  return done(createDeleteErr);
                }

                // Set assertions
                (createDeleteRes.body._id).should.equal(createSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Create if not signed in', function (done) {
    // Set Create user
    create.user = user;

    // Create new Create model instance
    var createObj = new Create(create);

    // Save the Create
    createObj.save(function () {
      // Try deleting Create
      request(app).delete('/api/creates/' + createObj._id)
        .expect(403)
        .end(function (createDeleteErr, createDeleteRes) {
          // Set message assertion
          (createDeleteRes.body.message).should.match('User is not authorized');

          // Handle Create error error
          done(createDeleteErr);
        });

    });
  });

  it('should be able to get a single Create that has an orphaned user reference', function (done) {
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

          // Save a new Create
          agent.post('/api/creates')
            .send(create)
            .expect(200)
            .end(function (createSaveErr, createSaveRes) {
              // Handle Create save error
              if (createSaveErr) {
                return done(createSaveErr);
              }

              // Set assertions on new Create
              (createSaveRes.body.name).should.equal(create.name);
              should.exist(createSaveRes.body.user);
              should.equal(createSaveRes.body.user._id, orphanId);

              // force the Create to have an orphaned user reference
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

                    // Get the Create
                    agent.get('/api/creates/' + createSaveRes.body._id)
                      .expect(200)
                      .end(function (createInfoErr, createInfoRes) {
                        // Handle Create error
                        if (createInfoErr) {
                          return done(createInfoErr);
                        }

                        // Set assertions
                        (createInfoRes.body._id).should.equal(createSaveRes.body._id);
                        (createInfoRes.body.name).should.equal(create.name);
                        should.equal(createInfoRes.body.user, undefined);

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
      Create.remove().exec(done);
    });
  });
});
