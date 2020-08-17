/* eslint-disable */

const path = require('path');
const moduleAlias = require('module-alias');

moduleAlias.addAlias('@app', path.join(__dirname, 'dist/'));
