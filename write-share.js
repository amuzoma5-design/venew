const fs = require('fs');

// Fix blog post page
let c = fs.readFileSync('app/blog/[slug]/page.tsx', 'utf8');
c = c.replace(
  'import BlogShareButtons from "@/components/BlogShareButtons";',
  'import BlogShareButtons from "@/components/BlogShareButtons";\nimport BlogViewTracker from "@/components/BlogViewTracker";'
);
c = c.replace(
  '      <Navbar />',
  '      <Navbar />\n      <BlogViewTracker postId={post.id} />'
);
fs.writeFileSync('app/blog/[slug]/page.tsx', c);
console.log(c.includes('BlogViewTracker') ? 'Blog page updated!' : 'FAILED');

// Fix admin page
let a = fs.readFileSync('app/admin/page.tsx', 'utf8');
a = a.replace(
  '                    <p style={{ color: "#6B6B6B", fontSize: "12px" }}>{new Date(post.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</p>',
  '                    <p style={{ color: "#6B6B6B", fontSize: "12px" }}>{new Date(post.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</p>\n                    <p style={{ color: "#A78BFA", fontSize: "12px", marginTop: "4px" }}>👁️ {post.views || 0} views</p>'
);
fs.writeFileSync('app/admin/page.tsx', a);
console.log(a.includes('post.views') ? 'Admin page updated!' : 'FAILED');