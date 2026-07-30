const fs = require('fs');

let c = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

c = c.replace('Organizer Command Center', 'Discovery Command Center');
c = c.replace('Total Events', 'Total Discoveries');
c = c.replace('Upcoming Events', 'Active Discoveries');
c = c.replace('"📅", "Upcoming Events"', '"📅", "Active Discoveries"');
c = c.replace('📊 Event Performance', '📊 Discovery Performance');
c = c.replace('👁️ Most Viewed Event', '👁️ Most Viewed Discovery');
c = c.replace('❤️ Most Saved Event', '❤️ Most Saved Discovery');
c = c.replace('No saves yet', 'No saves yet');
c = c.replace('My Events', 'My Discoveries');
c = c.replace('"Upcoming Events"', '"Active Discoveries"');
c = c.replace('"Past Events"', '"Past Discoveries"');
c = c.replace('➕ Create New Event', '➕ Submit a Discovery');
c = c.replace('href: "/submit"', 'href: "/submit"');
c = c.replace('No upcoming events.', 'No active discoveries.');
c = c.replace('No past events yet.', 'No past discoveries yet.');

fs.writeFileSync('app/dashboard/page.tsx', c);
console.log('Done!');