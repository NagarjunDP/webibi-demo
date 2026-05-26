const fs = require('fs');
const html = fs.readFileSync('templates/shell-events.html', 'utf8');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html);
const document = dom.window.document;
console.log('Hero present:', !!document.querySelector('.hero'));
console.log('Marquee present:', !!document.querySelector('.marquee-wrap'));
console.log('Reveal elements:', document.querySelectorAll('.reveal').length);
console.log('Hero inner:', document.querySelector('.hero') ? document.querySelector('.hero').innerHTML.length : 0);
