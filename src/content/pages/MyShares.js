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
    let toEdit = { ...item };
    toEdit.arrayofitems = item.arrayofitems.toString();
    setSelectedInfo(toEdit);
    setFormIsShown(true);
  };

  const addItem = () => {
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
    submitInfo.location = `${userLoc.current.x},${userLoc.current.y}`;
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
        <div className="row" style={{ justifyContent: "center" }}>
          <button
            className="btns"
            onClick={addItem}
            style={{ width: "auto", backgroundColor: "lightgreen" }}
          >
            CREATE NEW SHARE
          </button>
          <div className="col-10" style={{ alignSelf: "center" }}>
            <form
              onSubmit={handleSubmit}
              className="form"
              hidden={!formIsShown}
              style={{ width: "auto" }}
            >
              <input
                type="text"
                id="arrayofitems"
                value={selectedInfo.arrayofitems}
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
                value={selectedInfo.message}
                required
                placeholder="Please enter a message"
                style={{ width: "100%" }}
                onChange={handleChange}
              ></input>
              <br />
              <select
                type="text"
                id="sharestatus"
                value={selectedInfo.sharestatus}
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
              <button className="btns">Update</button>
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
                        (each.bookedby
                          ? `Booked by: ${each.bookedby.toUpperCase()} - `
                          : "") + "click to edit"
                      }
                      style={{
                        backgroundColor:
                          each.sharestatus === "D" || each.sharestatus === "C"
                            ? "lightgrey"
                            : each.sharestatus === "B"
                            ? "limegreen"
                            : k2 % 2 === 0
                            ? "#ddf3fc"
                            : "#d4f7db",
                        textDecorationLine:
                          each.sharestatus === "D" ? "line-through" : "",
                        cursor: "pointer",
                        margin: "10px",
                      }}
                    >
                      {k2 + 1}. -{" "}
                      <strong style={{ color: "red" }}>{each.message}</strong>
                      <i style={{ fontSize: "0.8rem" }}>
                        &nbsp;** Status: {shareStatus[each.sharestatus]} **
                        Posted: {datify(each.datetime)}
                      </i>
                      <ul style={{ cursor: "pointer" }}>
                        {each.arrayofitems.map((item) => (
                          <li key={k2 + "-" + k++} style={{ padding: 0 }}>
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
