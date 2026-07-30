const fs = require('fs');

let c = fs.readFileSync('components/HomeClient.tsx', 'utf8');

// Update tagline
c = c.replace(
  'Events & Opportunities',
  'Africa\'s Discovery Platform'
);

// Update headline
c = c.replace(
  "            Discover What's<br />",
  '            Discover What Can<br />'
);

// Update gold span
c = c.replace(
  '            <span style={{ color: "#F5A623" }}>Happening & Possible.</span>',
  '            <span style={{ color: "#F5A623" }}>Move You Forward.</span>'
);

// Update supporting text
c = c.replace(
  '            Explore events, opportunities, communities, workshops, conferences, and experiences designed to help you grow.',
  '            Discover opportunities, scholarships, grants, fellowships, internships, jobs, events, competitions, communities, and learning resources — all in one trusted place.'
);

// Update second line
c = c.replace(
  '            Find your next event, opportunity, or meaningful connection.',
  '            Every discovery on Venew is something that can move your life forward.'
);

// Update search placeholder
c = c.replace(
  'placeholder="Search events, opportunities, cities, topics..."',
  'placeholder="Search scholarships, grants, events, jobs, communities..."'
);

// Update section title
c = c.replace(
  '                {search ? `Results for "${search}"` : "Browse Events & Opportunities"}',
  '                {search ? `Results for "${search}"` : "Latest Discoveries"}'
);

// Update listings count text
c = c.replace(
  '                {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found',
  '                {filtered.length} discover{filtered.length !== 1 ? "ies" : "y"} found'
);

// Update featured section title
c = c.replace(
  '                  Featured Events & Opportunities',
  '                  Featured Discoveries'
);

// Update empty state
c = c.replace(
  '                No listings found',
  '                No discoveries found'
);

c = c.replace(
  '                Try a different search or category',
  '                Try a different search or filter'
);

// Update feature CTA text
c = c.replace(
  '            <p style={{ color: "#374151", fontSize: "14px" }}>Want your event featured at the top?</p>',
  '            <p style={{ color: "#374151", fontSize: "14px" }}>Want your discovery featured at the top?</p>'
);

// Update feature button text
c = c.replace(
  '              Feature My Event',
  '              Feature My Discovery'
);

// Update stats
c = c.replace(
  '{ label: "Listings", value: String(events.length) },',
  '{ label: "Discoveries", value: String(events.length) },'
);

fs.writeFileSync('components/HomeClient.tsx', c);
console.log('Done!');