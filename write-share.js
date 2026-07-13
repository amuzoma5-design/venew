const fs = require('fs');

let c = fs.readFileSync('app/admin/page.tsx', 'utf8');

// Replace cover image URL input with file upload
c = c.replace(
  `            <div>
              <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Cover Image URL (optional)</label>
              <input name="cover_image" value={form.cover_image} onChange={handleChange} placeholder="https://..." style={inputStyle} />
            </div>`,
  `            <div>
              <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Cover Image</label>
              {form.cover_image && (
                <img src={form.cover_image} alt="Cover preview" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px", marginBottom: "12px", border: "1px solid #2A2A2A" }} />
              )}
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "#111", border: "1px dashed #2A2A2A", borderRadius: "10px", padding: "20px", cursor: "pointer", color: "#6B6B6B", fontSize: "14px" }}>
                📷 {blogImage ? blogImage.name : "Click to upload cover image"}
                <input type="file" accept="image/*" onChange={handleBlogImageChange} style={{ display: "none" }} />
              </label>
            </div>`
);

// Add blogImage state and handler after existing useState declarations in BlogAdmin
c = c.replace(
  `  const [view, setView] = useState<"list" | "write">("list");

  useEffect(() => { loadPosts(); }, []);`,
  `  const [view, setView] = useState<"list" | "write">("list");
  const [blogImage, setBlogImage] = useState<File | null>(null);

  useEffect(() => { loadPosts(); }, []);

  function handleBlogImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBlogImage(file);
      setForm((prev) => ({ ...prev, cover_image: URL.createObjectURL(file) }));
    }
  }`
);

// Update handlePublish to upload image first
c = c.replace(
  `  async function handlePublish() {
    if (!form.title || !form.content) { setError("Title and content are required."); return; }
    setSaving(true);
    setError("");
    const { error: sbError } = await supabase.from("blog_posts").insert([{ title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content, category: form.category, cover_image: form.cover_image || null, published: true }]);`,
  `  async function handlePublish() {
    if (!form.title || !form.content) { setError("Title and content are required."); return; }
    setSaving(true);
    setError("");
    let coverImageUrl = null;
    if (blogImage) {
      const fileExt = blogImage.name.split(".").pop();
      const fileName = "blog-" + Date.now() + "." + fileExt;
      const { error: uploadError } = await supabase.storage.from("event-images").upload(fileName, blogImage);
      if (uploadError) { setError("Image upload failed: " + uploadError.message); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(fileName);
      coverImageUrl = urlData.publicUrl;
    }
    const { error: sbError } = await supabase.from("blog_posts").insert([{ title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content, category: form.category, cover_image: coverImageUrl, published: true }]);`
);

// Reset blogImage after publish
c = c.replace(
  `      setForm({ title: "", slug: "", excerpt: "", content: "", category: "Opportunities", cover_image: "" });`,
  `      setForm({ title: "", slug: "", excerpt: "", content: "", category: "Opportunities", cover_image: "" });
      setBlogImage(null);`
);

fs.writeFileSync('app/admin/page.tsx', c);
console.log('Done!');