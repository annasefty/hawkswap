import React from 'react';
// import { Link } from 'react-router-dom';
import '../About.css';

const About = () => {
  return (
    <div className="about-container">
      {/* FAQ section */}
      <section className="faq-section">
        <div className="faq-shell-box">
          <h2>Frequently Asked Questions</h2>
          <ul>
            <li><strong>Q:</strong> Who can use Hawk Swap?<br /><strong>A:</strong> Any Lehigh student with a valid student email.</li>
            <li><strong>Q:</strong> What can I list on Hawk Swap?<br /><strong>A:</strong> Furniture, clothes, books, dorm decor, and more.</li>
            <li><strong>Q:</strong> Do I purchase the items through the website?<br /><strong>A:</strong> No, HawkSwap allows students to get in-contact with one another, in order to make transactions further down the line. The website itself is not built for online purchases</li>
          </ul>
        </div>
      </section>

      {/* About Me section (unchanged) */}
      <section>
        <div className="text-container">
          <p>I created Hawk Swap during the winter break of 2024. As a Computer Science and Business student at Lehigh University, I am constantly looking for ways to combine my technical skills with my passion for helping others. When leaving school after the fall semester, I noticed that many girls in my sorority were preparing to go abroad, and they had a lot of furniture, clothes, and other items they wanted to get rid of. I saw this as a perfect opportunity to create a solution that would not only help them declutter but also bring the Lehigh community closer together.</p>
          <p>With some free time on my hands during the break, I decided to use my skills in technology and my interest in business to build a platform that could connect Lehigh students with one another. Hawk Swap allows students to sell items they no longer need, creating an opportunity for sustainable practices while fostering a sense of community. Whether it's furniture, clothing, or even textbooks, Hawk Swap is designed to make it easier for students to find what they need and offer what they no longer use—ultimately helping each other out in a way that benefits everyone involved.</p>
          <p>Through Hawk Swap, I hope to bring a positive impact to campus life by encouraging recycling and reuse, reducing waste, and making life at Lehigh a little more convenient and connected for all students. My goal is to make Hawk Swap a trusted platform for Lehigh students, where they can find items they need while helping others in the process.</p>
          <p>- Anna Seftenberg</p>
          <p>aseftenberg@yahoo.com</p>
          <p>(224)-661-1585</p>
        </div>
        <img src="/images/AnnaS.jpg" alt="Anna Seftenberg" className="right-image" />
      </section>

      <footer>
        <p>&copy; Created by Anna Seftenberg. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default About;
