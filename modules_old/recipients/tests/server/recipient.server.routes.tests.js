'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Recipient = mongoose.model('Recipient'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, recipient;

/**
 * Recipient routes tests
 */
describe('Recipient CRUD tests', function () {
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

    // Save a user to the test db and create new recipient
    user.save(function () {
      recipient = {
        title: 'Recipient Title',
        content: 'Recipient Content'
      };

      done();
    });
  });

  it('should be able to save an recipient if logged in', function (done) {
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

        // Save a new recipient
        agent.post('/api/recipients')
          .send(recipient)
          .expect(200)
          .end(function (recipientSaveErr, recipientSaveRes) {
            // Handle recipient save error
            if (recipientSaveErr) {
              return done(recipientSaveErr);
            }

            // Get a list of recipients
            agent.get('/api/recipients')
              .end(function (recipientsGetErr, recipientsGetRes) {
                // Handle recipient save error
                if (recipientsGetErr) {
                  return done(recipientsGetErr);
                }

                // Get recipients list
                var recipients = recipientsGetRes.body;

                // Set assertions
                (recipients[0].user._id).should.equal(userId);
                (recipients[0].title).should.match('Recipient Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an recipient if not logged in', function (done) {
    agent.post('/api/recipients')
      .send(recipient)
      .expect(403)
      .end(function (recipientSaveErr, recipientSaveRes) {
        // Call the assertion callback
        done(recipientSaveErr);
      });
  });

  it('should not be able to save an recipient if no title is provided', function (done) {
    // Invalidate title field
    recipient.title = '';

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

        // Save a new recipient
        agent.post('/api/recipients')
          .send(recipient)
          .expect(400)
          .end(function (recipientSaveErr, recipientSaveRes) {
            // Set message assertion
            (recipientSaveRes.body.message).should.match('Title cannot be blank');

            // Handle recipient save error
            done(recipientSaveErr);
          });
      });
  });

  it('should be able to update an recipient if signed in', function (done) {
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

        // Save a new recipient
        agent.post('/api/recipients')
          .send(recipient)
          .expect(200)
          .end(function (recipientSaveErr, recipientSaveRes) {
            // Handle recipient save error
            if (recipientSaveErr) {
              return done(recipientSaveErr);
            }

            // Update recipient title
            recipient.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing recipient
            agent.put('/api/recipients/' + recipientSaveRes.body._id)
              .send(recipient)
              .expect(200)
              .end(function (recipientUpdateErr, recipientUpdateRes) {
                // Handle recipient update error
                if (recipientUpdateErr) {
                  return done(recipientUpdateErr);
                }

                // Set assertions
                (recipientUpdateRes.body._id).should.equal(recipientSaveRes.body._id);
                (recipientUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of recipients if not signed in', function (done) {
    // Create new recipient model instance
    var recipientObj = new Recipient(recipient);

    // Save the recipient
    recipientObj.save(function () {
      // Request recipients
      request(app).get('/api/recipients')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single recipient if not signed in', function (done) {
    // Create new recipient model instance
    var recipientObj = new Recipient(recipient);

    // Save the recipient
    recipientObj.save(function () {
      request(app).get('/api/recipients/' + recipientObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', recipient.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single recipient with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/recipients/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Recipient is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single recipient which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent recipient
    request(app).get('/api/recipients/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No recipient with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an recipient if signed in', function (done) {
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

        // Save a new recipient
        agent.post('/api/recipients')
          .send(recipient)
          .expect(200)
          .end(function (recipientSaveErr, recipientSaveRes) {
            // Handle recipient save error
            if (recipientSaveErr) {
              return done(recipientSaveErr);
            }

            // Delete an existing recipient
            agent.delete('/api/recipients/' + recipientSaveRes.body._id)
              .send(recipient)
              .expect(200)
              .end(function (recipientDeleteErr, recipientDeleteRes) {
                // Handle recipient error error
                if (recipientDeleteErr) {
                  return done(recipientDeleteErr);
                }

                // Set assertions
                (recipientDeleteRes.body._id).should.equal(recipientSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an recipient if not signed in', function (done) {
    // Set recipient user
    recipient.user = user;

    // Create new recipient model instance
    var recipientObj = new Recipient(recipient);

    // Save the recipient
    recipientObj.save(function () {
      // Try deleting recipient
      request(app).delete('/api/recipients/' + recipientObj._id)
        .expect(403)
        .end(function (recipientDeleteErr, recipientDeleteRes) {
          // Set message assertion
          (recipientDeleteRes.body.message).should.match('User is not authorized');

          // Handle recipient error error
          done(recipientDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Recipient.remove().exec(done);
    });
  });
});
