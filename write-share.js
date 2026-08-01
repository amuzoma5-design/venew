const fs = require('fs');

let c = fs.readFileSync('components/Navbar.tsx', 'utf8');

// Add to desktop nav
c = c.replace(
  '<Link href="/blog" style={{ color: "#6B7280", fontSize: "14px", textDecoration: "none" }}>Blog</Link>',
  '<Link href="/blog" style={{ color: "#6B7280", fontSize: "14px", textDecoration: "none" }}>Blog</Link>\n          <Link href="/spotlight" style={{ color: "#6B7280", fontSize: "14px", textDecoration: "none" }}>✨ Spotlight</Link>'
);

// Add to mobile menu
c = c.replace(
  '<Link href="/blog" onClick={() => setMenuOpen(false)} style={{ color: "#374151", fontSize: "15px", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>Blog</Link>',
  '<Link href="/blog" onClick={() => setMenuOpen(false)} style={{ color: "#374151", fontSize: "15px", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>Blog</Link>\n          <Link href="/spotlight" onClick={() => setMenuOpen(false)} style={{ color: "#374151", fontSize: "15px", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>✨ Spotlight</Link>'
);

fs.writeFileSync('components/Navbar.tsx', c);
console.log(c.includes('/spotlight') ? 'Navbar updated!' : 'FAILED');