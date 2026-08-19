const fs = require('fs');

// Fix Navbar - Submit Event to Submit Discovery
let n = fs.readFileSync('components/Navbar.tsx', 'utf8');
n = n.replace(/Submit Event/g, 'Submit Discovery');
fs.writeFileSync('components/Navbar.tsx', n);
console.log(n.includes('Submit Discovery') ? 'Navbar Submit fixed!' : 'Navbar FAILED');

// Fix Dashboard - My Events tab
let d = fs.readFileSync('app/dashboard/page.tsx', 'utf8');
d = d.replace(/My Events/g, 'My Discoveries');
d = d.replace(/Upcoming Events/g, 'Active Discoveries');
d = d.replace(/Past Events/g, 'Past Discoveries');
d = d.replace(/upcoming === "upcoming"/g, 'activeTab === "upcoming"');
d = d.replace('"Upcoming Events"', '"Active Discoveries"');
d = d.replace('"Past Events"', '"Past Discoveries"');
fs.writeFileSync('app/dashboard/page.tsx', d);
console.log(d.includes('My Discoveries') ? 'Dashboard fixed!' : 'Dashboard FAILED');