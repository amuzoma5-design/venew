const fs = require('fs');

let c = fs.readFileSync('app/blog/page.tsx', 'utf8');

// Update blog tagline
c = c.replace(
  'VENEW Blog',
  'Discovery Hub'
);

// Update blog headline
c = c.replace(
  'Insights on Events,\n            <br />\n            <span style={{ color: "#F5A623" }}>Opportunities & Growth</span>',
  'Stories, Opportunities\n            <br />\n            <span style={{ color: "#F5A623" }}>& Discoveries That Matter</span>'
);

// Update blog description
c = c.replace(
  'Discover scholarships, opportunities, events and communities that can help you grow personally, professionally and spiritually.',
  'Real stories, verified opportunities, scholarships, grants, fellowships, events and communities — curated to help you discover what can move your life forward.'
);

// Update blog CTA button
c = c.replace(
  'Browse Events & Opportunities →',
  'Explore Discoveries →'
);

// Update empty state
c = c.replace(
  'First article coming soon',
  'First discovery coming soon'
);

c = c.replace(
  'We are working on valuable content for you. Check back soon!',
  'We are curating verified opportunities and discoveries for you. Check back soon!'
);

fs.writeFileSync('app/blog/page.tsx', c);
console.log('Done!');