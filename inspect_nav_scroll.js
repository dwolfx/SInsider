const fs = require('fs');
const js = fs.readFileSync('public/js/navigation.js', 'utf8');
const lines = js.split('\n');
lines.forEach((l, i) => {
  if (l.includes('is-fixo') || l.includes('scroll') || l.includes('barra-fixa') || l.includes('data-si-barra-fixa')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
