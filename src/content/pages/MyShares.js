import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { datify } from "../../components/formatting";
import "../../loading.css";
import "./_Page.css";

const MyShares = ({ APPDATA }) => {
  const currentUser = sessionStorage.getItem("currentUser");
  const [err, setErr] = useState(null);
  const [shareItems, setShareItems] = useState([]);
  const [formIsShown, setFormIsShown] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState({});
  const [getData, setGetData] = useState(true);
  const [shareMessages, setShareMessages] = useState([]);
  // const [unread, setUnread] = useState(false);
  const shareStatus = { A: "Active", B: "Reserved", C: "Closed", D: "Deleted" };
  const shareExplain = {
    A: "This share is available for collection.",
    B: " has reserved this item.",
    C: "Item is not avaliable anymore.",
    D: "Item will be removed from listing.",
  };
  const userPLZ = useRef("");
  const userLoc = useRef("");

  useEffect(() => {
    if (currentUser) {
      if (getData) {
        const getShareItems = async () => {
          try {
            const results1 = await axios.get(
              `${APPDATA.BACKEND}/api/users/${currentUser}`
            );
            if (!results1.data.tuple) throw new Error("No User Data.");
            userPLZ.current = results1.data.tuple[0].plz;
            userLoc.current = results1.data.tuple[0].location;
            const results = await axios.get(
              `${APPDATA.BACKEND}/api/shareitems/${currentUser}`
            );
            // if (!results.data.tuple) throw new Error("No Sharing Data.");
            if (results.data.tuples) {
              // let sorted = JSON.parse(JSON.stringify(results.data.tuples));
              let sorted = results.data.tuples;
              sorted.sort((a, b) => {
                if (a.sharestatus === "B") return -1;
                if (a.sharestatus < b.sharestatus) return 1;
                if (a.sharestatus === b.sharestatus && a.datetime > b.datetime)
                  return -1;
                return 0;
              });
              setShareItems(sorted);
              let tArr = [];
              for (let index = 0; index < sorted.length; index++) {
                if (sorted[index].messages) {
                  tArr.push([
                    sorted[index].bookedby,
                    sorted[index].messages.msg,
                    sorted[index].messages.read,
                    sorted[index].arrayofitems,
                  ]);
                }
              }
              setShareMessages(tArr);
            }
          } catch (error) {
            if (!error.response.data.info.result === false) {
              setErr(error.message);
            } else {
              // ! go on - asummes no tuple for this user
            }
          }
        };
        getShareItems();
        setGetData(false);
      }
    }
    return () => {
      setGetData(false); //  avoids a mem leak (of the promise) on unloaded component
    };
    // eslint-disable-next-line
  }, [getData]);

  const handleChange = (event) => {
    event.preventDefault();
    const newInfo = { ...selectedInfo };
    newInfo[event.target.id] = event.target.value;
    setSelectedInfo(newInfo);
  };

  const editItem = (item) => {
    if (!userPLZ || !userLoc.current) {
      alert("Please update PLZ/Location in your Profile");
      return;
    }
    let toEdit = { ...item };
    toEdit.arrayofitems = item.arrayofitems.toString();
    setSelectedInfo(toEdit);
    setFormIsShown(true);
  };

  const addItem = () => {
    if (!userPLZ || !userLoc.current) {
      alert("Please update PLZ/Location in your Profile");
      return;
    }
    const newInfo = {
      username: currentUser,
      sharestatus: "A",
      arrayofitems: "",
      message: "",
      location: `${userLoc.current.x},${userLoc.current.y}`,
      plz: userPLZ.current.trim(),
      bookedby: "",
    };
    setSelectedInfo(newInfo);
    setFormIsShown(true);
  };

  const setRead = (e) => {
    e.preventDefault();
    const newInfo = { ...selectedInfo };
    newInfo.messages.read = true;
    setSelectedInfo(newInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let submitInfo = { ...selectedInfo };
    let postAPI = selectedInfo.id ? `/${currentUser}/${selectedInfo.id}` : "";
    if (selectedInfo.id) {
      // existing item (EDIT)
      delete submitInfo.id;
      delete submitInfo.username;
    } else {
    }
    delete submitInfo.datetime;
    submitInfo.arrayofitems = submitInfo.arrayofitems
      .replace(/, /g, ",")
      .split(",");
    submitInfo.location = `${userLoc.current.y},${userLoc.current.x}`;
    if (submitInfo.sharestatus !== "B") submitInfo.bookedby = "";
    submitInfo.plz = submitInfo.plz.trim();
    submitInfo.message = submitInfo.message.trim();
    try {
      const post = await axios.post(
        `${APPDATA.BACKEND}/api/shareitems${postAPI}`,
        submitInfo
      );
      if (!post) {
        throw Error(`Update Un-successfull!`);
      }
      setFormIsShown(false);
      setGetData(true);
    } catch (error) {
      console.log(error.message);
      setErr("Post" + error.message);
    }
  };

  // const popMessages = (messages) => {
  //   if (!messages) return "";
  //   console.log(messages);
  //   let msgHist = "sdfsdfsdsd";
  //   return msgHist;
  // };

  if (err)
    return (
      <div className="loading_container">
        <div className="loading"></div>
        <h4 style={{ fontSize: "0.8rem" }}>{err}</h4>
      </div>
    );

  let k = 0;
  let k2 = 0;
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
        New Messages:
        {shareMessages.map((i) =>
          !i[2] ? (
            <div key={k++} style={{ backgroundColor: "lightblue", borderRadius:"25px 20px 0px 30px",
            padding: "10px", marginTop:"10px" }}>
              <span style={{ fontSize: "1.2rem" }}>{i[1]}</span> -{" "}
              <i>
                from {i[0]}, (Re: {i[3]})
              </i>
            </div>
          ) : null
        )}
        <hr />
        <div className="row" style={{ justifyContent: "center" }}>
          <button
            className="btns"
            onClick={addItem}
            style={{ width: "auto",height: "auto",margin:"21px", backgroundColor: "#FCD8D4", borderRadius:"20px"}}
          >
            CREATE NEW SHARE
          </button>
          <div className="col-10" style={{ alignSelf: "center" }}>
            <form
              onSubmit={handleSubmit}
              className="form-share"
              hidden={!formIsShown}
              style={{ width: "auto" }}
            >
              <input
                type="text"
                id="arrayofitems"
                value={selectedInfo.arrayofitems || ""}
                required
                autoFocus
                placeholder="Items to Share"
                style={{ width: "100%" }}
                onChange={handleChange}
              ></input>
              <br />
              <input
                type="text"
                id="message"
                value={selectedInfo.message || ""}
                required
                placeholder="Please enter a message"
                style={{ width: "100%" }}
                onChange={handleChange}
              ></input>
              <br />
              <select
                type="text"
                id="sharestatus"
                value={selectedInfo.sharestatus || "A"}
                required
                placeholder="Share Status"
                onChange={handleChange}
              >
                {Object.keys(shareStatus).map((opt) => (
                  <option key={k++} value={opt}>
                    {shareStatus[opt]}
                  </option>
                ))}
              </select>
              {selectedInfo.sharestatus === "B"
                ? selectedInfo.bookedby
                  ? selectedInfo.bookedby.toUpperCase()
                  : "Someone"
                : ""}
              {shareExplain[selectedInfo.sharestatus]}
              <br />
              {selectedInfo.sharestatus === "B" ? (
                <>
                  <div>
                    {"Message: "}{" "}
                    <b style={{ backgroundColor: "" }}>
                      {selectedInfo.messages?.msg}
                    </b>
                    &nbsp;&nbsp;&nbsp;
                    {selectedInfo.messages && !selectedInfo.messages.read ? (
                      <input
                        type="button"
                        placeholder="Mark as read"
                        value="I have seen this ✅"
                        title="Click here to acknowledge this message."
                        onClick={setRead}
                      ></input>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : null}
              <button className="btn U-btn">Update</button>
            </form>
          </div>
          <div className="row" style={{ height: "50vh", overflowY: "auto" }}>
            {shareItems.length === 0
              ? "There are no shared items .. yet"
              : null}
            <ol>
              {shareItems.length === 0
                ? null
                : shareItems.map((each) => (
                    // <>
                    <li
                      onClick={() => editItem(each)}
                      key={k2++}
                      title={
                        "click to edit" +
                        (each.bookedby
                          ? "\nBooked by: " + each.bookedby.toUpperCase()
                          : "") +
                        (each.messages?.msg
                          ? "\nMessages: - " + each.messages.msg
                          : "")
                      }
                      style={{
                        backgroundColor:
                          each.sharestatus === "D" || each.sharestatus === "C"
                            ? "#e0e0e0"
                            : each.sharestatus === "B"
                            ? "#f3eea4"
                            : "#73e686",
                        textDecorationLine:
                          each.sharestatus === "D" ? "line-through" : "",
                        cursor: "pointer",
                        margin: "10px",
                        borderRadius:"0px 15px 25px 20px",
                        padding: "10px"
                      }}
                    >
                      {k2 + 1}. -{" "}
                      <strong style={{ color: "black", fontWeight:"1000" }}>{each.message}</strong>
                      <i style={{ fontSize: "0.8rem" }}>
                        &nbsp;** Status: {shareStatus[each.sharestatus]} **
                        Posted: {datify(each.datetime)}
                      </i>
                      <ul style={{ cursor: "pointer" }}>
                        {each.arrayofitems.map((item) => (
                          <li key={k2 + "-" + k++} style={{ padding: 0, color:"gray" }}>
                            <strong>{item}</strong>
                          </li>
                        ))}
                      </ul>
                    </li>
                    // </>
                  ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyShares;
