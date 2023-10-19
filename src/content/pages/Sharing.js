import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { datify } from "../../components/formatting.js";
import MapChart from "../../components/MapChart.js";
import Loading from "../../components/Loading.js";
import PageTitle from "../../components/PageTitle.js";
import { getSharedata } from "../../components/dataHandling.js";
import "./_General.css";

//------------------------------------------------------------------------------------
const Sharing = ({ APPDATA }) => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [getData, setGetData] = useState(true);
  const [err, setErr] = useState("loading page...");
  const [modal, setModal] = useState("");
  const [shareItems, setShareItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [filterPLZ, setFilterPLZ] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [listPLZ, setListPLZ] = useState([]);
  const shareStatus = { A: "Active", B: "Reserved", C: "Closed", D: "Deleted" };
  const statusColor = { A: "green", B: "red", C: "grey", D: "lightgrey" };
  const navigate = useNavigate();

  useEffect(() => {
    if (getData) {
      (async () => {
        try {
          const results = await getSharedata();
          let x = [];
          results.map((i) => x.push(i.plz));
          let x2 = x.filter((item, pos, ar) => ar.indexOf(item) === pos);
          x2.sort();
          setListPLZ(x2);
          let filterdData = results.filter(
            // ({ sharestatus }) => sharestatus < "D" // only "Active/Booked/Closed"
            ({ sharestatus }) => sharestatus < "C" // only "Active/Booked"
          );
          if (currentUser)
            filterdData = filterdData.filter(
              ({ username }) => username !== currentUser.userName
            );
          filterdData.sort((a, b) => {
            if (a.sharestatus < b.sharestatus) return -1;
            if (a.sharestatus > b.sharestatus) return 1;
            return 0;
          });
          setShareItems(filterdData);
          setFilteredItems(filterdData);
          setErr("");
          window.scrollTo(0, 0);
        } catch (error) {
          setErr(error.message);
        }
      })();
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
    return () => { };
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
    if (!currentUser) {
      if (window.confirm("Log In now?")) navigate("/login");
      return;
    }
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
            required
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
      bookedby: currentUser.userName,
    };
    const msg = e.target.parentNode.childNodes[0].value.trim(); // check the actual childNode
    if (msg) info.messages = { msg, read: false };
    try {
      const post = await axios.post(
        `${APPDATA.BACKEND}/api/shareitems/${currentUser.userName}/${selectedItem[7]}`,
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
              <strong>{shareEmail.data.tuples[0].username}</strong>
              <h5>
                <a
                  href={`mailto:${shareEmail.data.tuples[0].email
                    }?subject=Inquiry:%20${selectedItem[5].toString()}
&body=I%20am%20interested%20in%20your%20shares: ${selectedItem[5].toString()}.                                                                   \n Please kindly respond to this email.`}
                >
                  {shareEmail.data.tuples[0].email}
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

  let k = 0;
  return (
    <>
      <>
        <div className="page-container">
          <PageTitle titleText="Sharing Home" />
          {currentUser ? (
            <div>
              <button
                className="btn U-btn"
                onClick={() => navigate("/myshare")}
              >
                Go to My Shares
              </button>
            </div>
          ) : null}
          <div
            className="page-box "
            style={{
              width: "98%",
              height: "auto",
            }}
          >
            {err ? (
              <Loading text={err} />
            ) : (
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
                <h6>
                  <u>Share Basket</u>
                </h6>
                <div className="row" style={{ width: "100%" }}>
                  <div
                    className="col-6"
                    style={{
                      marginTop: "10px",
                      height: "75vh",
                      maxWidth: "45vw",
                      minWidth: "max( 40vw, 300px )",
                      color: "red",
                      overflowY: "scroll",
                    }}
                  >
                    <ul style={{ marginTop: "65px" }}>
                      {filteredItems
                        // .filter((it) => true)
                        .map((item) => (
                          <li
                            key={k++}
                            onClick={(e) => itemClick(item)}
                            className="share-list"
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
                              <span
                                style={{ color: "grey", fontSize: "0.8rem" }}
                              >
                                &nbsp;({item.username}-PLZ:{item.plz})
                              </span>
                            </pre>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="col-6" style={{ maxWidth: "45vw", minWidth: "max( 40vw, 300px )" }}>
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
                    <MapChart
                      coordinates={selectedItem[0]}
                      plz={selectedItem[1]}
                    />
                  </div>
                </div>
              </div>
            )}
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
    </>
  );
};

export default Sharing;
