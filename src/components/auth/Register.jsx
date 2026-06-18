import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import { userRoles } from "@data/categories";
import styles from "./Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    businessName: "",
    businessRegistration: "",
  });
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate student email
    if (formData.role === "student" && !formData.email.endsWith("@cput.ac.za")) {
      setError("Students must use @cput.ac.za email address");
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className={styles.registerPage}>
      <Card title="Create Account" className={styles.registerCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder={formData.role === "student" ? "yourname@cput.ac.za" : "your@email.com"}
            />
            {formData.role === "student" && (
              <small className={styles.hint}>Must use @cput.ac.za email</small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Role *</label>
            <select
              required
              value={formData.role}
              onChange={(e) => {
                setFormData({...formData, role: e.target.value});
              }}
            >
              <option value="student">Student</option>
              <option value="vendor">Vendor</option>
              <option value="faculty">Faculty</option>
              <option value="resident">Resident</option>
            </select>
          </div>

          {formData.role === "vendor" && (
            <>
              <div className={styles.formGroup}>
                <label>Business Name *</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Business Registration Number *</label>
                <input
                  type="text"
                  required
                  value={formData.businessRegistration}
                  onChange={(e) => setFormData({...formData, businessRegistration: e.target.value})}
                />
              </div>
            </>
          )}

          <button type="submit" className={styles.submitBtn}>
            Register
          </button>

          <p className={styles.loginLink}>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Register;