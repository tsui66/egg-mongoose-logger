'use strict';

const assert = require('assert');
const mongoose = require('mongoose');

module.exports = app => {
  app.coreLogger.info('[egg-mongoose-logger] init');
  const config = app.config.mongooseLogger;
  assert(config.debug, '[egg-mongoose-logger] debug is required on config');
  if (config.debug === true) {
    mongoose.set('debug', (collectionName, methodName, query, doc, options) => {
      const meta = { collectionName, methodName, query, doc, options };
		// custom fomat
      const formatter = config.formatter || defaultFormatter;
      app.logger.info('[egg-mongoose-logger]', formatter(meta));
    });
  }
};

// default format
function defaultFormatter(meta) {
  const query = JSON.stringify(meta.query);
  const options = JSON.stringify(meta.options || {});
  return `db.getCollection('${meta.collectionName}').${meta.methodName}(${query}, ${options})`;
}
