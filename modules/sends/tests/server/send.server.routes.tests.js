'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Send = mongoose.model('Send'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, send;

/**
 * Send routes tests
 */
describe('Send CRUD tests', function () {
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
      password: 'password'
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

    // Save a user to the test db and create new send
    user.save(function () {
      send = {
        title: 'Send Title',
        content: 'Send Content'
      };

      done();
    });
  });

  it('should be able to save an send if logged in', function (done) {
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

        // Save a new send
        agent.post('/api/sends')
          .send(send)
          .expect(200)
          .end(function (sendSaveErr, sendSaveRes) {
            // Handle send save error
            if (sendSaveErr) {
              return done(sendSaveErr);
            }

            // Get a list of sends
            agent.get('/api/sends')
              .end(function (sendsGetErr, sendsGetRes) {
                // Handle send save error
                if (sendsGetErr) {
                  return done(sendsGetErr);
                }

                // Get sends list
                var sends = sendsGetRes.body;

                // Set assertions
                (sends[0].user._id).should.equal(userId);
                (sends[0].title).should.match('Send Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an send if not logged in', function (done) {
    agent.post('/api/sends')
      .send(send)
      .expect(403)
      .end(function (sendSaveErr, sendSaveRes) {
        // Call the assertion callback
        done(sendSaveErr);
      });
  });

  it('should not be able to save an send if no title is provided', function (done) {
    // Invalidate title field
    send.title = '';

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

        // Save a new send
        agent.post('/api/sends')
          .send(send)
          .expect(400)
          .end(function (sendSaveErr, sendSaveRes) {
            // Set message assertion
            (sendSaveRes.body.message).should.match('Title cannot be blank');

            // Handle send save error
            done(sendSaveErr);
          });
      });
  });

  it('should be able to update an send if signed in', function (done) {
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

        // Save a new send
        agent.post('/api/sends')
          .send(send)
          .expect(200)
          .end(function (sendSaveErr, sendSaveRes) {
            // Handle send save error
            if (sendSaveErr) {
              return done(sendSaveErr);
            }

            // Update send title
            send.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing send
            agent.put('/api/sends/' + sendSaveRes.body._id)
              .send(send)
              .expect(200)
              .end(function (sendUpdateErr, sendUpdateRes) {
                // Handle send update error
                if (sendUpdateErr) {
                  return done(sendUpdateErr);
                }

                // Set assertions
                (sendUpdateRes.body._id).should.equal(sendSaveRes.body._id);
                (sendUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of sends if not signed in', function (done) {
    // Create new send model instance
    var sendObj = new Send(send);

    // Save the send
    sendObj.save(function () {
      // Request sends
      request(app).get('/api/sends')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single send if not signed in', function (done) {
    // Create new send model instance
    var sendObj = new Send(send);

    // Save the send
    sendObj.save(function () {
      request(app).get('/api/sends/' + sendObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', send.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single send with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sends/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Send is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single send which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent send
    request(app).get('/api/sends/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No send with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an send if signed in', function (done) {
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

        // Save a new send
        agent.post('/api/sends')
          .send(send)
          .expect(200)
          .end(function (sendSaveErr, sendSaveRes) {
            // Handle send save error
            if (sendSaveErr) {
              return done(sendSaveErr);
            }

            // Delete an existing send
            agent.delete('/api/sends/' + sendSaveRes.body._id)
              .send(send)
              .expect(200)
              .end(function (sendDeleteErr, sendDeleteRes) {
                // Handle send error error
                if (sendDeleteErr) {
                  return done(sendDeleteErr);
                }

                // Set assertions
                (sendDeleteRes.body._id).should.equal(sendSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an send if not signed in', function (done) {
    // Set send user
    send.user = user;

    // Create new send model instance
    var sendObj = new Send(send);

    // Save the send
    sendObj.save(function () {
      // Try deleting send
      request(app).delete('/api/sends/' + sendObj._id)
        .expect(403)
        .end(function (sendDeleteErr, sendDeleteRes) {
          // Set message assertion
          (sendDeleteRes.body.message).should.match('User is not authorized');

          // Handle send error error
          done(sendDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Send.remove().exec(done);
    });
  });
});
