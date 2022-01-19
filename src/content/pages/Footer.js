import React from "react";
import { FaFacebook, FaGithub, FaInstagram, FaDiscord } from "react-icons/fa";
import {
  ModalProvider,
  Modal,
  useModal,
  ModalTransition,
} from "react-simple-hook-modal";
import "./Footer.css";
import footer from "../pages/footer.png";

const Footer = ({ APPDATA }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  return (
    <>
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
            onClick={openModal}
            style={{ cursor: "pointer" }}
            title="Opens a popup"
          >
            <small>
              <i> *** §Impressum ***</i>
            </small>
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
      <ModalProvider>
        <Modal
          id="any-unique-identifier"
          isOpen={isModalOpen}
          transition={ModalTransition.BOTTOM_UP}
        >
          <div className="page-box col" onClick={closeModal}>
            <span>
              <i>§ Impressum</i>
              <br />
              <br />
              <pre>
                <h2>Share My Food</h2>
                <br />
                <h5>Address:</h5>
                <p>{APPDATA.LOCATION}</p>
                <br />
                <h5>Contact:</h5>
                <p>
                  Contact: {APPDATA.PHONE}
                  <br />
                  Email: {APPDATA.EMAIL}
                  <br />
                  website: {APPDATA.FRONTEND}
                </p>
              </pre>
            </span>
          </div>
        </Modal>
      </ModalProvider>
    </>
  );
};

export default Footer;
