import { useState, useEffect } from "react";
import axios from "axios";
import "../../loading.css";
import "./_Page.css";

const MyShares = ({ APPDATA }) => {
  const currentUser = sessionStorage.getItem("currentUser");
  const [err, setErr] = useState(null);
  const [shareItems, setShareItems] = useState([]);

  useEffect(() => {
    let isLoaded = true;
    if (currentUser) {
      if (isLoaded) {
        const getShareItems = async () => {
          try {
            const results = await axios.get(
              `${APPDATA.BACKEND}/api/shareitems/${currentUser}`
            );
            if (!results.data.tuple) throw new Error("No Sharing Data.");
            setShareItems(results.data.tuple[0]);
          } catch (error) {
            setErr(error.message);
          }
        };
        getShareItems();
      }
    }
    return () => {
      isLoaded = false; //           avoids a mem leak (of the promise) on unloaded component
    };
    // eslint-disable-next-line
  }, []);

  if (err)
    return (
      <div className="loading_container">
        <div className="loading"></div>
        <h4 style={{ fontSize: "0.8rem" }}>{err}</h4>
      </div>
    );

  // let k = 0;
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
        Posted: <b>{Date(shareItems.datetime)}</b>
        <br />
        Message: <b>{shareItems.message}</b>
        <br />
        Status: <b>{shareItems.sharestatus}</b>
        <br />
        Items:<b>{shareItems.arrayofitems}</b>
        {/* {shareItems.arrayofitems.map((item) => (
          <div key={k++}>{item}</div>
        ))} */}
      </div>
    </div>
  );
};
export default MyShares;
