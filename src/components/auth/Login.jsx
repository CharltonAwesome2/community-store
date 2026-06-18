import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  return (
    <div className={styles.loginPage}>
      <Card title="Login to Community Store" className={styles.loginCard}>
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
      </Card>
    </div>
  );
};

export default Login;