import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./_Page.css";

const Login = ({ setCurrentUser, APPDATA }) => {
  const [loginMsg, setLoginMsg] = useState("");
  let navigate = useNavigate();
  let username = "";
  let navigateTo = "/";

  useEffect(() => {
    if (sessionStorage.getItem("currentUser")) {
      sessionStorage.removeItem("currentUser");
      setCurrentUser("");
      return null;
    }
    return () => {};
    //eslint-disable-next-line
  }, []);

  const doLogin = async (e) => {
    try {
      username = e.target.parentElement.children["username"].value;
      if (!username) throw Error("Should enter credentials.");
      let result = await axios.get(`${APPDATA.BACKEND}/api/users/${username}`);
      if (!result.data.info.result) throw Error(result.data.info.message);
      if (
        //                                            TODO authentication here
        result.data.tuple[0].password !==
        e.target.parentElement.children["password"].value
      ) {
        throw Error("Invalid Credentials - ");
      }
      setCurrentUser(result.data.tuple[0].username);
      setLoginMsg(`"${username}" - succesfully logged in!`);
      sessionStorage.setItem("currentUser", username);
    } catch (error) {
      setLoginMsg(error + " Please try again.");
      navigateTo = "/login";
    }
  };

  const doCreateUser = async (e) => {
    try {
      let item = {
        username:
          e.target.parentElement.children["username"].value.toLowerCase(),
        password: e.target.parentElement.children["password"].value,
        email: e.target.parentElement.children["email"].value,
      };
      if (!item.username) throw Error("Should enter the credentials.");
      if (!item.email) throw Error("Should enter the credentials.");
      if (!item.password) throw Error("Should enter the credentials.");
      let result = await axios.post(`${APPDATA.BACKEND}/api/users`, item);
      if (!result.data.info.result) throw Error(result.data.info.message);
      setCurrentUser(result.data.tuple[0].username);
      setLoginMsg(result.data.info.message);
      sessionStorage.setItem("currentUser", item.username);
      username = "";
    } catch (error) {
      setLoginMsg(error + " Please try again.");
      navigateTo = -1;
    }
  };

  const goHome = () => {
    console.log(navigateTo);
    navigate(navigateTo);
  };

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
      }}
    >
      <div className="page-title">
        <h2>-‧≡ User Login / Registration ≡‧-</h2>
      </div>
      <div className="page-box col-8" style={{ minWidth: "300px" }}>
        {loginMsg ? (
          <>
            {loginMsg}
            <br />
            <br />
            <button
              onClick={goHome}
              className="btn btn-primary"
              autoFocus
              onKeyDown={(keyCode) => (keyCode === 13 ? goHome : false)}
            >
              Ok
            </button>
          </>
        ) : (
          <>
            <input
              id="username"
              default={true}
              maxLength={16}
              type="text"
              required
              autoFocus={true}
              placeholder="username"
              className="form-control"
            />

            <input
              id="password"
              type="password"
              required
              placeholder="password"
              className="form-control"
            />
            <button
              type="submit"
              onClick={doLogin}
              className="btn btn-primary"
              onKeyDown={(keyCode) => (keyCode === 13 ? doLogin : false)}
            >
              Login
            </button>
            <br />
            <br />
            <input
              type="text"
              id="email"
              placeholder="email"
              required={true}
              title="Your email will be shown to other logged-in members"
              className="form-control"
            />
            <i>Your email will be shown to logged-in members when sharing</i>
            <button onClick={doCreateUser} className="btn btn-warning">
              Create User
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
