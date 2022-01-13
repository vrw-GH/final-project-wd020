import React from "react";
// eslint-disable-next-line
import { FaFacebook, FaGithub, FaInstagram, FaDiscord } from "react-icons/fa";
import "./Footer.css";
import footer from "../pages/footer.jpg"

const Footer = ({ APPDATA }) => {
  return (
    <div className="footer_container">
      <img className="ftImg" src={footer} alt="footer" />

      {/* <ul className="ul1">
        <li>
          {APPDATA.PROJECT.toUpperCase()}{" "}
          <i>
            ver: {APPDATA.VER} <small> - {APPDATA.FLIGHT}</small>
          </i>
        </li>
        <li>
          <small>{APPDATA.DESCRIPTION}</small>
        </li>
        <li>
          Hosted:{" "}
          <a href={APPDATA.FRONTEND} target="_blank" rel="noreferrer">
            {APPDATA.FRONTEND}
          </a>
        </li>
        <li>
          Backend:{" "}
          <a href={APPDATA.BACKEND} target="_blank" rel="noreferrer">
            {APPDATA.BACKEND}
          </a>
        </li>
      </ul>
      */}
      <ul className="ul2">
        <li>Development Team: {APPDATA.DEVTEAM}</li>
        <li>
          <small>Course Instructor: {APPDATA.DEVLEAD}</small>
        </li>
        <li>
          Contact:{" "}
          <a
            href={`mailto:${APPDATA.EMAIL}?subject=Inquiry:%20${APPDATA.PROJECT}
&body=I%20am%20interested%20in%20your%20project!`}
          >
            {APPDATA.EMAIL}
          </a>
        </li>
        <li>Phone: {APPDATA.PHONE}</li>
        <li>{APPDATA.LOCATION}</li>
      </ul> 
      <ul className="ul3">
       <li>
        <a href="https://www.facebook.com/abdullah.shabk">
          <FaFacebook size="2.5em" />
        </a>
        </li>
        <li>
        <a href="https://github.com/vrw-GH/final-project-wd020">
          <FaGithub size="2.5em" />
        </a>
        </li>
        <li>
        <a href="https://www.instagram.com/a.shabk/">
          <FaInstagram size="2.5em" />
        </a>
        </li>
        <li>
        <a href="https://www.facebook.com/abdullah.shabk">
          <FaDiscord size="2.5em" />
        </a>
        </li>
      </ul>
      
    </div>
    
  );
};

export default Footer;
