const fs = require('fs');

const org = './src/postposition.js';
const result = './index.js';
const umdOrg = './dist/cox.postposition.min.js';
const umdResult = './umd/index.js';

if(!fs.existsSync('./umd')) {
  fs.mkdirSync('umd');
}

fs.copyFileSync(org, result);
fs.copyFileSync(umdOrg, umdResult);
