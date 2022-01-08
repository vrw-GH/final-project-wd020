import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import "./App.css";
import "./loading.css";

import NavbarTop from "./components/NavbarTop";
import About from "./content/pages/About";
import Footer from "./content/pages/Footer";
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
} from "../package.json";

const APPDATA = {
  TITLE: appName || "App Name Not Set",
  NAME:
    appName
      .replace(/-/g, " ")
      .replace(/(^\w{1})|(\s+\w{1})/g, (chr) => chr.toUpperCase()) || "",
  PROJECT:
    appName.replace(/-/g, " ").toUpperCase() + ` (${appSuffix})` ||
    "Project Not Set",
  VER: appVer || "App version Not Set",
  INFO: appInfo || "App info not Set",
  HOME: "/",
  //---------------------------------------
  TITLEIMG: process.env.REACT_APP_IMG_TITLE || "/img-title.jpg",
  FOOTERIMG: process.env.REACT_APP_IMG_FOOTER || "/img-footer.jpg",
  BACKEND: process.env.REACT_APP_BACKEND || "localhost:5053",
  FRONTEND:
    process.env.REACT_APP_FRONTEND ||
    (process.env.HOST || "localhost") + ":" + (process.env.PORT || "3000"),
  DEVLEAD: process.env.REACT_APP_DEV_LEAD || "-",
  DEVTEAM: process.env.REACT_APP_DEV_TEAM || "",
  EMAIL: process.env.REACT_APP_DEV_EMAIL || "",
  PHONE: process.env.REACT_APP_DEV_PHONE || "",
  LOCATION: process.env.REACT_APP_DEV_ADDR || "",
  FLIGHT: process.env.REACT_APP_PROJECT_FLIGHT || "",
  DESCRIPTION: process.env.REACT_APP_PROJECT_DESCRIPTION || "-in development-",
};
document.title = "Welcome to " + APPDATA.NAME;
//-------------------------------------------------

function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [searchQry, setSearchQry] = useState("");
  const [categories, setCategories] = useState(["Lunch"]);
  const [loading, setLoading] = useState("");

  useEffect(() => {}, [loading]); //        to re-render when any loading event occurs

  useEffect(() => {
    setLoading("Loading ...");
    setCurrentUser(sessionStorage.getItem("currentUser"));
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        try {
          sessionStorage.setItem("APPDATA", APPDATA);
          const results = await axios.get(`${APPDATA.BACKEND}/api/categories/`);
          setCategories(results.data.tuples);
          setLoading("");
        } catch (error) {
          setLoading(error.message);
        }
      })();
    }
    return () => {
      isLoaded = false; //           avoids a mem leak (of the promise) on unloaded component
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
      <NavbarTop
        APPDATA={APPDATA}
        handleSearchClick={handleSearchClick}
        handleClearQry={handleClearQry}
        categories={categories}
        currentUser={currentUser}
      />
      {loading ? (
        <>
          <div className="loading_container">
            <div className="loading"></div>
            <h4>{loading}</h4>
          </div>
        </>
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
              <Route
                path="/"
                exact
                element={
                  <Sharing
                    loading={loading}
                    categories={categories}
                    APPDATA={APPDATA}
                  />
                }
              />
              <Route
                path="/about"
                exact
                element={<About APPDATA={APPDATA} />}
              />

              <Route
                path="/recipes"
                exact
                element={
                  <Recipes
                    loading={loading}
                    categories={categories}
                    APPDATA={APPDATA}
                  />
                }
              />

              <Route
                path="/sharing"
                exact
                element={
                  <Sharing
                    loading={loading}
                    categories={categories}
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
                      <MyShares
                        currentUser={currentUser}
                        // categories={categories}
                        APPDATA={APPDATA}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/mytitles"
                    element={
                      <MyRecipes
                        currentUser={currentUser}
                        // categories={categories}
                        APPDATA={APPDATA}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/newtitle"
                    element={
                      <CreateTitle
                        currentUser={currentUser}
                        categories={categories}
                        APPDATA={APPDATA}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/profile"
                    element={
                      <MyProfile currentUser={currentUser} APPDATA={APPDATA} />
                    }
                  />
                </>
              ) : null}
              <Route
                exact
                path="/categories/:category"
                element={<Category categories={categories} APPDATA={APPDATA} />}
              />

              <Route
                exact
                path="/recipes/:id" //                          TODO: change recipes route to "entry"
                element={
                  <SingleTitle categories={categories} APPDATA={APPDATA} />
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
