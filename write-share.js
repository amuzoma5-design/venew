const fs = require('fs');

// Fix 1 - layout.tsx meta title and description
let layout = fs.readFileSync('app/layout.tsx', 'utf8');
layout = layout.replace(
  'VENEW — Discover Events & Opportunities in Nigeria',
  'VENEW — Africa\'s Discovery Platform'
);
layout = layout.replace(
  'Find events, opportunities, conferences, seminars, and workshops happening near you.',
  'Discover opportunities, scholarships, grants, fellowships, events, communities and more across Africa.'
);
layout = layout.replace(
  'Find events, opportunities, conferences, ...',
  'Discover opportunities, scholarships, events and more across Africa.'
);
fs.writeFileSync('app/layout.tsx', layout);
console.log(layout.includes("Africa's Discovery Platform") ? 'Layout updated!' : 'Layout FAILED');

// Fix 2 - Blog page hero
let blog = fs.readFileSync('app/blog/page.tsx', 'utf8');
blog = blog.replace(
  'Insights on Events,\n            <br />\n            <span style={{ color: "#F5A623" }}>Opportunities & Growth</span>',
  'Africa\'s Discovery\n            <br />\n            <span style={{ color: "#F5A623" }}>Hub</span>'
);
blog = blog.replace(
  'Stories, Opportunities\n            <br />\n            <span style={{ color: "#F5A623" }}>& Discoveries That Matter</span>',
  'Africa\'s Discovery\n            <br />\n            <span style={{ color: "#F5A623" }}>Hub</span>'
);
blog = blog.replace(
  'Discover scholarships, opportunities, events and communities that can help you grow personally, professionally and spiritually.',
  'Verified opportunities, scholarships, grants, fellowships, events, communities and stories — curated to help you discover what can move your life forward.'
);
blog = blog.replace(
  'Real stories, verified opportunities, scholarships, grants, fellowships, events and communities — curated to help you discover what can move your life forward.',
  'Verified opportunities, scholarships, grants, fellowships, events, communities and stories — curated to help you discover what can move your life forward.'
);
fs.writeFileSync('app/blog/page.tsx', blog);
console.log(blog.includes("Africa's Discovery") ? 'Blog updated!' : 'Blog FAILED');

// Fix 3 - Blog post CTA at bottom
let blogPost = fs.readFileSync('app/blog/[slug]/page.tsx', 'utf8');
blogPost = blogPost.replace(
  'Discover Events & Opportunities on VENEW',
  'Discover More on VENEW'
);
blogPost = blogPost.replace(
  'Find conferences, scholarships, church programs, and more happening near you.',
  'Find scholarships, grants, fellowships, events, communities and opportunities across Africa.'
);
blogPost = blogPost.replace(
  'Browse Events & Opportunities →',
  'Explore Discoveries →'
);
fs.writeFileSync('app/blog/[slug]/page.tsx', blogPost);
console.log(blogPost.includes('Discover More on VENEW') ? 'Blog post updated!' : 'Blog post FAILED');

// Fix 4 - Navbar tagline shorter
let nav = fs.readFileSync('components/Navbar.tsx', 'utf8');
nav = nav.replace(
  'Discovery Platform',
  'Discover Africa'
);
fs.writeFileSync('components/Navbar.tsx', nav);
console.log(nav.includes('Discover Africa') ? 'Navbar updated!' : 'Navbar FAILED');