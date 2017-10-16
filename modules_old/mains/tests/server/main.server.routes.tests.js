'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Main = mongoose.model('Main'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, main;

/**
 * Main routes tests
 */
describe('Main CRUD tests', function () {
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

    // Save a user to the test db and create new main
    user.save(function () {
      main = {
        title: 'Main Title',
        content: 'Main Content'
      };

      done();
    });
  });

  it('should be able to save an main if logged in', function (done) {
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

        // Save a new main
        agent.post('/api/mains')
          .send(main)
          .expect(200)
          .end(function (mainSaveErr, mainSaveRes) {
            // Handle main save error
            if (mainSaveErr) {
              return done(mainSaveErr);
            }

            // Get a list of mains
            agent.get('/api/mains')
              .end(function (mainsGetErr, mainsGetRes) {
                // Handle main save error
                if (mainsGetErr) {
                  return done(mainsGetErr);
                }

                // Get mains list
                var mains = mainsGetRes.body;

                // Set assertions
                (mains[0].user._id).should.equal(userId);
                (mains[0].title).should.match('Main Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an main if not logged in', function (done) {
    agent.post('/api/mains')
      .send(main)
      .expect(403)
      .end(function (mainSaveErr, mainSaveRes) {
        // Call the assertion callback
        done(mainSaveErr);
      });
  });

  it('should not be able to save an main if no title is provided', function (done) {
    // Invalidate title field
    main.title = '';

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

        // Save a new main
        agent.post('/api/mains')
          .send(main)
          .expect(400)
          .end(function (mainSaveErr, mainSaveRes) {
            // Set message assertion
            (mainSaveRes.body.message).should.match('Title cannot be blank');

            // Handle main save error
            done(mainSaveErr);
          });
      });
  });

  it('should be able to update an main if signed in', function (done) {
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

        // Save a new main
        agent.post('/api/mains')
          .send(main)
          .expect(200)
          .end(function (mainSaveErr, mainSaveRes) {
            // Handle main save error
            if (mainSaveErr) {
              return done(mainSaveErr);
            }

            // Update main title
            main.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing main
            agent.put('/api/mains/' + mainSaveRes.body._id)
              .send(main)
              .expect(200)
              .end(function (mainUpdateErr, mainUpdateRes) {
                // Handle main update error
                if (mainUpdateErr) {
                  return done(mainUpdateErr);
                }

                // Set assertions
                (mainUpdateRes.body._id).should.equal(mainSaveRes.body._id);
                (mainUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of mains if not signed in', function (done) {
    // Create new main model instance
    var mainObj = new Main(main);

    // Save the main
    mainObj.save(function () {
      // Request mains
      request(app).get('/api/mains')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single main if not signed in', function (done) {
    // Create new main model instance
    var mainObj = new Main(main);

    // Save the main
    mainObj.save(function () {
      request(app).get('/api/mains/' + mainObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', main.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single main with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/mains/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Main is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single main which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent main
    request(app).get('/api/mains/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No main with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an main if signed in', function (done) {
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

        // Save a new main
        agent.post('/api/mains')
          .send(main)
          .expect(200)
          .end(function (mainSaveErr, mainSaveRes) {
            // Handle main save error
            if (mainSaveErr) {
              return done(mainSaveErr);
            }

            // Delete an existing main
            agent.delete('/api/mains/' + mainSaveRes.body._id)
              .send(main)
              .expect(200)
              .end(function (mainDeleteErr, mainDeleteRes) {
                // Handle main error error
                if (mainDeleteErr) {
                  return done(mainDeleteErr);
                }

                // Set assertions
                (mainDeleteRes.body._id).should.equal(mainSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an main if not signed in', function (done) {
    // Set main user
    main.user = user;

    // Create new main model instance
    var mainObj = new Main(main);

    // Save the main
    mainObj.save(function () {
      // Try deleting main
      request(app).delete('/api/mains/' + mainObj._id)
        .expect(403)
        .end(function (mainDeleteErr, mainDeleteRes) {
          // Set message assertion
          (mainDeleteRes.body.message).should.match('User is not authorized');

          // Handle main error error
          done(mainDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Main.remove().exec(done);
    });
  });
});
