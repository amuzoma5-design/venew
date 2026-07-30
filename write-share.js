const fs = require('fs');

let c = fs.readFileSync('app/profile/[username]/page.tsx', 'utf8');

c = c.replace(
  'Discover Events & Opportunities',
  'Discover Opportunities on VENEW'
);

c = c.replace(
  'Find events near you on VENEW',
  'Find scholarships, grants, fellowships, events, communities and more — all in one place.'
);

fs.writeFileSync('app/profile/[username]/page.tsx', c);
console.log(c.includes('Discover Opportunities on VENEW') ? 'SUCCESS!' : 'FAILED');