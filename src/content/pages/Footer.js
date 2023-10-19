import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaDiscord,
  FaLinkedin,
} from "react-icons/fa/index.esm.js";
import { GoMail } from "react-icons/go/index.esm.js";
import "./Footer.css";
import footer from "../../media/footer.png";

const Footer = ({ APPDATA }) => {

  return (
    <>
      <div className="footer_container">
        <img className="footer_img" src={footer} alt="footer" />
        <ul className="footer-icons-ul">
          <li>
            <a
              className="footer-icons"
              href="https://www.facebook.com/abdullah.shabk"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook className="fa-icons" size="1.5em" />
            </a>
          </li>
          <li>
            <a
              className="footer-icons"
              href="https://vrw-gh.github.io/final-project-wd020"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub size="1.5em" />
            </a>
          </li>
          <li>
            <a
              className="footer-icons"
              href="https://www.instagram.com/a.shabk/"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram className="fa-icons" size="1.5em" />
            </a>
          </li>
          <li>
            <a
              className="footer-icons"
              href="https://www.linkedin.com/in/abdullah-al-shabk"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin className="fa-icons" size="1.5em" />
            </a>
          </li>
          <li>
            <a
              className="footer-icons"
              href="https://discord.gg/6rm4j2S2Qq"
              target="_blank"
              rel="noreferrer"
            >
              <FaDiscord className="fa-icons" size="1.5em" />
            </a>
          </li>
          <li>
            <a
              className="footer-icons"
              href={`mailto:${APPDATA.EMAIL}?subject=Inquiry:%20${APPDATA.PROJECT}
              &body=I%20am%20interested%20in%20your%20project!`}
              target="_blank"
              rel="noreferrer"
            >
              <GoMail className="fa-icons" size="1.5em" />
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Footer;
