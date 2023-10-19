import { useNavigate } from "react-router-dom";
import { useMount, useUnmount } from "react-use";
import "./loading.css";

const Loading = ({ text = "Please wait...", where = 0, timeout = 0 }) => {
  // where = isNaN(where) ? Number.where : where;
  const navigate = useNavigate()
  let timer1;

  useMount(() => {
    if (timeout !== 0) {
      timer1 = setTimeout(() => {
        return navigate(where);
      }, timeout * 1000);
    };
  });
  useUnmount(() => { clearTimeout(timer1) });

  const doOnClick = () => {
    navigate(where);
  }


  return (
    <>
      <div
        className="page-box col-8 loading_container"
        title="Click to close"
        onClick={doOnClick}
      >
        <div className="loading">
        </div>
        <p>{text}</p>
      </div>
    </>
  );
};

export default Loading;
