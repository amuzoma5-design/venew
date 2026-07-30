const fs = require('fs');

let c = fs.readFileSync('app/profile/[username]/page.tsx', 'utf8');

// Update CTA section
c = c.replace(
  'Discover Events & Opportunities on VENEW',
  'Discover Opportunities on VENEW'
);

c = c.replace(
  'Find conferences, scholarships, church programs, and more happening near you.',
  'Find scholarships, grants, fellowships, events, communities and more — all in one place.'
);

c = c.replace(
  'Browse VENEW →',
  'Explore Discoveries →'
);

// Update profile completeness label
c = c.replace(
  'Profile Completeness',
  'Profile Completeness'
);

// Update events organised section
c = c.replace(
  'Events Organised',
  'Discoveries Organised'
);

// Update share text
c = c.replace(
  '"Check out " + name + " on VENEW 👉 " + profileUrl',
  '"Check out " + name + " on VENEW — Africa\'s Discovery Platform 👉 " + profileUrl'
);

fs.writeFileSync('app/profile/[username]/page.tsx', c);
console.log('Done!');