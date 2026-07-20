const fs = require('fs');

let c = fs.readFileSync('app/account/page.tsx', 'utf8');

// Add avatar state
c = c.replace(
  "  const [saving, setSaving] = useState(false);",
  "  const [saving, setSaving] = useState(false);\n  const [avatarFile, setAvatarFile] = useState(null);\n  const [avatarPreview, setAvatarPreview] = useState(null);"
);

// Add avatar upload handler after toggleInterest function
c = c.replace(
  "  async function handleSave() {",
  `  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  async function handleSave() {`
);

// Upload avatar in handleSave before upsert
c = c.replace(
  "    setSaving(true);",
  `    setSaving(true);
    let avatarUrl = profile?.avatar_url || null;
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = "avatar-" + user.id + "-" + Date.now() + "." + fileExt;
      const { error: uploadError } = await supabase.storage.from("event-images").upload(fileName, avatarFile);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(fileName);
        avatarUrl = urlData.publicUrl;
      }
    }`
);

// Add avatar_url to upsert
c = c.replace(
  "      updated_at: new Date().toISOString(),",
  "      avatar_url: avatarUrl,\n      updated_at: new Date().toISOString(),"
);

// Add avatar upload UI before Display Name field in editing form
c = c.replace(
  "            {/* Display name */}\n              <div>",
  `            {/* Avatar upload */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "3px solid #F5A623", background: (avatarPreview || profile?.avatar_url) ? "url(" + (avatarPreview || profile?.avatar_url) + ") center/cover no-repeat" : "linear-gradient(135deg, #F5A623, #D97706)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: "36px", fontWeight: 900, color: "white" }}>
                  {!(avatarPreview || profile?.avatar_url) && (profile?.display_name?.[0] ?? "V")}
                </div>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#1A1A1A", border: "1px dashed #F5A623", borderRadius: "10px", padding: "10px 20px", cursor: "pointer", color: "#F5A623", fontSize: "13px", fontWeight: 600 }}>
                  📷 {avatarFile ? avatarFile.name : "Upload Profile Photo"}
                  <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                </label>
              </div>

            {/* Display name */}
              <div>`
);

fs.writeFileSync('app/account/page.tsx', c);
console.log('Done!');