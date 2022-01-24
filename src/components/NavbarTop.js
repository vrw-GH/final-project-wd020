import React from "react";
// import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import Background from "./Background.png";
import newLogo from "./newLogo.png";
// import newLogo2 from "./newLogo2.png"
// import newLogo1 from "./newLogo1.png"

const NavbarTop = ({
  APPDATA,
  handleSearchClick,
  handleClearQry,
  categories,
  currentUser,
}) => {
  return (
    <>
      {/* <Navbar sticky="top" id="nav" Collapse expand="md"> */}
      <Navbar sticky="top" id="nav" collapseOnSelect={true} expand="md">
        <Navbar.Brand
          href="/about"
          id="nav-about"
          onClick={handleClearQry}
          title={`${APPDATA.NAME} ver: ${APPDATA.VER} ${APPDATA.FLIGHT}`}
        >
          &nbsp;
          <img
            className="logo-2"
            id="LOGO"
            src={newLogo}
            alt="logo"
            width="50"
            height="50"
            title={`${APPDATA.NAME} - Home `}
          />
          &nbsp;{APPDATA.NAME}&nbsp;
          <i style={{ fontSize: "0.6rem" }}>
            {APPDATA.VER} {APPDATA.FLIGHT}
          </i>
        </Navbar.Brand>
        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Link
              to="/sharing"
              onClick={handleClearQry}
              // id="Link-sharing"
              id="nav-sharing"
              className="nav-link"
            >
              Sharing
            </Link>
            <Link
              to="/recipes"
              onClick={handleClearQry}
              id="nav-recipes"
              className="nav-link"
            >
              Recipes
            </Link>
          </Nav>

          <Nav className="me-auto">
            {currentUser?.userName ? (
              <>
                <NavDropdown
                  title="My Food"
                  className="nav-drop"
                  id="collapsible-nav-dropdown"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/myshare"
                    onClick={handleClearQry}
                    style={{ color: "black" }}
                    id="nav-myshare"
                    className="nav-link"
                  >
                    My Sharing
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/mytitles"
                    onClick={handleClearQry}
                    style={{ color: "black" }}
                    id="nav-mytitles"
                    className="nav-link"
                  >
                    My Recipes
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/newtitle"
                    onClick={handleClearQry}
                    style={{ color: "black" }}
                    id="nav-newtitle"
                    className="nav-link"
                  >
                    New Recipe
                  </NavDropdown.Item>
                </NavDropdown>
                <Link
                  to="/profile"
                  onClick={handleClearQry}
                  id="nav-profile"
                  className="nav-link"
                >
                  Profile
                </Link>
                <Link
                  to="/login"
                  onClick={handleClearQry}
                  id="nav-login"
                  className="nav-link"
                >
                  Logout
                </Link>

                <Navbar.Brand
                  id="nav-currentUser"
                  style={{ marginLeft: "30px", marginTop: "2px" }}
                >
                  <div>
                    {currentUser.profilePic ? (
                      <img
                        src={currentUser.profilePic}
                        height="32px"
                        alt="pic"
                        style={{ padding: 0, margin: 0 }}
                      />
                    ) : null}
                    &nbsp;{currentUser.userName}
                  </div>
                </Navbar.Brand>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleClearQry}
                  id="nav-login"
                  className="nav-link"
                >
                  Login
                </Link>
                <Link
                  to="/about"
                  onClick={handleClearQry}
                  title="About Us"
                  id="nav-about"
                  className="nav-link"
                >
                  About
                </Link>
              </>
            )}
          </Nav>

          <ReactBootStrap.Form className="d-flex">
            <ReactBootStrap.FormControl
              type="search"
              placeholder="Recipe search (in Title)"
              autoFocus
              className="me-2"
              aria-label="Search"
            />
            <ReactBootStrap.Button
              type="submit"
              variant="light"
              onClick={(e) => handleSearchClick(e)}
              id="nav-find"
            >
              Find
            </ReactBootStrap.Button>
          </ReactBootStrap.Form>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavbarTop;
