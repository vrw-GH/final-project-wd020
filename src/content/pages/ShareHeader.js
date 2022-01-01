import "./ShareHeader.css";

const ShareHeader = ({ APPDATA }) => {
  return (
    <div>
      <div className="shareheader">
        <div className="shareheaderTitles">
          <img className="shareheaderImg" src={APPDATA.TITLEIMG} alt="header" />
          <span className="shareheaderTitlesSm">Share List</span>
        </div>
      </div>
    </div>
  );
};
export default ShareHeader;
