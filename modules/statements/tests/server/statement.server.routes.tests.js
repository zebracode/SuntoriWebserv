'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Statement = mongoose.model('Statement'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  statement;

/**
 * Statement routes tests
 */
describe('Statement CRUD tests', function () {

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

    // Save a user to the test db and create new Statement
    user.save(function () {
      statement = {
        name: 'Statement name'
      };

      done();
    });
  });

  it('should be able to save a Statement if logged in', function (done) {
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

        // Save a new Statement
        agent.post('/api/statements')
          .send(statement)
          .expect(200)
          .end(function (statementSaveErr, statementSaveRes) {
            // Handle Statement save error
            if (statementSaveErr) {
              return done(statementSaveErr);
            }

            // Get a list of Statements
            agent.get('/api/statements')
              .end(function (statementsGetErr, statementsGetRes) {
                // Handle Statements save error
                if (statementsGetErr) {
                  return done(statementsGetErr);
                }

                // Get Statements list
                var statements = statementsGetRes.body;

                // Set assertions
                (statements[0].user._id).should.equal(userId);
                (statements[0].name).should.match('Statement name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Statement if not logged in', function (done) {
    agent.post('/api/statements')
      .send(statement)
      .expect(403)
      .end(function (statementSaveErr, statementSaveRes) {
        // Call the assertion callback
        done(statementSaveErr);
      });
  });

  it('should not be able to save an Statement if no name is provided', function (done) {
    // Invalidate name field
    statement.name = '';

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

        // Save a new Statement
        agent.post('/api/statements')
          .send(statement)
          .expect(400)
          .end(function (statementSaveErr, statementSaveRes) {
            // Set message assertion
            (statementSaveRes.body.message).should.match('Please fill Statement name');

            // Handle Statement save error
            done(statementSaveErr);
          });
      });
  });

  it('should be able to update an Statement if signed in', function (done) {
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

        // Save a new Statement
        agent.post('/api/statements')
          .send(statement)
          .expect(200)
          .end(function (statementSaveErr, statementSaveRes) {
            // Handle Statement save error
            if (statementSaveErr) {
              return done(statementSaveErr);
            }

            // Update Statement name
            statement.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Statement
            agent.put('/api/statements/' + statementSaveRes.body._id)
              .send(statement)
              .expect(200)
              .end(function (statementUpdateErr, statementUpdateRes) {
                // Handle Statement update error
                if (statementUpdateErr) {
                  return done(statementUpdateErr);
                }

                // Set assertions
                (statementUpdateRes.body._id).should.equal(statementSaveRes.body._id);
                (statementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Statements if not signed in', function (done) {
    // Create new Statement model instance
    var statementObj = new Statement(statement);

    // Save the statement
    statementObj.save(function () {
      // Request Statements
      request(app).get('/api/statements')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Statement if not signed in', function (done) {
    // Create new Statement model instance
    var statementObj = new Statement(statement);

    // Save the Statement
    statementObj.save(function () {
      request(app).get('/api/statements/' + statementObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', statement.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Statement with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/statements/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Statement is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Statement which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Statement
    request(app).get('/api/statements/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Statement with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Statement if signed in', function (done) {
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

        // Save a new Statement
        agent.post('/api/statements')
          .send(statement)
          .expect(200)
          .end(function (statementSaveErr, statementSaveRes) {
            // Handle Statement save error
            if (statementSaveErr) {
              return done(statementSaveErr);
            }

            // Delete an existing Statement
            agent.delete('/api/statements/' + statementSaveRes.body._id)
              .send(statement)
              .expect(200)
              .end(function (statementDeleteErr, statementDeleteRes) {
                // Handle statement error error
                if (statementDeleteErr) {
                  return done(statementDeleteErr);
                }

                // Set assertions
                (statementDeleteRes.body._id).should.equal(statementSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Statement if not signed in', function (done) {
    // Set Statement user
    statement.user = user;

    // Create new Statement model instance
    var statementObj = new Statement(statement);

    // Save the Statement
    statementObj.save(function () {
      // Try deleting Statement
      request(app).delete('/api/statements/' + statementObj._id)
        .expect(403)
        .end(function (statementDeleteErr, statementDeleteRes) {
          // Set message assertion
          (statementDeleteRes.body.message).should.match('User is not authorized');

          // Handle Statement error error
          done(statementDeleteErr);
        });

    });
  });

  it('should be able to get a single Statement that has an orphaned user reference', function (done) {
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

          // Save a new Statement
          agent.post('/api/statements')
            .send(statement)
            .expect(200)
            .end(function (statementSaveErr, statementSaveRes) {
              // Handle Statement save error
              if (statementSaveErr) {
                return done(statementSaveErr);
              }

              // Set assertions on new Statement
              (statementSaveRes.body.name).should.equal(statement.name);
              should.exist(statementSaveRes.body.user);
              should.equal(statementSaveRes.body.user._id, orphanId);

              // force the Statement to have an orphaned user reference
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

                    // Get the Statement
                    agent.get('/api/statements/' + statementSaveRes.body._id)
                      .expect(200)
                      .end(function (statementInfoErr, statementInfoRes) {
                        // Handle Statement error
                        if (statementInfoErr) {
                          return done(statementInfoErr);
                        }

                        // Set assertions
                        (statementInfoRes.body._id).should.equal(statementSaveRes.body._id);
                        (statementInfoRes.body.name).should.equal(statement.name);
                        should.equal(statementInfoRes.body.user, undefined);

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
      Statement.remove().exec(done);
    });
  });
});
