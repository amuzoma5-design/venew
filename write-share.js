const fs = require('fs');

let c = fs.readFileSync('app/account/page.tsx', 'utf8');

// Update stat labels
c = c.replace('Saved Events', 'Saved Discoveries');
c = c.replace('Events Viewed', 'Discoveries Viewed');
c = c.replace('My Events', 'My Discoveries');

// Update interests description
c = c.replace(
  'Select your interests to get personalized event recommendations',
  'Select your interests to get personalized discovery recommendations'
);

// Update quick links
c = c.replace('My Saved Events', 'My Saved Discoveries');
c = c.replace('Submit an Event', 'Submit a Discovery');
c = c.replace('Browse Events', 'Explore Discoveries');

// Update quick links href
c = c.replace('href: "/submit"', 'href: "/submit"');
c = c.replace('href: "/"', 'href: "/events"');

// Update My Events tab label
c = c.replace('"📋 My Events"', '"📋 My Discoveries"');
c = c.replace('"👤 Profile"', '"👤 Profile"');

// Update empty state in My Events tab
c = c.replace(
  'Submit your first event and it will appear here',
  'Submit your first discovery and it will appear here'
);
c = c.replace(
  'Submit an Event',
  'Submit a Discovery'
);

// Update My Account tagline
c = c.replace(
  'My Account',
  'My Account'
);

// Update tab label
c = c.replace(
  '{ label: "📋 My Events", value: "events" }',
  '{ label: "📋 My Discoveries", value: "events" }'
);

fs.writeFileSync('app/account/page.tsx', c);
console.log('Done!');