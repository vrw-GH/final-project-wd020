import { useState } from "react";
import PageTitle from "../../components/PageTitle.js";
import "./_General.css";
import "./About.css";

const About = ({ APPDATA }) => {
  const [showImp, setShowImp] = useState(false);

  const toggleImp = () => {
    setShowImp(!showImp);
    setTimeout(() => {
      setShowImp(false);
    }, 10000);
  };

  return (
    <div className="page-container">
      <PageTitle titleText="About" />
      <div className="page-box col-5" style={{ width: "70%" }}>
        <ul className="ul1" style={{ overflowX: "auto" }}>
          <li>
            <h2 >Share My Food</h2>
            <h5 >§Impressum:</h5>
            <p>{APPDATA.LOCATION}</p>
            <h5 >Contact:</h5>
            <p>
              Contact: <a
                href={`tel:${APPDATA.PHONE}`}
              >
                {APPDATA.PHONE}
              </a>
              <br />
              Email: <a
                href={`mailto:${APPDATA.EMAIL}?subject=Inquiry:%20${APPDATA.PROJECT}
&body=I%20am%20interested%20in%20your%20project!`}
              >
                {APPDATA.EMAIL}
              </a>
              <br />
              website: <a href={`${APPDATA.FRONTEND}`} target="_blank" rel="noreferrer">{APPDATA.FRONTEND}</a>
            </p>
          </li>

          <li
            onClick={toggleImp}
            style={{ cursor: "pointer" }}
            title="Opens a popup"
          >
            <small style={{ display: !showImp ? "" : "none", cursor: "help" }}>
              <strong title="Click here">App Development ...</strong>
              <p>{" "}</p>
            </small>

            <span
              style={{ display: showImp ? "" : "none" }}
              title="click to hide"
              onClick={() => setShowImp(false)}
            >
              <u>
                <strong>App Development</strong>
              </u>
              <ul>
                <li>Team: {APPDATA.DEVTEAM}</li>
                <li>
                  <small>Instructor: {APPDATA.DEVLEAD}</small>
                </li>
                <li title="Link opens your email app">
                  Contact: <a
                    href={`mailto:${APPDATA.EMAIL}?subject=Inquiry:%20${APPDATA.PROJECT}
&body=I%20am%20interested%20in%20your%20project!`}
                  >
                    {APPDATA.EMAIL}
                  </a>
                </li>

                {APPDATA.PHONE ? <li>Phone: <a href={`Tel:${APPDATA.PHONE}`}>{APPDATA.PHONE}</a></li> : null}
                {APPDATA.LOCATION ? <li>{APPDATA.LOCATION}</li> : null}
              </ul>
            </span>
          </li>
        </ul>
      </div>
    </div >
  );
};

export default About;
