import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Background from "./Background.png";

const NavbarTop = ({
  APPDATA,
  handleSearchClick,
  handleClearQry,
  categories,
  currentUser,
}) => {
  return (
    <>
      <Navbar sticky="top" id="nav" Collapse expand="md">
        <Navbar.Brand
          href="/about"
          onClick={handleClearQry}
          title={APPDATA.NAME + " ver: " + APPDATA.VER}
        >
          &nbsp;
          <img
            id="LOGO"
            src={Background}
            alt="logo"
            width="50"
            height="50"
            title={APPDATA.NAME + " ver: " + APPDATA.VER}
          />
          &nbsp;{APPDATA.NAME}&nbsp;
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            {/* <ReactBootStrap.NavLink
              to="/sharing"
              href="/sharing"
              onClick={handleClearQry}
              id="nav-sharing"
            >
              Sharing
            </ReactBootStrap.NavLink> */}
            <Link
              to="/sharing"
              onClick={handleClearQry}
              id="nav-sharing"
              className="nav-link"
            >
              Sharing
            </Link>
            <Link
              to="/recipes"
              onClick={handleClearQry}
              id="nav-sharing"
              className="nav-link"
            >
              Recipes
            </Link>
          </Nav>

          <Nav className="me-auto">
            {currentUser ? (
              <>
                <NavDropdown
                  title="My Food"
                  className="nav-drop"
                  id="collapsible-nav-dropdown"
                >
                  <ul>
                    <li>
                      <Link
                        to="/myshare"
                        // href="/myshare"
                        onClick={handleClearQry}
                        style={{ color: "black" }}
                        id="nav-sharing"
                      >
                        My Sharing
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/mytitles"
                        // href="/mytitles"
                        onClick={handleClearQry}
                        style={{ color: "black" }}
                        id="nav-sharing"
                      >
                        My Recipes
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/newtitle"
                        // href="/newtitle"
                        onClick={handleClearQry}
                        style={{ color: "black" }}
                        id="nav-sharing"
                      >
                        New Recipe
                      </Link>
                    </li>
                  </ul>
                </NavDropdown>
                <Link
                  to="/profile"
                  onClick={handleClearQry}
                  id="nav-sharing"
                  className="nav-link"
                >
                  Profile
                </Link>
                <Link
                  to="/login"
                  onClick={handleClearQry}
                  id="nav-sharing"
                  className="nav-link"
                >
                  Logout
                </Link>

                <Navbar.Brand
                  id="nav-user"
                  style={{ marginLeft: "30px", marginTop: "2px" }}
                >
                  {currentUser}
                </Navbar.Brand>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleClearQry}
                  id="nav-sharing"
                  className="nav-link"
                >
                  Login
                </Link>
                <Link
                  to="/about"
                  onClick={handleClearQry}
                  title="About Us"
                  id="nav-sharing"
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
