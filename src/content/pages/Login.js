import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./_Page.css";

const Login = ({ setCurrentUser, APPDATA }) => {
  const [loginMsg, setLoginMsg] = useState("");
  const navigate = useNavigate();
  let username = "";

  useEffect(() => {
    if (sessionStorage.getItem("currentUser")) {
      sessionStorage.removeItem("currentUser");
      setCurrentUser({});
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
      const user = {
        userName: result.data.tuple[0].username,
        profilePic: result.data.tuple[0].profilepic,
      };
      setCurrentUser(user);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      setLoginMsg(`"${user.userName}" - succesfully logged in!`);
      navigate("/myshare");
    } catch (error) {
      console.log(error);
      setLoginMsg(`No such User. Please try again.`);
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

      const user = {
        userName: result.data.tuple[0].username,
        profilePic: result.data.tuple[0].profilepic,
      };
      setCurrentUser(user);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      setLoginMsg(result.data.info.message);
      username = "";
      navigate(-1);
    } catch (error) {
      setLoginMsg(error + " Please try again.");
    }
  };

  const goBack = () => {
    setLoginMsg("");
    navigate("/login");
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
            <div className="page-error">{loginMsg}</div>
            <br />
            <br />
            <button
              onClick={goBack}
              className="btn btn-light"
              autoFocus
              onKeyDown={(keyCode) => (keyCode === 13 ? () => goBack : false)}
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
              style={{ marginTop: "20px" }}
              type="submit"
              onClick={doLogin}
              className="btn btn-light"
              id="nav-find"
              onKeyDown={(keyCode) => (keyCode === 13 ? doLogin : false)}
            >
              Login
            </button>
            <br />
            <i>
              New User? Please enter above and additionally the email below..
            </i>
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
            <button
              style={{ marginTop: "20px" }}
              onClick={doCreateUser}
              id="nav-find"
              className="btn btn-light"
            >
              Create User
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
