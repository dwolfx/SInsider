fetch('https://saudeinsider.com.br/wp-json/wp/v2/taxonomies')
  .then(r => r.json())
  .then(tax => {
    console.log('All Taxonomies in WP:');
    for (const [k, v] of Object.entries(tax)) {
      console.log('- ' + k + ': ' + v.name + ' (endpoint: ' + v.rest_base + ')');
    }
  });
