const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = line.match(/(".*?"|[^,]+|(?<=,)(?=,)|(?<=,)$|^(?=,))/g) || [];
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim().replace(/^"|"$/g, ''); });
    return obj;
  });
}

const file = path.join(__dirname, '..', 'public', 'karirak-jobs-template.csv');
const txt = fs.readFileSync(file, 'utf8');
const parsed = parseCSV(txt);
console.log('Parsed rows:', parsed.length);
console.log(parsed.slice(0,2));
