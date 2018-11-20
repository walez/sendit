import _ from 'lodash';
import glob from 'glob';

export default {
  app: {
    title: 'SendIT',
    description: 'SendIT is a courier service that helps users deliver parcels to different destinations.',
    url: 'http://localhost:8085',
  },
  port: process.env.PORT,
  hostname: process.env.HOSTNAME,
  env: process.env.NODE_ENV,
  authorization: 'mysecrettoken',
  jwt: {
    issuer: process.env.JWT_ISSUER,
  },
  toggle: {
    apidoc: process.env.TOGGLE_APIDO,
  },
};

/**
 * Get files by glob patterns
 */
export function getGlobbedFiles(globPatterns, removeRoot) {
  // For context switching
  const that = this;

  // URL paths regex
  const urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

  // The output array
  let output = [];

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, that.getGlobbedFiles(globPattern, removeRoot));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (removeRoot) {
        files = files.map(file => file.replace(removeRoot, ''));
      }
      output = _.union(output, files);
    }
  }

  return output;
}
