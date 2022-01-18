import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MapChart from "../../components/MapChart";
import "../../loading.css";
import "./_Page.css";
import "./MyProfile.css";

const MyProfile = ({ APPDATA }) => {
  const currentUser = sessionStorage.getItem("currentUser");
  const [err, setErr] = useState(null);
  const [thisUser, setThisUser] = useState({}); //to get from database
  const [userCoord, setUserCoord] = useState([]);
  const [cityName, setCityName] = useState("");
  const maxAllowedSize = 1024 * 50; //kb
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const results = await axios.get(
          `${APPDATA.BACKEND}/api/users/${currentUser}`
        );
        if (!results.data.tuple[0]) throw new Error("No User Data.");
        setThisUser(results.data.tuple[0]);
        setUserCoord([
          results.data.tuple[0].location?.x || "10",
          results.data.tuple[0].location?.y || "51",
        ]);
      } catch (error) {
        // alert("User Data - Get " + error);
        setErr(error.message);
      }
    };
    getUser();
    return () => {};
    //eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thisUser.profilepic) delete thisUser.profilepic;
    delete thisUser.username;
    delete thisUser.create_time;
    delete thisUser.password;
    delete thisUser.likes;
    delete thisUser.likes2;
    Object.keys(thisUser).reduce((acc, k) => !thisUser[k] && delete acc[k]);
    const info = { ...thisUser };
    if (userCoord[0]) {
      info.location = userCoord[0] + "," + userCoord[1];
    } else delete info.location;

    try {
      for (const key in info) {
        if (!info[key]) throw Error(key + " is empty. All fields required.");
      }
      await axios.post(
        `${APPDATA.BACKEND}/api/users/${currentUser.toLowerCase()}`,
        info
      );
      alert("Profile Info Saved.");
      navigate("/");
    } catch (error) {
      // setErr(error.message);
      window.alert(error);
    }
  };

  const HandleGetLatLon = async () => {
    if (!thisUser.plz) return;
    try {
      const res = await axios.get(
        `${APPDATA.BACKEND}/api/plz-de/${thisUser.plz}`
      );
      if (!res.data.tuple[0]) return setCityName("No data found :(");
      setUserCoord([res.data.tuple[0].longitude, res.data.tuple[0].latitude]);
      setCityName(
        res.data.tuple[0].place_name + " (" + res.data.tuple[0].code1 + ")"
      );
    } catch (error) {
      setCityName("No data found!");
    }
  };

  const handleInput = (e) => {
    const info = { ...thisUser };
    info[e.target.id] = e.target.value;
    setThisUser(info);
  };

  const handleLocInput = (e) => {
    let xy = [];
    if (e.target.id === "long") xy = [Number(e.target.value), userCoord[1]];
    if (e.target.id === "lat") xy = [userCoord[0], Number(e.target.value)];
    setUserCoord(xy);
    const info = { ...thisUser };
    if (!info.location) info.location = {};
    info.location.x = xy[0];
    info.location.y = xy[1];
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

  if (err)
    return (
      <div className="loading_container">
        <div className="loading"></div>
        <h4 style={{ fontSize: "0.8rem" }}>{err}</h4>
      </div>
    );

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
      }}
    >
      <div className="page-title">
        <h2>
          <span>-‧≡ My Profile ≡‧- </span>
        </h2>
      </div>
      <div className="page-box" style={{ width: "90%" }}>
        <form onSubmit={handleSubmit}>
          <div className="myprofile_container row">
            <div className="myprofile_profilepic col-4">
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
            <div className="myprofile_details col-4">
              <u>Details</u>
              <br />
              Email:
              <input
                // style={{ minWidth: "5rem" }}
                type="email"
                placeholder="email"
                id="email"
                required
                value={thisUser.email || ""}
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
                value={thisUser.plz || ""}
                onChange={handleInput}
              />
              <input
                type="button"
                value="Get Long/Lat"
                onClick={HandleGetLatLon}
              ></input>
              <br />
              <p style={{ opacity: cityName ? "100%" : "0" }}>
                City: <strong>{cityName}</strong>
              </p>
              <u> My Location:</u>
              <br />
              Long:
              <input
                // value={thisUser?.location?.x}
                value={userCoord[0] || ""}
                type="number"
                step="0.0001"
                // defaultValue="10"
                placeholder="Longitude in Decimal"
                title="Decimal Notation"
                style={{ width: "5rem", textAlign: "right" }}
                id="long"
                onChange={handleLocInput}
                maxLength="6"
              />
              °
              <br />
              Lat:&nbsp;&nbsp;
              <input
                // value={thisUser?.location?.y}
                value={userCoord[1] || ""}
                type="number"
                step="0.0001"
                // defaultValue="51"
                placeholder="Latitude in Decimal"
                title="Decimal Notation"
                style={{ width: "5rem", textAlign: "right" }}
                id="lat"
                onChange={handleLocInput}
                maxLength="6"
              />
              °
            </div>
            {/* <div className="myprofile_location col-3"> */}
            <div className="myprofile_map col">
              <MapChart coordinates={userCoord} plz={thisUser.plz} />
            </div>
            {/* </div> */}
          </div>
          <button type="submit" className="btns">
            Save Profile
          </button>
          {/* <button type="cancel" className="btns">
            Reset
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
