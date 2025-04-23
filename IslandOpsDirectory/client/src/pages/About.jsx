import { Link } from 'react-router-dom';
import islandImage from '../assets/island.png';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      {/* nav bar */}
      <nav className="nav-bar">
        <div className="logo">IslandOps</div>
        <div className="nav-links">
          <Link to="/">home</Link>
          <Link to="/contact">contact</Link>
          <Link to="/login">login</Link>
        </div>
      </nav>

      <div className="about-content">
        {/* left section */}
        <div className="left-section">
          <h1 className="welcome-text">about us.</h1>
          <p className="about-text">Our island story.</p>
          <img src={islandImage} alt="Island" className="island-image" />
        </div>

        {/* right section */}
        <div className="right-section">
          <div className="about-info">
            <h2>Our Mission</h2>
            <p>
              At IslandOps, we're dedicated to providing users with an
              exceptional task and time management application, with a wide 
              variety of features to help you stay on track.
            </p>

            <div className="info-section">
              <h3>Who We Are</h3>
              <p>
                We are a group of four students, who have come together with
                the goal of developing an application that can help its users
                not only keep track of their tasks, and better manage their time,
                but also make them feel rewarded at the same time.
              </p>
            </div>

            <div className="info-section">
              <h3>What does our app do that others don't?</h3>
              <p>
                Our Application has a multitude of features that you don't see in
                most other task management applications. We have incorperated 
                useful tools, such as a pomodoro timer, energy level system, and
                an interactive kanban board with difficulty level settings. On top
                of these we have also created a system that can be used to track a 
                user's progress in completing their tasks, and provide them with 
                points that will help them to move to the next stage of their 
                island's progression.
              </p>
            </div>

            <div className="info-section">
              <h3>Island progression system</h3>
              <p>
                Our most innovative feature is our island progression system. As 
                users complete tasks, points will be added towards their progression
                to the next stage of their islands growth based on the difficulty of 
                the task completed. This advancement will then be shown as the island
                is gradually filled with foliage, houses, and more! This serves to keep
                users motivated to continue completing their tasks, and serves as a
                visual aid to assessing the progress they've made thus far.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;