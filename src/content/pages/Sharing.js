import React, { useState, useEffect } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";
// import Itemsrender from "../../components/itemsrender";
// import Fetched from "../../components/Fetched";
import "./_Page.css";
import MapChart2 from "./MapChart2";

//--------------------------------------------------------------------------------------
const Sharing = ({ APPDATA }) => {
  // const currentUser = sessionStorage.getItem("currentUser");
  const [shareItems, setShareItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [err, setErr] = useState("");
  const [filterPLZ, setFilterPLZ] = useState("");
  // const currentUser = "abdullah"
  // const [info, setInfo] = useState({
  //   sharestatus: "",
  //   arrayofitems: [],
  //   message: "",
  //   location: "",
  // });

  useEffect(() => {
    const getShareItems = async () => {
      try {
        const results = await axios.get(`${APPDATA.BACKEND}/api/shareitems`);
        if (!results.data.tuples) throw new Error("No Ingredients Data.");
        setShareItems(results.data.tuples);
        // console.log(results.data.tuples);
      } catch (error) {
        setErr(error.message);
      }
    };
    getShareItems();
    // eslint-disable-next-line
  }, []); // get only once

  useEffect(() => {
    const filterdData = shareItems.filter(({ plz }) => (plz = filterPLZ));
    setShareItems(filterdData);
    console.log(filterdData);
    return () => {};
  }, [filterPLZ]);

  const itemClick = (e, item) => {
    // const location = Object.values(item.location);
    const location = [item.location.y, item.location.x];
    setSelectedItem([location, item.plz]);
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
            {/* <strong style={{ color: "black" }}>Filter</strong> */}
            <li>
              <strong>
                <label htmlFor="categories">Filter by PLZ : &nbsp;</label>
              </strong>
              <select value={filterPLZ} onChange={setPLZ}>
                <option value="">All</option>
                {shareItems.map((item) => (
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
                  {shareItems
                    .filter((it) => true)
                    .map((item) => (
                      <li
                        key={k++}
                        onClick={(e) => itemClick(e, item)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* <Link to={`/recipes/${recipe.slug}`} className="link"> */}
                        <pre>
                          {item.arrayofitems}
                          <span style={{ color: "grey", fontSize: "0.8rem" }}>
                            (Shared by {item.username})
                          </span>
                        </pre>
                        {/* </Link> */}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="container col-5" style={{ width: "35vh" }}>
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

// const handleSubmit = async (e) => {
//   try {
//     e.preventDefault();

//     let arrayofItems = [];
//     arrayofItems.push(info.arrayofitems);
//     let sendInfo = {};

//     if (info.sharestatus) {
//       sendInfo.sharestatus = info.sharestatus;
//     }
//     if (info.message) {
//       sendInfo.message = info.message;
//     }
//     if (arrayofItems) {
//       sendInfo.arrayofitems = arrayofItems;
//     }
//     if (info.location) {
//       sendInfo.location = info.location;
//     }
//     console.log(sendInfo);
//     const post = await axios
//       .post(
//         `${APPDATA.BACKEND}/api/shareitems/${currentUser}`,
//         sendInfo
//         //   {
//         //   username: info.username,
//         //   arrayofitems: arrayofItems,
//         //   sharestatus: info.sharestatus,
//         //   message: info.message,
//         //   location: "1,2"
//         // }
//       )
//       .then((res) => console.log(res.data));
//     console.log(post);
//   } catch (error) {
//     console.log(error);
//     // setError("Created")
//   }
// };

// function handle(event) {
//   event.preventDefault();
//   const newInfo = { ...info };
//   newInfo[event.target.id] = event.target.value;
//   setInfo(newInfo);
//   console.log(newInfo);
// }

//   {/* <form onSubmit={(e) => handleSubmit(e)} className="form">
//         <h2 className="h22">Update shared items</h2>
//         <br />
//         <input
//           className="arrayOfItems"
//           type="text"
//           placeholder="arrayofitems"
//           onChange={(event) => handle(event)}
//           id="arrayofitems"
//           value={info.arrayofitems}
//         ></input>
//         <br />
//         <input
//           className="category"
//           type="text"
//           placeholder="username"
//           id="username"
//           value={currentUser}
//         ></input>
//         <br />
//         <input
//           cols="40"
//           rows="8"
//           className="ingredients"
//           type="text"
//           placeholder="message"
//           onChange={(event) => handle(event)}
//           id="message"
//           value={info.message}
//         ></input>
//         <br />
//         <input
//           type="text"
//           placeholder="Share status"
//           onChange={(event) => handle(event)}
//           id="sharestatus"
//           value={info.sharestatus}
//         ></input>

//         <button className="btns">Update</button>
//       </form> */}
