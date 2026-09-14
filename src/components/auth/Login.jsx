import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import styles from "./Login.module.css";

// Demo accounts — these mirror the seeded `users` table in Supabase.
// All use password "password123" (see scripts/migrate.js).
const DEMO_ACCOUNTS = [
  { email: "john.doe@campus.edu",      role: "student" },
  { email: "sales@techstore.co.za",    role: "vendor"  },
  { email: "admin@campus.edu",         role: "admin"   },
  { email: "nomvula.k@campus.edu",     role: "faculty" },
  { email: "mike.vdm@campus.edu",      role: "resident"},
];

const DEMO_PASSWORD = "password123";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [demoLoading, setDemoLoading] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleDemoLogin = async (account) => {
    setError("");
    setDemoLoading(account.email);
    const result = await login(account.email, DEMO_PASSWORD);
    setDemoLoading(null);
    if (result.success) {
      navigate("/");
    } else {
      setError(`Demo login failed: ${result.error}`);
    }
  };

  return (
    <div className={styles.loginPage}>
      <Card title="Login to TrustHive" className={styles.loginCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Login
          </button>

          <p className={styles.registerLink}>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>

        <div className={styles.demoSection}>
          <div className={styles.demoDivider}>
            <span>Quick Demo Login</span>
          </div>
          <div className={styles.demoButtons}>
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => handleDemoLogin(account)}
                disabled={demoLoading !== null}
                className={`${styles.demoBtn} ${styles[`demoBtn_${account.role}`]}`}
              >
                {demoLoading === account.email
                  ? "Logging in…"
                  : `Login as ${account.role.charAt(0).toUpperCase() + account.role.slice(1)}`}
              </button>
            ))}
          </div>
          <p className={styles.demoHint}>
            All demo accounts use password: <code>{DEMO_PASSWORD}</code>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;