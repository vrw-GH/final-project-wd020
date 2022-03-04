import "./loading.css";

const Loading = ({ text }) => {
  return (
    <>
      <div className="loading_container">
        <div className="loading"></div>
        <h4 style={{ fontSize: "0.8rem" }}>{text}</h4>
      </div>
    </>
  );
};

export default Loading;
