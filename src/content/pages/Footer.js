import React, { useState } from "react";
import { FaFacebook, FaGithub, FaInstagram, FaDiscord } from "react-icons/fa";
import "./Footer.css";
import footer from "../pages/footer.png";
// import footer1 from "../pages/footer1.jpg";

const Footer = ({ APPDATA }) => {
  const [showImp, setShowImp] = useState(false);

  const toggleImp = () => {
    setShowImp(!showImp);
    setTimeout(() => {
      setShowImp(false);
    }, 10000);
  };

  return (
    <>
      <div className="footer_container">
        <img className="ftImg" src={footer} alt="footer" />
        <ul className="ul2">
          <li>Development Team: {APPDATA.DEVTEAM}</li>
          <li>
            <small>Course Instructor: {APPDATA.DEVLEAD}</small>
          </li>
          <li title="Link opens your email app">
            Contact:{" "}
            <a
              href={`mailto:${APPDATA.EMAIL}?subject=Inquiry:%20${APPDATA.PROJECT}
&body=I%20am%20interested%20in%20your%20project!`}
            >
              {APPDATA.EMAIL}
            </a>
          </li>
          {APPDATA.PHONE ? <li>Phone: {APPDATA.PHONE}</li> : null}
          {APPDATA.LOCATION ? <li>{APPDATA.LOCATION}</li> : null}
          <li
            onClick={toggleImp}
            style={{ cursor: "pointer" }}
            title="Opens a popup"
          >
            <small style={{ display: !showImp ? "" : "none" }}>
              <i>§Impressum</i>
            </small>
            <span
              style={{ display: showImp ? "" : "none", color: "white" }}
              title="click to hide"
              // onClick={() => setShowImp(false)}
            >
              <u>
                <strong>§Impressum</strong>
              </u>
              <br />
              <br />
              <h2 style={{ color: "white" }}>Share My Food</h2>
              <br />
              <h5 style={{ color: "white" }}>Address:</h5>
              <p>{APPDATA.LOCATION}</p>
              <br />
              <h5 style={{ color: "white" }}>Contact:</h5>
              <p>
                Contact: {APPDATA.PHONE}
                <br />
                Email: {APPDATA.EMAIL}
                <br />
                website: {APPDATA.FRONTEND}
              </p>
            </span>
          </li>
        </ul>
        <ul className="ul3">
          <li>
            <a
              href="https://www.facebook.com/abdullah.shabk"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook size="2.5em" />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/vrw-GH/final-project-wd020"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub size="2.5em" />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/a.shabk/"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram size="2.5em" />
            </a>
          </li>
          <li>
            <a
              href="https://discord.gg/6rm4j2S2Qq"
              target="_blank"
              rel="noreferrer"
            >
              <FaDiscord size="2.5em" />
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Footer;
