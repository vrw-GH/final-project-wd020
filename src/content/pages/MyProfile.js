import { useState, useEffect } from "react";
import axios from "axios";
import MapChart from "./MapChart";
import "./_Page.css";
import "./MyProfile.css";

const MyProfile = ({ APPDATA }) => {
  const userName = sessionStorage.getItem("currentUser");
  const [thisUser, setThisUser] = useState({}); //to get from database
  const [userCoord, setUserCoord] = useState([]);
  const maxAllowedSize = 1024 * 50; //kb

  useEffect(() => {
    (async () => {
      try {
        const results = await axios.get(
          `${APPDATA.BACKEND}/api/users/${userName}`
        );
        setThisUser(results.data.tuple[0]);
        setUserCoord([
          results.data.tuple[0].location.x,
          results.data.tuple[0].location.y,
        ]);
      } catch (error) {
        alert("User Data - Get " + error);
      }
    })();
    return () => {};
    //eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    delete thisUser.username;
    delete thisUser.create_time;
    delete thisUser.password;
    delete thisUser.likes;
    // remove blank submission (-- depends if blanks should be allowe?? ! )
    Object.keys(thisUser).reduce((acc, k) => !thisUser[k] && delete acc[k]);
    const info = { ...thisUser };
    info.location = userCoord[0] + "," + userCoord[1];
    // console.log(info);
    try {
      for (const key in info) {
        if (!info[key]) throw Error(key + " is empty. All fields required.");
      }
      await axios.post(
        `${APPDATA.BACKEND}/api/users/${userName.toLowerCase()}`,
        info
      );
    } catch (error) {
      window.alert(error);
    }
  };

  const HandleGetLatLon = async () => {
    try {
      const res = await axios.get(
        `${APPDATA.BACKEND}/api/plz-de/${thisUser.plz}`
      );
      console.log(res.data.tuple[0]);
    } catch (error) {
      window.alert(error);
    }
  };

  const handleInput = (e) => {
    const info = { ...thisUser };
    info[e.target.id] = e.target.value;
    setThisUser(info);
  };

  const handleLocInput = (e) => {
    let x = [];
    if (e.target.id === "long") x = [Number(e.target.value), userCoord[1]];
    if (e.target.id === "lat") x = [userCoord[0], Number(e.target.value)];
    setUserCoord(x);
    const info = { ...thisUser };
    info.location.x = x[0];
    info.location.y = x[1];
    setThisUser(info);
  };

  const handleImgInput = (e) => {
    if (e.target.files[0].size > maxAllowedSize) {
      alert(
        `File too big (${Math.round(e.target.files[0].size / 1024)}kb) - max ${
          maxAllowedSize / 1024
        }kb`
      );
      e.target.value = "";
      return;
    }
    const info = { ...thisUser };
    var reader = new FileReader();
    reader.onloadend = (event) => {
      info[e.target.id] = event.target.result; // raw image data ?
      setThisUser(info);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
      }}
    >
      <div className="page-title">
        <h2>
          <span>-·≡ My Profile ≡·- </span>
        </h2>
      </div>
      <div className="page-box" style={{ width: "90%" }}>
        <form onSubmit={handleSubmit}>
          <div className="myprofile_container row">
            <div className="myprofile_profilepic col-3">
              <object
                data={thisUser.profilepic}
                type="image/jpg,png"
                className="create_title_img row"
              >
                <input
                  type="file"
                  encType="multipart/form-data"
                  accept="image/png, .jpeg, .jpg, image/gif"
                  id="profilepic"
                  name="profilepic"
                  onChange={handleImgInput}
                />
                <img
                  src={thisUser.profilepic}
                  // className="create_title_img row"
                  alt={`upload (max size ${maxAllowedSize / 1024}kb)`}
                />
              </object>
            </div>
            <div className="myprofile_details col-3">
              <u>Details</u>
              <br />
              Email:
              <input
                style={{ width: "5rem" }}
                type="email"
                placeholder="email"
                id="email"
                required
                value={thisUser.email}
                onChange={handleInput}
              />
              {/* <br /> */}
              {/* Address: <input value="  " style={{ width: "5rem" }} /> */}
              <br />
              PLZ:
              <input
                style={{ width: "5rem" }}
                type="text"
                placeholder="Post Code"
                id="plz"
                required
                value={thisUser.plz}
                onChange={handleInput}
              />
              <input
                type="button"
                value="Get Lon/Lat"
                onClick={HandleGetLatLon}
              ></input>
              <br />
              <u> My Location:</u>
              <br />
              Long:
              <input
                // value={thisUser?.location?.x}
                value={userCoord[0]}
                type="number"
                step="0.05"
                defaultValue="10"
                placeholder="Longitude in Decimal"
                title="Decimal Notation"
                style={{ width: "5rem" }}
                id="long"
                onChange={handleLocInput}
                maxLength="6"
              />
              °
              <br />
              Lat:
              <input
                // value={thisUser?.location?.y}
                value={userCoord[1]}
                type="number"
                step="0.05"
                defaultValue="51"
                placeholder="Latitude in Decimal"
                title="Decimal Notation"
                style={{ width: "5rem" }}
                id="lat"
                onChange={handleLocInput}
                maxLength="6"
              />
              °
            </div>
            <div className="myprofile_location col-3">
              <div className="myprofile_map col">
                <MapChart coordinates={userCoord} plz={thisUser.plz} />
              </div>
            </div>
          </div>
          <button type="submit" className="btns">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
