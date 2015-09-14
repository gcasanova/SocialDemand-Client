/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    host: 'http://ec2-52-16-18-4.eu-west-1.compute.amazonaws.com:8080',
    contentSecurityPolicy: {
      'style-src': "'self' 'unsafe-inline'",
      'connect-src': "'self' ws://localhost:35729 ws://0.0.0.0:35729 http://0.0.0.0:4200/csp-report https://maps.googleapis.com http://www.telize.com http://localhost:8080 http://ec2-52-16-18-4.eu-west-1.compute.amazonaws.com:8080"
    },
    modulePrefix: 'social-demand-client',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    'simple-auth': {
      crossOriginWhitelist: ['*'],
      authorizer: 'simple-auth-authorizer:token'
    },
    'simple-auth-token': {
      timeFactor: 1000,
      refreshLeeway: 86400, // Time in seconds before expiration time for the token to be refreshed
      serverTokenEndpoint: 'http://ec2-52-16-18-4.eu-west-1.compute.amazonaws.com:8080/api/auth/token',
      serverTokenRefreshEndpoint: 'http://ec2-52-16-18-4.eu-west-1.compute.amazonaws.com:8080/api/auth/refresh'
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      S3_SECRET_KEY: process.env.S3_SECRET_ACCESS_KEY
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
