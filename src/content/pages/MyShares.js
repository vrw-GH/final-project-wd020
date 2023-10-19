import { useState, useEffect, useRef } from "react";
import { datify } from "../../components/formatting.js";
import Loading from "../../components/Loading.js";
import PageTitle from "../../components/PageTitle.js";
import {
  getShareitems,
  setShareitems,
  getUser,
} from "../../components/dataHandling.js";
import "./_General.css";
import "./MyShares.css";

const MyShares = ({ APPDATA }) => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [err, setErr] = useState(null);
  const [shareItems, setShareItems] = useState([]);
  const [formIsShown, setFormIsShown] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState({});
  const [getData, setGetData] = useState(true);
  const [shareMessages, setShareMessages] = useState([]);
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
        (async () => {
          try {
            const results1 = await getUser(currentUser.userName);
            userPLZ.current = results1.plz;
            userLoc.current = results1.location;
            try {
              let results = await getShareitems(currentUser.userName);
              if (results) {
                if (APPDATA.MODE.substring(0, 3).toUpperCase() !== "DEV") {
                  results = results.filter((e) => e.sharestatus !== "D");
                }
                let sorted = results;
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
              window.scrollTo(0, 0);
            } catch (error) {
              if (!error.response.data.info.result === false) {
                setErr(error.message);
              } else {
                // just go on - there are no tuple for this user
              }
            }
          } catch (error) {
            setErr("No data");
          }
        })();
        setGetData(false);
      }
    }
    return () => {
      setGetData(false); //  avoids a mem leak on unloaded component
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
    window.scrollTo(0, 0);
  };

  const addItem = () => {
    if (!userPLZ || !userLoc.current) {
      alert("Please update PLZ/Location in your Profile");
      return;
    }
    const newInfo = {
      username: currentUser.userName,
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
    let postAPI = selectedInfo.id
      ? `/${currentUser.userName}/${selectedInfo.id}`
      : "";
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
      await setShareitems(postAPI, submitInfo);
      setFormIsShown(false);
      setGetData(true);
    } catch (error) {
      setErr("Post" + error.message);
    }
  };

  let k = 0;
  let k2 = 0;

  return (
    <div className="page-container">
      <PageTitle titleText="My Sharing" />
      {currentUser ? (
        <div>
          <button className="btn U-btn" onClick={addItem}>
            Create a New Share
          </button>
        </div>
      ) : null}
      <div
        className="page-box col-8"
        style={{
          width: "90%",
        }}
      >
        {err ? (
          <Loading text={err} />
        ) : (
          <>
            Your New Messages:
            {shareMessages.map((i) =>
              !i[2] ? (
                <div
                  key={k++}
                  style={{
                    backgroundColor: "lightblue",
                    borderRadius: "25px 20px 0px 30px",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{i[1]}</span> -{" "}
                  <i>
                    from {i[0]}, (Re: {i[3]})
                  </i>
                </div>
              ) : null
            )}
            <hr />
            <div className="row" style={{ justifyContent: "center" }}>
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
                        {selectedInfo.messages &&
                          !selectedInfo.messages.read ? (
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
              <div
                className="row"
                style={{ height: "50vh", overflowY: "auto" }}
              >
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
                            each.sharestatus === "D" ||
                              each.sharestatus === "C"
                              ? "#e0e0e0"
                              : each.sharestatus === "B"
                                ? "#f3eea4"
                                : "#d3ffe0",
                          textDecorationLine:
                            each.sharestatus === "D" ? "line-through" : "",
                          cursor: "pointer",
                          margin: "10px",
                          borderRadius: "0px 15px 25px 20px",
                          padding: "10px",
                        }}
                      >
                        {k2 + 1}. -{" "}
                        <strong
                          style={{ color: "black", fontWeight: "1000" }}
                        >
                          {each.message}
                        </strong>
                        <i style={{ fontSize: "0.8rem" }}>
                          &nbsp;** Status: {shareStatus[each.sharestatus]} **
                          Posted: {datify(each.datetime)}
                        </i>
                        <ul style={{ cursor: "pointer" }}>
                          {each.arrayofitems.map((item) => (
                            <li
                              key={k2 + "-" + k++}
                              style={{ padding: 0, color: "gray" }}
                            >
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
          </>
        )}
      </div>
    </div>
  );
};
export default MyShares;
