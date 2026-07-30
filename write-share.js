const fs = require('fs');

// Fix Navbar tagline
let nav = fs.readFileSync('components/Navbar.tsx', 'utf8');
nav = nav.replace(
  'Events & Opportunities',
  'Discovery Platform'
);
fs.writeFileSync('components/Navbar.tsx', nav);
console.log(nav.includes('Discovery Platform') ? 'Navbar updated!' : 'Navbar FAILED');

// Fix HomeClient stats
let c = fs.readFileSync('components/HomeClient.tsx', 'utf8');
c = c.replace(
  `          <div style={{ display: "flex", gap: "48px", marginBottom: "32px", flexWrap: "wrap" }}>
            {[
              { label: "Discoveries", value: String(events.length) },
              { label: "Country", value: "🇳🇬" },
              { label: "Categories", value: String(categories.length) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "36px",
                  fontWeight: 900,
                  color: "#F5A623",
                  lineHeight: 1,
                }}>
                  {value}
                </p>
                <p style={{
                  color: "#9CA3AF",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginTop: "6px",
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>`,
  `          <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
            {[
              { icon: "🌍", label: "Africa" },
              { icon: "🔍", label: "Discovery Platform" },
              { icon: "🚀", label: categories.length + " Categories" },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#FFF8E7",
                border: "1px solid #F5A62330",
                borderRadius: "999px",
                padding: "8px 16px",
              }}>
                <span style={{ fontSize: "16px" }}>{icon}</span>
                <span style={{ color: "#D97706", fontSize: "13px", fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>`
);
fs.writeFileSync('components/HomeClient.tsx', c);
console.log(c.includes('Discovery Platform') ? 'HomeClient updated!' : 'HomeClient FAILED');