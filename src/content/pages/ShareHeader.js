import "./Header.css";

const ShareHeader = ({ APPDATA }) => {
  return (
    <div>
      <div className="header">
        <div className="headerTitles">
          <img className="headerImg" src={APPDATA.TITLEIMG} alt="header" />
          <span className="headerTitlesSm">Share List</span>
        </div>
      </div>
    </div>
  );
};
export default ShareHeader;
