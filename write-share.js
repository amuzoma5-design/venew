const fs = require('fs');

let c = fs.readFileSync('app/admin/page.tsx', 'utf8');

// Update tab labels
c = c.replace('"📋 Events"', '"📋 Discoveries"');

// Update section headers
c = c.replace('All Submitted Events', 'All Submitted Discoveries');
c = c.replace('Registered Users', 'Registered Users');

// Update loading text
c = c.replace('Loading events...', 'Loading discoveries...');

// Update approve button
c = c.replace('✓ Approve', '✓ Approve');

// Update stats labels
c = c.replace('"Total Events"', '"Total Discoveries"');
c = c.replace('"Approved"', '"Live"');
c = c.replace('"Pending"', '"Pending Review"');

// Update analytics section headers
c = c.replace('👁️ Most Viewed Events', '👁️ Most Viewed Discoveries');
c = c.replace('❤️ Most Saved Events', '❤️ Most Saved Discoveries');

// Update admin header
c = c.replace('All Submitted Events', 'All Submitted Discoveries');

// Update empty discovery messaging
c = c.replace(
  'No view data yet.',
  'No view data yet.'
);

// Update blog tab
c = c.replace('"✍️ Blog"', '"✍️ Discovery Hub"');
c = c.replace('✍️ Blog Management', '✍️ Discovery Hub Management');
c = c.replace('✍️ Write New Post', '✍️ Write New Article');
c = c.replace('📋 All Posts', '📋 All Articles');
c = c.replace('Write First Post', 'Write First Article');
c = c.replace('No blog posts yet.', 'No articles yet.');
c = c.replace('Publish Blog Post →', 'Publish Article →');
c = c.replace('Publishing...', 'Publishing...');
c = c.replace('✅ Published! Redirecting to posts list...', '✅ Published! Redirecting to articles list...');

fs.writeFileSync('app/admin/page.tsx', c);
console.log('Done!');