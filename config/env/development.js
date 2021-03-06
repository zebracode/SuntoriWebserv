'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/SuntoriWebserv',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    // Stream defaults to process.stdout
    // Uncomment to enable logging to a log on the file system
    options: {
      //stream: 'access.log'
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - เรื่องเดลิเวอรี่ ซันโตริจัดให้'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '1879899495671563',
    clientSecret: process.env.FACEBOOK_SECRET || '1e4b53186ccf3cc57e10311534059c44',
    callbackURL: 'http://www.suntoriexpress.com/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '300039047767-ujc7f9ko836s7uqknlml45uunnqu3aqo.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'mTYIOQwab0tt7n0A98evQaQR',
    callbackURL: 'http://www.suntoriexpress.com/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      host: 'smtp.gmail.com',
      port: '465',
      secure: true,
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'info@suntoriexpress.com',
        pass: process.env.MAILER_PASSWORD || 'suntoriP@ssw0rd'
      }
    }
  },
  livereload: true
};
