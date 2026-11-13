const fs = require('fs');
const css = fs.readFileSync('src/styles/header.css', 'utf8');

const regex = /\.si-header(?:\.is-fixo|[^{]*\.is-fixo)[^{]*\{[\s\S]*?\}/gi;
const matches = [...css.matchAll(regex)].map(m => m[0]);
console.log('Total is-fixo CSS rules in header.css:', matches.length);
matches.slice(0, 15).forEach(m => console.log('\n--- RULE ---\n' + m));
