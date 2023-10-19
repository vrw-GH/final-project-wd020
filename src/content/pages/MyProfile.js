import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { genHash, checkPwd, isGoodPWD } from "../../components/security.js";
import MapChart from "../../components/MapChart.js";
import Loading from "../../components/Loading.js";
import { getUser, getCity, updateUser } from "../../components/dataHandling.js";
import PageTitle from "../../components/PageTitle.js"
import "./_General.css";
import "./MyProfile.css";

const MyProfile = ({ setCurrentUser, APPDATA }) => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [err, setErr] = useState(null);
  const [modal, setModal] = useState("");
  const [thisUser, setThisUser] = useState({});
  const [userCoord, setUserCoord] = useState([]);
  const [cityName, setCityName] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const maxAllowedSize = 1024 * 50; // kb
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const result = await getUser(currentUser.userName);
        setThisUser(result);
        setUserCoord([result.location?.x || "10", result.location?.y || "51"]);
        window.scrollTo(0, 0);
      } catch (error) {
        setErr(error.message);
      }
    })();
    return () => { };
    //eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Update now?")) return;
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
      const result = await updateUser(currentUser.userName, info);
      const user = {
        userName: result.username,
        profilePic: result.profilepic,
        token: currentUser.token,
      };
      setCurrentUser(user);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      window.alert("Profile Info Saved.");
      navigate("/");
    } catch (error) {
      window.alert(error); // setErr(error.message);
    }
  };

  const HandleGetLatLon = async () => {
    if (!thisUser.plz) return;
    setIsChanged(true);
    try {
      const result = await getCity(thisUser.plz);
      setUserCoord([result.longitude, result.latitude]);
      setCityName(result.place_name + " (" + result.code1 + ")");
    } catch (error) {
      setCityName(error.message);
    }
  };

  const handleInput = (e) => {
    const info = { ...thisUser };
    info[e.target.id] = e.target.value.trim();
    setThisUser(info);
    setIsChanged(true);
  };

  const handleLocInput = (e) => {
    setIsChanged(true);
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
        `File too big (${Math.round(e.target.files[0].size / 1024)}kb) - max ${maxAllowedSize / 1024
        }kb`
      );
      e.target.value = "";
      return;
    }
    setIsChanged(true);
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
      if (pwd1.value !== pwd2.value) throw Error("New passwords do not match.");
      if (pwd1.value === pwdOld.value)
        throw Error("New password cannot be similar to old.");
      isGoodPWD(pwd1.value); // will throw error on bad password.
      checkPwd(pwdOld.value, thisUser.password);
      if (!window.confirm("Do you want to change your password?")) return;
      let pwdHash = await genHash(pwd1.value);
      const info = { password: pwdHash };
      await updateUser(currentUser.userName, info);
      alert("Password Updated");
      setModal("");
    } catch (error) {
      window.alert(error.message);
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

  return (
    <div className="page-container">
      <PageTitle titleText="My Profile" />
      <div className="page-box" style={{ width: "90%" }}>
        {err ? (
          <Loading text={err} />
        ) : (
          <>
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
                          value="Show PLZ city"
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
                <button type="submit" className="btns " disabled={!isChanged}>
                  Submit Changes
                </button>
                <button
                  type="button"
                  className="btns"
                  onClick={handleChangePWD}
                >
                  Change Password
                </button>
              </form>
            </div>
          </>
        )}

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
