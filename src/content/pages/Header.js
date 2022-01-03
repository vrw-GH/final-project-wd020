import "./Header.css";

const Header = ({ APPDATA }) => {
  return (
    <div>
      <div className="header">
        <div className="headerTitles">
          <img className="headerImg" src={APPDATA.TITLEIMG} alt="header" />
          <span className="headerTitlesSm">{APPDATA.INFO}</span>

          <span className="headerTitlesLg">
            Welcome to
            <br />
            {APPDATA.NAME.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Header;
