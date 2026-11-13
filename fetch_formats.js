fetch('https://saudeinsider.com.br/wp-json/wp/v2/si_format?per_page=100')
  .then(r => r.json())
  .then(formats => {
    console.log('Total formats found:', formats.length);
    const sorted = formats.sort((a,b) => b.count - a.count);
    sorted.slice(0, 20).forEach(f => {
      console.log(`- ${f.name} (slug: "${f.slug}", posts: ${f.count})`);
    });
  });
