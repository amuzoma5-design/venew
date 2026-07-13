const fs = require('fs');

let c = fs.readFileSync('app/admin/page.tsx', 'utf8');

// Add editingPost state
c = c.replace(
  '  const [blogImage, setBlogImage] = useState<File | null>(null);',
  '  const [blogImage, setBlogImage] = useState<File | null>(null);\n  const [editingPost, setEditingPost] = useState<any>(null);'
);

// Add edit button next to delete button in posts list
c = c.replace(
  '                    <button onClick={() => deletePost(post.id)} style={{ backgroundColor: "transparent", color: "#F43F5E", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid #F43F5E30", cursor: "pointer" }}>Delete</button>',
  '                    <button onClick={() => { setEditingPost(post); setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt || "", content: post.content || "", category: post.category, cover_image: post.cover_image || "" }); setView("write"); }} style={{ backgroundColor: "#3B82F6", color: "#FFFFFF", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "none", cursor: "pointer" }}>Edit</button>\n                    <button onClick={() => deletePost(post.id)} style={{ backgroundColor: "transparent", color: "#F43F5E", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid #F43F5E30", cursor: "pointer" }}>Delete</button>'
);

// Update handlePublish to handle both create and edit
c = c.replace(
  '  async function handlePublish() {\n    if (!form.title || !form.content) { setError("Title and content are required."); return; }\n    setSaving(true);\n    setError("");\n    let coverImageUrl = null;\n    if (blogImage) {\n      const fileExt = blogImage.name.split(".").pop();\n      const fileName = "blog-" + Date.now() + "." + fileExt;\n      const { error: uploadError } = await supabase.storage.from("event-images").upload(fileName, blogImage);\n      if (uploadError) { setError("Image upload failed: " + uploadError.message); setSaving(false); return; }\n      const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(fileName);\n      coverImageUrl = urlData.publicUrl;\n    }\n    const { error: sbError } = await supabase.from("blog_posts").insert([{ title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content, category: form.category, cover_image: coverImageUrl, published: true }]);',
  '  async function handlePublish() {\n    if (!form.title || !form.content) { setError("Title and content are required."); return; }\n    setSaving(true);\n    setError("");\n    let coverImageUrl = editingPost ? form.cover_image : null;\n    if (blogImage) {\n      const fileExt = blogImage.name.split(".").pop();\n      const fileName = "blog-" + Date.now() + "." + fileExt;\n      const { error: uploadError } = await supabase.storage.from("event-images").upload(fileName, blogImage);\n      if (uploadError) { setError("Image upload failed: " + uploadError.message); setSaving(false); return; }\n      const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(fileName);\n      coverImageUrl = urlData.publicUrl;\n    }\n    let sbError = null;\n    if (editingPost) {\n      const { error } = await supabase.from("blog_posts").update({ title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content, category: form.category, cover_image: coverImageUrl }).eq("id", editingPost.id);\n      sbError = error;\n    } else {\n      const { error } = await supabase.from("blog_posts").insert([{ title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content, category: form.category, cover_image: coverImageUrl, published: true }]);\n      sbError = error;\n    }'
);

// Update success message and reset editingPost
c = c.replace(
  '      setForm({ title: "", slug: "", excerpt: "", content: "", category: "Opportunities", cover_image: "" });\n      setBlogImage(null);',
  '      setForm({ title: "", slug: "", excerpt: "", content: "", category: "Opportunities", cover_image: "" });\n      setBlogImage(null);\n      setEditingPost(null);'
);

// Update publish button label for edit mode
c = c.replace(
  '              {saving ? "Publishing..." : "Publish Blog Post →"}',
  '              {saving ? "Saving..." : editingPost ? "Save Changes →" : "Publish Blog Post →"}'
);

// Add cancel edit button
c = c.replace(
  '              {saving ? "Saving..." : editingPost ? "Save Changes →" : "Publish Blog Post →"}\n            </button>',
  '              {saving ? "Saving..." : editingPost ? "Save Changes →" : "Publish Blog Post →"}\n            </button>\n            {editingPost && (\n              <button onClick={() => { setEditingPost(null); setForm({ title: "", slug: "", excerpt: "", content: "", category: "Opportunities", cover_image: "" }); setView("list"); }} style={{ backgroundColor: "transparent", color: "#6B6B6B", fontWeight: 700, fontSize: "15px", padding: "16px", borderRadius: "12px", border: "1px solid #2A2A2A", cursor: "pointer" }}>Cancel</button>\n            )}'
);

// Update write tab title to show Edit or Write
c = c.replace(
  '          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>',
  '          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>'
);

fs.writeFileSync('app/admin/page.tsx', c);
console.log('Done!');