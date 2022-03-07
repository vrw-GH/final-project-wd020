import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Marquee from "react-easy-marquee";
// Local components
import NavbarTop from "./components/NavbarTop";
import Loading from "./components/Loading";
// Local content
import Header from "./content/pages/Header";
import Footer from "./content/pages/Footer";
import About from "./content/pages/About";
import Recipes from "./content/pages/Recipes";
import Sharing from "./content/pages/Sharing";
import Login from "./content/pages/Login";
import Category from "./content/pages/Category.js";
import SingleTitle from "./content/pages/SingleTitle";
import SearchTitles from "./content/pages/SearchTitles";
import MyProfile from "./content/pages/MyProfile";
import MyRecipes from "./content/pages/MyRecipes";
import MyShares from "./content/pages/MyShares";
import CreateTitle from "./content/pages/CreateTitle";
//-------------------------------------------------
import {
  name as appName,
  suffix as appSuffix,
  version as appVer,
  info as appInfo,
  homepage as appHomepage,
} from "../package.json";

const APPDATA = {
  TITLE: appName || "New App Name",
  NAME:
    appName
      .replace(/-/g, " ")
      .replace(/(^\w{1})|(\s+\w{1})/g, (chr) => chr.toUpperCase()) || "",
  PROJECT:
    appName.replace(/-/g, " ").toUpperCase() + ` (${appSuffix})` ||
    "Project Not Set",
  VER: appVer || "0.1.0",
  INFO: appInfo || "App info not Set",
  // HOME: "/",
  //---------------------------------------
  TITLEIMG: process.env.REACT_APP_IMG_TITLE || "/img-title.jpg",
  FOOTERIMG: process.env.REACT_APP_IMG_FOOTER || "/img-footer.jpg",
  //---------------------------------------
  BACKEND: process.env.REACT_APP_BACKEND || "http://127.0.0.1:5000",
  FRONTEND:
    process.env.REACT_APP_FRONTEND ||
    (process.env.HOST || "https://127.0.0.1") +
      ":" +
      (process.env.PORT || "3000"),
  DEVLEAD: process.env.REACT_APP_DEV_LEAD || "Victor Wright",
  DEVTEAM: process.env.REACT_APP_DEV_TEAM || "",
  EMAIL: process.env.REACT_APP_DEV_EMAIL || "victor.wright@outlook.de",
  PHONE: process.env.REACT_APP_DEV_PHONE || "+49 176 4677 4278",
  LOCATION: process.env.REACT_APP_DEV_ADDR || "83707, Germany",
  MODE: process.env.REACT_APP_PROJECT_MODE || process.env.NODE_ENV || "Dev",
  DESCRIPTION: process.env.REACT_APP_PROJECT_DESCRIPTION || "-in development-",
  WEBSITE: appHomepage || process.env.HOST || "http://127.0.0.1",
  HOST: process.env.HOST || appHomepage || "http://127.0.0.1",
  PORT: process.env.PORT || 5000,
  ROOT: "/",
};
document.title = "Welcome to " + APPDATA.NAME;
//-------------------------------------------------

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [searchQry, setSearchQry] = useState("");
  const [loading, setLoading] = useState("");

  useEffect(() => {}, [loading]); //  to re-render when any loading event occurs

  useEffect(() => {
    setLoading("Loading ...");
    setCurrentUser(JSON.parse(sessionStorage.getItem("currentUser")));
    sessionStorage.setItem("APPDATA", JSON.stringify(APPDATA));
    window.scrollTo(0, 0);
    setLoading("");
    return () => {
      sessionStorage.clear();
      localStorage.clear();
    };
  }, []);

  const handleSearchClick = (e) => {
    e.preventDefault();
    if (e.target.form[0].value !== "") {
      setSearchQry(e.target.form[0].value);
      e.target.form[0].value = "";
    } else {
      alert("Please enter something in search");
    }
  };

  const handleClearQry = () => setSearchQry("");

  return (
    <>
      {APPDATA.MODE.substring(0, 4).toUpperCase() !== "PROD" ? (
        <Marquee
          duration="20000"
          height="1rem"
          background="red"
          pauseOnHover={true}
        >
          <div style={{ fontSize: 10 }} title="Change MODE in process.env">
            App is in {APPDATA.MODE} Mode (this will not show in poduction mode)
          </div>
        </Marquee>
      ) : null}
      <Header APPDATA={APPDATA} />
      <NavbarTop
        APPDATA={APPDATA}
        handleSearchClick={handleSearchClick}
        handleClearQry={handleClearQry}
        currentUser={currentUser}
      />
      {loading ? (
        <Loading text={loading} />
      ) : (
        <>
          {searchQry ? (
            <SearchTitles
              searchQry={searchQry}
              handleClearQry={handleClearQry}
              APPDATA={APPDATA}
            />
          ) : (
            <Routes>
              <Route path="/" exact element={<About APPDATA={APPDATA} />} />
              <Route
                path="/about"
                exact
                element={<About APPDATA={APPDATA} />}
              />
              <Route
                path="/sharing"
                exact
                element={<Sharing APPDATA={APPDATA} />}
              />
              <Route
                path="/recipes"
                exact
                element={
                  <Recipes
                    // loading={loading}
                    // categories={categories}
                    APPDATA={APPDATA}
                  />
                }
              />
              <Route
                exact
                path="/login"
                element={
                  <Login setCurrentUser={setCurrentUser} APPDATA={APPDATA} />
                }
              />
              {currentUser ? (
                <>
                  <Route
                    exact
                    path="/myshare"
                    element={
                      <MyShares currentUser={currentUser} APPDATA={APPDATA} />
                    }
                  />
                  <Route
                    exact
                    path="/mytitles"
                    element={
                      <MyRecipes currentUser={currentUser} APPDATA={APPDATA} />
                    }
                  />
                  <Route
                    exact
                    path="/newtitle"
                    element={
                      <CreateTitle
                        currentUser={currentUser}
                        // categories={categories}
                        APPDATA={APPDATA}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/profile"
                    element={
                      <MyProfile
                        setCurrentUser={setCurrentUser}
                        APPDATA={APPDATA}
                      />
                    }
                  />
                </>
              ) : null}
              <Route
                exact
                path="/categories/:category"
                // element={<Category categories={categories} APPDATA={APPDATA} />}
                element={<Category APPDATA={APPDATA} />}
              />
              <Route
                exact
                path="/recipes/:id"
                element={<SingleTitle APPDATA={APPDATA} />}
              />
              <Route
                path="/*"
                element={
                  <div
                    style={{
                      margin: "8rem",
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    🤫 Page Not Found!
                  </div>
                }
              />
            </Routes>
          )}
        </>
      )}
      <div>
        <Footer APPDATA={APPDATA} />
      </div>
    </>
  );
}

export default App;
