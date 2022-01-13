import React, { useState, useEffect } from "react";
import axios from "axios";
import "./_Page.css";
import MapChart2 from "./MapChart2";

//--------------------------------------------------------------------------------------
const Sharing = ({ APPDATA }) => {
  const [shareItems, setShareItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [err, setErr] = useState("");
  const [filterPLZ, setFilterPLZ] = useState("");

  useEffect(() => {
    const getShareItems = async () => {
      try {
        const results = await axios.get(`${APPDATA.BACKEND}/api/shareitems`);
        if (!results.data.tuples) throw new Error("No Ingredients Data.");
        const filterdData = results.data.tuples.filter(
          // ({ sharestatus }) => sharestatus !== "D" // only "Active" items (NOT "D")
          ({ sharestatus }) => true // ! REMOVE AFTER DEV C.R.U.D. in mysharing
        );
        setShareItems(filterdData);
        setFilteredItems(filterdData);
        // console.log(results.data.tuples);
      } catch (error) {
        setErr(error.message);
      }
    };
    getShareItems();
    // eslint-disable-next-line
  }, []); // get only once

  useEffect(() => {
    const filterdData = shareItems.filter(({ plz }) =>
      filterPLZ ? plz === filterPLZ : true
    );
    setFilteredItems(filterdData);
    // console.log(filterdData);
    // setSelectedItem([
    //   [filterdData[0].location.y, filterdData[0].location.x],
    //   filterdData[0].plz,
    //   filterdData[0].message,
    //   filterdData[0].username,
    //   filterdData[0].datetime,
    // ]);
    setSelectedItem([]);
    return () => {};
    // eslint-disable-next-line
  }, [filterPLZ]);

  const itemClick = (item) => {
    setSelectedItem([
      [item.location.y, item.location.x],
      item.plz,
      item.message,
      item.username,
      item.datetime,
      item.arrayofitems,
    ]);
  };

  const setPLZ = (e) => {
    setFilterPLZ(e.target.value);
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
          }}
        >
          <div className="row">
            <li>
              <strong>
                <label htmlFor="filter">Filter by PLZ : &nbsp;</label>
              </strong>
              <select value={filterPLZ} onChange={setPLZ}>
                <option value="">All</option>
                {filteredItems
                  // .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
                  .sort()
                  .map((item) => (
                    <option key={k++} value={item.plz}>
                      {item.plz}
                    </option>
                  ))}
              </select>
            </li>

            <div className="row">
              <div
                className="col-6"
                style={{ color: "red", overflowY: "scroll" }}
              >
                {/* <Itemsrender shareItems={getShareItems}/> */}
                <h6>
                  <u>Share Basket</u>
                </h6>
                <ul style={{ padding: "0px" }}>
                  {filteredItems
                    .filter((it) => true)
                    .map((item) => (
                      <li
                        key={k++}
                        onClick={(e) => itemClick(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <pre>
                          {item.arrayofitems}
                          <span style={{ color: "grey", fontSize: "0.8rem" }}>
                            (Shared by {item.username})
                          </span>
                        </pre>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="container col-6" style={{ width: "35vh" }}>
                <strong>{selectedItem[5] || "<Items to share>"}</strong>
                <br />
                {selectedItem[2] || "<Message>"}
                <p style={{ fontSize: "0.5rem" }}>
                  By: {selectedItem[3]}
                  <br />
                  Submitted on:{selectedItem[4]}
                </p>
                <button hidden={!selectedItem[1]}>Book Item</button>
                <MapChart2
                  coordinates={selectedItem[0]}
                  plz={selectedItem[1]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sharing;
