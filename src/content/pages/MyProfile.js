import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { genHash, checkPwd, isGoodPWD } from "../../components/security";
import MapChart from "../../components/MapChart";
import "../../components/loading.css";
import "./_Page.css";
import "./MyProfile.css";

const MyProfile = ({ setCurrentUser, APPDATA }) => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [err, setErr] = useState(null);
  const [modal, setModal] = useState("");
  const [thisUser, setThisUser] = useState({}); //to get from database
  const [userCoord, setUserCoord] = useState([]);
  const [cityName, setCityName] = useState("");
  const maxAllowedSize = 1024 * 50; //kb
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const results = await axios.get(
          `${APPDATA.BACKEND}/api/users/${currentUser.userName}`
        );
        if (!results.data.tuple[0]) throw new Error("No User Data.");
        setThisUser(results.data.tuple[0]);
        setUserCoord([
          results.data.tuple[0].location?.x || "10",
          results.data.tuple[0].location?.y || "51",
        ]);
        window.scrollTo(0, 0);
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
      const result = await axios.post(
        `${APPDATA.BACKEND}/api/users/${currentUser.userName.toLowerCase()}`,
        info
      );
      const user = {
        userName: result.data.tuple[0].username,
        profilePic: result.data.tuple[0].profilepic,
      };
      setCurrentUser(user);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
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
    info[e.target.id] = e.target.value.trim();
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

  const handlePwdSubmit = async (form) => {
    form.preventDefault();
    const { pwd1, pwd2, pwdOld } = form.target;
    try {
      isGoodPWD(pwd1.value); // will throw error on bad password.
      if (pwd1.value !== pwd2.value) throw Error("New passwords do not match.");
      if (!checkPwd(pwdOld.value, thisUser.password))
        throw Error("Current password invalid.");
      if (!window.confirm("Do you want to change your password?")) return;
      let pwdHash = genHash(pwd1.value);
      const info = { password: pwdHash };
      let result = await axios.post(
        `${APPDATA.BACKEND}/api/users/${currentUser.userName.toLowerCase()}`,
        info
      );
      if (!result.data.info.result) throw Error(result.data.info.message);
      alert("Password Updated");
      setModal("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChangePWD = () => {
    setModal(
      <div>
        <h2>Change Password</h2>
        <form
          style={{
            display: "grid",
            justifyContent: "center",
            justifyItems: "center",
          }}
          onSubmit={handlePwdSubmit}
        >
          <input
            style={{ width: "12rem", textAlign: "center" }}
            type="password"
            name="pwd1"
            minLength={6}
            placeholder="New password:"
            required
            autoFocus
          />
          <input
            style={{ width: "12rem", textAlign: "center" }}
            type="password"
            placeholder="Re-enter new password:"
            name="pwd2"
            required
          />
          <br />
          <input
            style={{ width: "12rem", textAlign: "center" }}
            type="password"
            placeholder="Old password"
            name="pwdOld"
            required
          />
          <br />
          <div>
            {/* <button className="btns" type="submit">
              Update
            </button> */}
            {/* <button className="btns" onClick={() => setModal("")}>
              Cancel
            </button> */}
            <input className="btns" type="submit" value="Update" />
            &nbsp;
            <input
              className="btns"
              onClick={() => setModal("")}
              type={"button"}
              value="Cancel"
            />
          </div>
        </form>
      </div>
    );
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
          <span>-•≡ My Profile ≡•- </span>
        </h2>
      </div>
      <div className="page-box" style={{ width: "90%" }}>
        <div className="myprofile_container">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="myprofile_profilepic col">
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
              <div className="myprofile_details col">
                <h6>
                  <u>My Details</u>
                </h6>
                <div>
                  <label style={{ width: "70px" }}>Email:&nbsp;</label>
                  <input
                    style={{ minWidth: "12rem" }}
                    type="email"
                    placeholder="email"
                    id="email"
                    required
                    value={thisUser.email || ""}
                    onChange={handleInput}
                  />
                  <br />
                  <label style={{ width: "70px" }}>Address:&nbsp;</label>
                  <input style={{ minWidth: "12rem" }} />
                </div>
                <hr />
                <h6>
                  <u> My Location</u>
                </h6>
                <div className="myprofile_form">
                  <div>
                    <label style={{ width: "50px" }}>PLZ:&nbsp;</label>
                    <input
                      type="text"
                      placeholder="Post Code"
                      id="plz"
                      style={{ width: "4rem", textAlign: "right" }}
                      required
                      value={thisUser.plz || ""}
                      onChange={handleInput}
                    />
                    &nbsp;
                    <input
                      type="button"
                      value="Get Coord."
                      onClick={HandleGetLatLon}
                    ></input>
                    <br />
                    <label style={{ width: "50px" }}>Long:&nbsp;</label>
                    <input
                      value={userCoord[0] || ""}
                      type="number"
                      step="0.0001"
                      placeholder="Longitude in Decimal"
                      title="Decimal Notation"
                      style={{ width: "5rem", textAlign: "right" }}
                      id="long"
                      onChange={handleLocInput}
                      maxLength="6"
                    />
                    °
                    <br />
                    <label style={{ width: "50px" }}>Lat:&nbsp;</label>
                    <input
                      value={userCoord[1] || ""}
                      type="number"
                      step="0.0001"
                      placeholder="Latitude in Decimal"
                      title="Decimal Notation"
                      style={{ width: "5rem", textAlign: "right" }}
                      id="lat"
                      onChange={handleLocInput}
                      maxLength="6"
                    />
                    °
                    <span
                      style={{
                        display: cityName ? "inherit" : "none",
                      }}
                    >
                      <label>City:&nbsp;</label>
                      <strong>{cityName}</strong>
                    </span>
                  </div>
                </div>
              </div>
              <div className="myprofile_map col-2">
                <MapChart coordinates={userCoord} plz={thisUser.plz} />
              </div>
            </div>
            <button type="submit" className="btns ">
              Submit Changes
            </button>
            <button type="button" className="btns" onClick={handleChangePWD}>
              Change Password
            </button>
          </form>
        </div>
        {/* ---------------MODAL---------- */}
        <div className={modal ? "modal d-block" : "modal d-none"}>
          <div className="modal-container">
            <div style={{ overflowY: "auto" }}>{modal}</div>
          </div>
        </div>
        {/* ---------End of MODAL---------- */}
      </div>
    </div>
  );
};

export default MyProfile;
