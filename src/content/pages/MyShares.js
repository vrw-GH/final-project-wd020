import "./_Page.css";

const MyShares = ({ APPDATA }) => {
  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
      }}
    >
      <div className="page-title">
        <h2>
          <span>-·≡ My Sharing ≡·- </span>
        </h2>
      </div>
      <div
        className="page-box col-8"
        style={{
          width: "90%",
        }}
      >
        something here
      </div>
    </div>
  );
};
export default MyShares;
