import React from "react";
import styles from "./Card.module.css";

const Card = ({ 
  title, 
  children, 
  variant = "default", 
  headerRight, 
  className = "" 
}) => {
  return (
    <section className={`${styles.card} ${styles[variant]} ${className}`}>
      {title && (
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {headerRight && <div className={styles.cardActions}>{headerRight}</div>}
        </div>
      )}
      <div className={styles.cardBody}>{children}</div>
    </section>
  );
};

export default Card;