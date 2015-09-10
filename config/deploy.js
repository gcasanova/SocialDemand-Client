module.exports = {
  development: {
    buildEnv: 'development', // Override the environment passed to the ember asset build. Defaults to 'production'
    store: {
      host: 'ec2-52-16-18-4.eu-west-1.compute.amazonaws.com',
      port: 6379,
      type: 'redis' // the default store is 'redis'
    },
    assets: {
      type: 's3', // default asset-adapter is 's3'
      gzip: true, // if undefined or set to true, files are gziped
      gzipExtensions: ['js', 'css', 'svg'], // if undefined, js, css & svg files are gziped
      exclude: ['.DS_Store', '*-test.js'], // defaults to empty array
      accessKeyId: 'AKIAJIX3SQXGBFGLRI7Q',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucket: 'social-demand'
    }
  }

  // staging: {
  //   buildEnv: 'staging', // Override the environment passed to the ember asset build. Defaults to 'production'
  //   store: {
  //     host: 'staging-redis.example.com',
  //     port: 6379
  //   },
  //   assets: {
  //     accessKeyId: '<your-access-key-goes-here>',
  //     secretAccessKey: process.env['AWS_ACCESS_KEY'],
  //     bucket: '<your-bucket-name>'
  //   },
  //   manifestPrefix: 'stage-app' // optional, defaults to this.project.name()
  // },
  //
  //  production: {
  //   store: {
  //     host: 'production-redis.example.com',
  //     port: 6379,
  //     password: '<your-redis-secret>'
  //   },
  //   assets: {
  //     accessKeyId: '<your-access-key-goes-here>',
  //     secretAccessKey: process.env['AWS_ACCESS_KEY'],
  //     bucket: '<your-bucket-name>'
  //   }
  // }
};
