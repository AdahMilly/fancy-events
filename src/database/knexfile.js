import path from 'path';

import { getConfig } from '../config';

const {
  env,
  db: { name, username, password, host, databaseUrl },
} = getConfig();

let connectionString;

if(databaseUrl){
  connectionString = databaseUrl;
} else {
connectionString = `postgresql://${username}:${password}@${host}/${name}`
}
  

const defaultOptions = {
  client: 'pg',
  connection: connectionString,
  migrations: {
    directory: path.join(__dirname, 'migrations'),
  },
};

const configs = {
  development: defaultOptions,
  staging: defaultOptions,
  production: defaultOptions,
  local: defaultOptions,
  test: defaultOptions,
};

if (configs[env] === undefined) {
  throw Error(`Missing configuration for environment: ${env}`);
}

module.exports = configs;
