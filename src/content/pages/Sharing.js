import React, { useState, useEffect } from "react";
import axios from "axios";
import { datify } from "../../components/formatting";
import MapChart from "../../components/MapChart";
import "./_Page.css";

//------------------------------------------------------------------------------------
const Sharing = ({ APPDATA }) => {
  const currentUser = sessionStorage.getItem("currentUser");
  const [getData, setGetData] = useState(true);
  const [err, setErr] = useState("");
  const [modal, setModal] = useState("");
  const [shareItems, setShareItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [filterPLZ, setFilterPLZ] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [listPLZ, setListPLZ] = useState([]);
  const shareStatus = { A: "Active", B: "Reserved", C: "Closed", D: "Deleted" };
  const statusColor = { A: "green", B: "red", C: "grey", D: "lightgrey" };

  useEffect(() => {
    if (getData) {
      const getShareItems = async () => {
        try {
          const results = await axios.get(`${APPDATA.BACKEND}/api/shareitems`);
          if (!results.data.tuples) throw new Error("No sharing Data.");
          let x = [];
          results.data.tuples.map((i) => x.push(i.plz));
          let x2 = x.filter((item, pos, ar) => ar.indexOf(item) === pos);
          x2.sort();
          setListPLZ(x2);
          let filterdData = results.data.tuples.filter(
            // ({ sharestatus }) => sharestatus !== "D" // only "Active/Booked/Closed" items - NOT "Deleted")
            ({ sharestatus }) => true // ! REMOVE AFTER DEV C.R.U.D. in mysharing ?
          );
          if (currentUser)
            filterdData = filterdData.filter(
              ({ username }) => username !== currentUser
            );
          filterdData.sort((a, b) => {
            if (
              a.arrayofitems.toString().toUpperCase() <
              b.arrayofitems.toString().toUpperCase()
            )
              return -1;
            if (
              a.arrayofitems.toString().toUpperCase() >
              b.arrayofitems.toString().toUpperCase()
            )
              return 1;
            return 0;
          });
          setShareItems(filterdData);
          setFilteredItems(filterdData);
        } catch (error) {
          setErr(error.message);
        }
      };
      getShareItems();
      setGetData(false);
    }
    return () => {
      setGetData(false);
    };
    // eslint-disable-next-line
  }, [getData]); // get only once

  useEffect(() => {
    const filterdData = shareItems.filter(({ plz }) =>
      filterPLZ ? plz === filterPLZ : true
    );
    const newFilteredItems = filterdData.filter(({ arrayofitems }) =>
      filterKeyword
        ? arrayofitems.toString().toLowerCase().indexOf(filterKeyword) !== -1
        : true
    );
    setFilteredItems(newFilteredItems);
    setSelectedItem([]);
    return () => {};
    // eslint-disable-next-line
  }, [filterPLZ, filterKeyword]);

  const itemClick = (item) => {
    setSelectedItem([
      [item.location.y, item.location.x],
      item.plz,
      item.message,
      item.username,
      item.datetime,
      item.arrayofitems,
      item.sharestatus,
      item.id,
    ]);
  };

  const handleBooking = (e) => {
    if (!currentUser) return alert("Please Log In to do this!");
    setModal(
      <>
        <h2>PLEASE CONFIRM RESERVATION</h2>
        <div>
          Shared items:
          <br />
          <strong>
            {selectedItem[5]
              ? selectedItem[5].toString().toUpperCase()
              : "<Items to share>"}
          </strong>
          <br />
          <p> - by {selectedItem[3] && selectedItem[3].toUpperCase()}</p>
          <p>(Sharer's email will be shown on clicking Confirm.)</p>
        </div>
        <div className="form-group">
          <input
            id="message"
            autoFocus
            maxLength="50"
            style={{ width: "40vh", border: "solid" }}
            type="text"
            placeholder="type message here"
          ></input>
          <br />
          You can enter a message to the sharer above.
          <br />
          <button onClick={confirmBooking}>Confirm</button>
          &nbsp;
          <button onClick={() => setModal("")}>Cancel</button>
        </div>
      </>
    );
  };

  const confirmBooking = async (e) => {
    setModal("");
    const info = {
      sharestatus: "B",
      bookedby: currentUser,
    };
    const msg = e.target.parentNode.childNodes[0].value.trim(); // check the actual childNode
    if (msg) info.messages = { msg, read: false };

    try {
      const post = await axios.post(
        `${APPDATA.BACKEND}/api/shareitems/${currentUser}/${selectedItem[7]}`,
        info
      );
      if (post) {
        let shareEmail = await axios.get(
          `${APPDATA.BACKEND}/api/users/${selectedItem[3]}`
        );
        setModal(
          <>
            <h2>RESERVATION CONFIRMED</h2>
            <pre>
              <br />
              {msg ? (
                <>
                  Your message:<h4>{msg}</h4>is sent.
                </>
              ) : null}
              <br />
              <br />
              You can use this email to contact the sharer:
              <br />
              <strong>{shareEmail.data.tuple[0].username}</strong>
              <h5>
                <a
                  href={`mailto:${
                    shareEmail.data.tuple[0].email
                  }?subject=Inquiry:%20${selectedItem[5].toString()}
&body=I%20am%20interested%20in%20your%20shares: ${selectedItem[5].toString()}.                                                                   \n Please kindly respond to this email.`}
                >
                  {shareEmail.data.tuple[0].email}
                </a>
              </h5>
              <i>(Clicking this Email will open your email app)</i>
              <br />
              <br />
            </pre>
            <div className="form-group">
              <button onClick={() => setModal("")}>OK</button>
            </div>
          </>
        );
        setFilterKeyword("");
        setSelectedItem([]);
      }
      setGetData(true);
    } catch (error) {
      console.log(error.message);
      setErr("Post" + error.message);
    }
  };

  const setPLZ = (e) => {
    setFilterPLZ(e.target.value);
  };

  const setKeyword = (e) => {
    setFilterKeyword(e.target.value.toLowerCase());
  };

  if (err)
    return (
      <div className="loading_container">
        <div className="loading"></div>
        <h4 style={{ fontSize: "0.8rem" }}>{err}</h4>
      </div>
    );

  let k = 0;
  return (
    <>
      <div
        className="page-container"
        style={{
          backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
          marginBottom: "0",
        }}
      >
        <div className="page-title">
          <h2>-‧≡ Sharing Page ≡‧-</h2>
        </div>
        <div
          className="page-box "
          style={{
            width: "98%",
            height: "auto",
          }}
        >
          <div className="row">
            <li>
              <strong>
                <label htmlFor="filter">Filter by PLZ : &nbsp;</label>
              </strong>
              <select value={filterPLZ} onChange={setPLZ}>
                <option value="">All</option>
                {listPLZ.map((item) => (
                  <option key={k++} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              &nbsp;
              <input
                id="searchText"
                placeholder="search with keyword"
                width={15}
                onChange={setKeyword}
              ></input>
            </li>

            <div className="row" style={{ width: "100%" }}>
              <div
                className="col-6"
                style={{
                  height: "50vh",
                  width: "50%",
                  color: "red",
                  overflowY: "scroll",
                }}
              >
                <h6>
                  <u>Share Basket</u>
                </h6>
                <ul style={{ padding: "0px" }}>
                  {filteredItems
                    // .filter((it) => true)
                    .map((item) => (
                      <li
                        key={k++}
                        onClick={(e) => itemClick(item)}
                        style={{
                          cursor: "pointer",
                          color: statusColor[item.sharestatus],
                          textDecorationLine:
                            item.sharestatus === "D" ? "line-through" : "",
                          backgroundColor:
                            item.arrayofitems === selectedItem[5]
                              ? "#dee7fd"
                              : "",
                        }}
                      >
                        <pre>
                          {item.arrayofitems.toString()}
                          <span style={{ color: "grey", fontSize: "0.8rem" }}>
                            &nbsp;({item.username}-PLZ:{item.plz})
                          </span>
                        </pre>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="col-6" style={{ width: "50%" }}>
                <b
                  style={{
                    color: statusColor[selectedItem[6]],
                    textDecorationLine:
                      selectedItem[6] === "D" ? "line-through" : "",
                    fontVariantCaps: "petite-caps",
                  }}
                >
                  {selectedItem[5]
                    ? selectedItem[5].toString()
                    : "<Items to share>"}
                </b>
                <br />
                {selectedItem[2] || "<Message>"}
                <br />
                <i style={{ color: statusColor[selectedItem[6]] }}>
                  {shareStatus[selectedItem[6]] || "<Status>"}
                </i>
                <p style={{ fontSize: "0.5rem" }}>
                  Submitted on:{datify(selectedItem[4])} &nbsp;&nbsp; By:{" "}
                  {selectedItem[3]}
                </p>
                <button
                  hidden={!selectedItem[1] || selectedItem[6] !== "A"}
                  onClick={handleBooking}
                >
                  Book this Share
                </button>
                <MapChart coordinates={selectedItem[0]} plz={selectedItem[1]} />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------MODAL---------- */}
        <div className={modal ? "modal d-block" : "modal d-none"}>
          <div className="modal-container">
            <div style={{ overflowY: "auto" }}>{modal}</div>
          </div>
        </div>
        {/* ---------End of MODAL---------- */}
      </div>
    </>
  );
};

export default Sharing;
