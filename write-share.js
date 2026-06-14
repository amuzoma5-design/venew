const fs = require('fs');

let c = fs.readFileSync('components/HomeClient.tsx', 'utf8');

// Fix 1: Replace "3 Cities" stat with "Nigeria"
c = c.replace(
  '{ label: "Cities", value: "3" },',
  '{ label: "Country", value: "🇳🇬" },'
);

// Fix 2: Remove the Feature My Event CTA div entirely
c = c.replace(
  `          {/* Feature Your Event CTA */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", backgroundColor: "#FFF8E7", border: "1px solid #F5A623", borderRadius: "12px", padding: "12px 20px", marginBottom: "32px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "20px" }}>⭐</span>
            <p style={{ color: "#374151", fontSize: "14px" }}>Want your event featured at the top?</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#F5A623", color: "#FFFFFF", fontWeight: 700, fontSize: "13px", padding: "8px 16px", borderRadius: "999px", textDecoration: "none", whiteSpace: "nowrap" }}>
              Feature My Event
            </a>
          </div>`,
  `          {/* Feature Your Event CTA - only for logged in users */}
          {user && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", backgroundColor: "#FFF8E7", border: "1px solid #F5A623", borderRadius: "12px", padding: "12px 20px", marginBottom: "32px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "20px" }}>⭐</span>
              <p style={{ color: "#374151", fontSize: "14px" }}>Want your event featured at the top?</p>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#F5A623", color: "#FFFFFF", fontWeight: 700, fontSize: "13px", padding: "8px 16px", borderRadius: "999px", textDecoration: "none", whiteSpace: "nowrap" }}>
                Feature My Event
              </a>
            </div>
          )}`
);

fs.writeFileSync('components/HomeClient.tsx', c);
console.log('Done!');