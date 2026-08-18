const fs = require('fs');

// Fix blog post CTA
let b = fs.readFileSync('app/blog/[slug]/page.tsx', 'utf8');
b = b.replace(
  'Discover Events & Opportunities on VENEW',
  'Discover More on VENEW'
);
b = b.replace(
  'Find conferences, scholarships, church programs, and more happening near you.',
  'Find scholarships, grants, fellowships, events, communities and opportunities across Africa.'
);
b = b.replace(
  'Browse Events & Opportunities →',
  'Explore Discoveries →'
);
fs.writeFileSync('app/blog/[slug]/page.tsx', b);
console.log(b.includes('Discover More on VENEW') ? 'Blog post CTA fixed!' : 'FAILED - text not found');

// Fix Navbar Browse Events
let n = fs.readFileSync('components/Navbar.tsx', 'utf8');
n = n.replace(/Browse Events/g, 'Explore');
n = n.replace(/Discovery Platform/g, 'Discover Africa');
fs.writeFileSync('components/Navbar.tsx', n);
console.log(n.includes('Explore') ? 'Navbar fixed!' : 'Navbar FAILED');

// Fix layout meta
let l = fs.readFileSync('app/layout.tsx', 'utf8');
l = l.replace(
  'VENEW — Discover Events & Opportunities in Nigeria',
  "VENEW — Africa's Discovery Platform"
);
l = l.replace(
  'Find events, opportunities, conferences, seminars, and workshops happening near you.',
  'Discover opportunities, scholarships, grants, fellowships, events and communities across Africa.'
);
fs.writeFileSync('app/layout.tsx', l);
console.log(l.includes("Africa's Discovery Platform") ? 'Layout fixed!' : 'Layout FAILED');