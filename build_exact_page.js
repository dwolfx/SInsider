const fs = require('fs');

const header = fs.readFileSync('extracted_header.html', 'utf8');
const footer = fs.readFileSync('extracted_footer.html', 'utf8');
const drawer = fs.existsSync('drawer_content.html') ? fs.readFileSync('drawer_content.html', 'utf8') : '';
const search = fs.existsSync('search_content.html') ? fs.readFileSync('search_content.html', 'utf8') : '';
const main = fs.readFileSync('main_content.html', 'utf8');

// Combine full body HTML
let fullHtml = `
${header}
${search}
${drawer}
${main}
${footer}
`;

// Replace links to make them internal Next.js routes
fullHtml = fullHtml.replace(/href="https:\/\/saudeinsider\.com\.br\/editoria\/([^"]+)"/g, 'href="/categoria/$1"');
fullHtml = fullHtml.replace(/href="https:\/\/saudeinsider\.com\.br\/(?!wp-content|wp-json|categoria)([^"\/]+)\/"/g, 'href="/noticia/$1"');
fullHtml = fullHtml.replace(/href="https:\/\/saudeinsider\.com\.br\/"/g, 'href="/"');

// Save as processed_live_page.html
fs.writeFileSync('processed_live_page.html', fullHtml, 'utf8');
console.log('Saved processed_live_page.html with length:', fullHtml.length);
