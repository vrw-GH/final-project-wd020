import React, { useState, useEffect } from "react";
import axios from "axios";
import MapChart from "./MapChart";
import { datify } from "../../components/formatting";
import "./_Page.css";

//--------------------------------------------------------------------------------------
const Sharing = ({ APPDATA }) => {
  const currentUser = sessionStorage.getItem("currentUser");
  const [getData, setGetData] = useState(true);
  const [err, setErr] = useState("");
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
          if (!results.data.tuples) throw new Error("No Ingredients Data.");
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

  const handleBooking = async (e) => {
    if (!currentUser) return alert("Please Log In to do this!");
    // console.log(selectedItem);
    const confirmBook = window.confirm(
      `Do you want to book share of:\n
       ${selectedItem[5]} by ${selectedItem[3].toUpperCase()}`
    );
    if (confirmBook) {
      // TODO show connect user window!
      try {
        const post = await axios.post(
          `${APPDATA.BACKEND}/api/shareitems/${currentUser}/${selectedItem[7]}`,
          { sharestatus: "B", bookedby: currentUser }
        );
        if (post) {
          console.log(post);
          alert(
            `${
              selectedItem[5]
            } successfully RESERVED,\n please contact ${selectedItem[3].toUpperCase()}`
          );
          setFilterKeyword("");
          setSelectedItem([]);
        }
        // setSelectedItem(...selectedItem, (selectedItem.sharestatus = "B"));
        setGetData(true);
      } catch (error) {
        console.log(error.message);
        setErr("Post" + error.message);
      }
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
                  height: "70vh",
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
                  By: {selectedItem[3]}
                  <br />
                  Submitted on:{datify(selectedItem[4])}
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
      </div>
    </>
  );
};

export default Sharing;
