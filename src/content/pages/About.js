import "./_Page.css";

const About = ({ APPDATA }) => {
  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
      }}
    >
      <div className="page-title">
        <h2>
          <span>-·≡ {APPDATA.INFO} ≡·-</span>
        </h2>
      </div>
      <div className="page-box col-8">
        <span className="page-title-sm">About Us</span>
        <br />
        <span className="page-title-lg">{APPDATA.NAME.toUpperCase()}</span>
      </div>
    </div>
  );
};
export default About;
