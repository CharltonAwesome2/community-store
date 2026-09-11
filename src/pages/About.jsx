import React from "react";
import Card from "@components/common/Card";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <h1>About TrustHive</h1>
      
      <Card title="Our Mission">
        <p>
          TrustHive is a campus marketplace platform designed to connect students, 
          faculty, local vendors, and residents in a trusted community ecosystem.
        </p>
      </Card>

      <div className={styles.grid}>
        <Card title="🌍 Community Driven">
          <p>
            Built for and by the campus community, fostering connections and sustainable trading.
          </p>
        </Card>
        <Card title="🔒 Trust & Safety">
          <p>
            Verified users, ratings and reviews, and secure transactions ensure a safe marketplace.
          </p>
        </Card>
        <Card title="💚 Sustainability">
          <p>
            Encouraging second-hand trading, reducing waste, and promoting affordable access to goods.
          </p>
        </Card>
        <Card title="🎓 Academic Project">
          <p>
            Developed as part of CPUT's Project Management 3 course by Group 33.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default About;