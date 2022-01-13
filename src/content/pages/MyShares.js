import { useState, useEffect } from "react";
import axios from "axios";
import "../../loading.css";
import "./_Page.css";

const MyShares = ({ APPDATA }) => {
  const currentUser = sessionStorage.getItem("currentUser");
  const [err, setErr] = useState(null);
  const [shareItems, setShareItems] = useState([]);
  const [info, setInfo] = useState({
    sharestatus: "",
    arrayofitems: [],
    message: "",
    location: "",
  });

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

  function handle(event) {
    event.preventDefault();
    const newInfo = { ...info };
    newInfo[event.target.id] = event.target.value;
    setInfo(newInfo);
    console.log(newInfo);
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      let arrayofItems = [];
      arrayofItems.push(info.arrayofitems);
      let sendInfo = {};

      if (info.sharestatus) {
        sendInfo.sharestatus = info.sharestatus;
      }
      if (info.message) {
        sendInfo.message = info.message;
      }
      if (arrayofItems) {
        sendInfo.arrayofitems = arrayofItems;
      }
      if (info.location) {
        sendInfo.location = info.location;
      }
      console.log(sendInfo);
      const post = await axios
        .post(
          `${APPDATA.BACKEND}/api/shareitems/${currentUser}`,
          sendInfo
          //   {
          //   username: info.username,
          //   arrayofitems: arrayofItems,
          //   sharestatus: info.sharestatus,
          //   message: info.message,
          //   location: "1,2"
          // }
        )
        .then((res) => console.log(res.data));
      console.log(post);
    } catch (error) {
      console.log(error);
      // setError("Created")
    }
  };

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
          <span>-‧≡ My Sharing ≡‧- </span>
        </h2>
      </div>
      <div
        className="page-box col-8"
        style={{
          width: "90%",
        }}
      >
        <div className="row">
          <div className="col-6">
            <form onSubmit={(e) => handleSubmit(e)} className="form">
              <h2 className="h22">My shared items</h2>
              <br />
              <input
                className="arrayOfItems"
                type="text"
                placeholder="arrayofitems"
                onChange={(event) => handle(event)}
                id="arrayofitems"
                value={info.arrayofitems}
              ></input>
              <br />
              <input
                className="category"
                type="text"
                placeholder="username"
                id="username"
                value={currentUser}
              ></input>
              <br />
              <input
                cols="40"
                rows="8"
                className="ingredients"
                type="text"
                placeholder="message"
                onChange={(event) => handle(event)}
                id="message"
                value={info.message}
              ></input>
              <br />
              <input
                type="text"
                placeholder="Share status"
                onChange={(event) => handle(event)}
                id="sharestatus"
                value={info.sharestatus}
              ></input>

              <button className="btns">Update</button>
            </form>
          </div>
          <div className="col-5">
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
      </div>
    </div>
  );
};
export default MyShares;
