const { KALACHE_EXACT_MAIN_HTML } = require('./src/lib/kalache-html.ts');
const m = KALACHE_EXACT_MAIN_HTML.match(/<article[^>]+class=["']([^"']+)["']/i);
console.log('Article class:', m ? m[1] : 'not found');
