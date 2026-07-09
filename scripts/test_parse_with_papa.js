/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const file = path.join(__dirname, '..', 'public', 'karirak-jobs-template.csv');
const txt = fs.readFileSync(file, 'utf8');
const parsed = Papa.parse(txt, { header: true, skipEmptyLines: true });
console.log('Papa parsed rows:', parsed.data.length);
console.log('errors:', parsed.errors.length);
console.log(parsed.data.slice(0,2));
