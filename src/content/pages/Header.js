import "./Header.css";

const Header = ({ APPDATA }) => {
  return (
    <div>
      <div className="header">
        <div className="headerTitles">
          <span className="headerTitlesLg">{APPDATA.NAME.toUpperCase()}</span>
          <span className="headerTitlesSm">
            Keep your best recipes handy whenever you need them
          </span>

          <img className="headerImg" src={APPDATA.TITLEIMG} alt="header" />
        </div>
      </div>
    </div>
  );
};
export default Header;
