const fs = require('fs');
const html = fs.readFileSync('kalache_live.html', 'utf8');

// Look at article tag classes
const articleMatch = html.match(/<article[^>]+class=["']([^"']+)["']/i);
if (articleMatch) {
  console.log('Article classes:', articleMatch[1]);
}

// Check template, format, taxonomy, custom fields in wp_posts
if (fs.existsSync('wp_posts.json')) {
  const posts = JSON.parse(fs.readFileSync('wp_posts.json', 'utf8'));
  const p = posts[0];
  console.log('Post format:', p.format);
  console.log('Post template:', p.template);
  console.log('Post categories:', p.categories);
  console.log('Post meta keys:', Object.keys(p.meta || {}));
  console.log('Post taxonomies embedded:', p._embedded ? Object.keys(p._embedded) : []);
  if (p._embedded && p._embedded['wp:term']) {
    console.log('All terms:');
    p._embedded['wp:term'].forEach((taxList, i) => {
      console.log(`Taxonomy #${i}:`, taxList.map(t => `${t.taxonomy}: ${t.name} (slug: ${t.slug})`));
    });
  }
}
