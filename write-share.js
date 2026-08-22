const fs = require('fs');

const eyeToggle = `
  const [showPassword, setShowPassword] = useState(false);
`;

const passwordField = `
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#111",
                    border: "1px solid #2A2A2A",
                    borderRadius: "10px",
                    padding: "12px 48px 12px 16px",
                    color: "#E8E8E8",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#6B6B6B",
                    fontSize: "16px",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>`;

// Fix Login page
let login = fs.readFileSync('app/auth/login/page.tsx', 'utf8');

// Add showPassword state
login = login.replace(
  '  const [password, setPassword] = useState("");',
  '  const [password, setPassword] = useState("");\n  const [showPassword, setShowPassword] = useState(false);'
);

// Replace password input
login = login.replace(
  `              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#111",
                  border: "1px solid #2A2A2A",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  color: "#E8E8E8",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />`,
  passwordField
);

fs.writeFileSync('app/auth/login/page.tsx', login);
console.log(login.includes('showPassword') ? 'Login updated!' : 'Login FAILED');

// Fix Signup page
let signup = fs.readFileSync('app/auth/signup/page.tsx', 'utf8');

signup = signup.replace(
  '  const [password, setPassword] = useState("");',
  '  const [password, setPassword] = useState("");\n  const [showPassword, setShowPassword] = useState(false);'
);

signup = signup.replace(
  `              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#111",
                  border: "1px solid #2A2A2A",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  color: "#E8E8E8",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />`,
  passwordField
);

fs.writeFileSync('app/auth/signup/page.tsx', signup);
console.log(signup.includes('showPassword') ? 'Signup updated!' : 'Signup FAILED');