const fs = require('fs');

let c = fs.readFileSync('app/account/page.tsx', 'utf8');

// Add profile link card after the stats section
c = c.replace(
  '        {/* Profile card */}',
  `        {/* Public Profile Link */}
        {profile?.username && (
          <div style={{ backgroundColor: "#FFF8E7", border: "1px solid #F5A623", borderRadius: "16px", padding: "20px 24px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ color: "#D97706", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Your Public Profile</p>
              <p style={{ color: "#111827", fontSize: "15px", fontWeight: 700 }}>venew.ng/profile/{profile.username}</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <a href={"/profile/" + profile.username} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#F5A623", color: "#FFFFFF", fontWeight: 700, fontSize: "13px", padding: "10px 16px", borderRadius: "999px", textDecoration: "none" }}>
                👤 View Profile
              </a>
              <button onClick={() => { navigator.clipboard.writeText("https://venew.ng/profile/" + profile.username); alert("Profile link copied!"); }} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#FFFFFF", color: "#374151", fontWeight: 700, fontSize: "13px", padding: "10px 16px", borderRadius: "999px", border: "1px solid #E5E7EB", cursor: "pointer" }}>
                🔗 Copy Link
              </button>
              <a href={"https://wa.me/?text=Check out my profile on VENEW 👉 https://venew.ng/profile/" + profile.username} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#25D366", color: "#FFFFFF", fontWeight: 700, fontSize: "13px", padding: "10px 16px", borderRadius: "999px", textDecoration: "none" }}>
                📱 Share
              </a>
            </div>
          </div>
        )}

        {/* Profile card */}`
);

fs.writeFileSync('app/account/page.tsx', c);
console.log('Done!');