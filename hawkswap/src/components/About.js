import React from "react";
import { useEffect } from "react";
import "../About.css";

const About = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when leaving About page
    };
  }, []);
  return (
    <div className="about-container">
      <section className="intro">
        <h1>About Hawk Swap</h1>
        <p>
          Hawk Swap is Lehigh’s student-to-student marketplace built to help you
          buy, sell, or trade dorm essentials, books, clothes, and more, safely
          and easily. Created by students, for students.
        </p>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-card">
          <h3>Who can use Hawk Swap?</h3>
          <p>Any Lehigh student with a valid student email.</p>
        </div>
        <div className="faq-card">
          <h3>What can I list on Hawk Swap?</h3>
          <p>Furniture, clothes, books, dorm decor, and more.</p>
        </div>
        <div className="faq-card">
          <h3>Do I purchase items through the website?</h3>
          <p>
            No, Hawk Swap allows students to get in contact with one another
            to arrange transactions directly. The site itself doesn’t handle payments.
          </p>
        </div>
      </section>
    </div>

  );
};

export default About;
