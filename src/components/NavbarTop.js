import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import * as ReactBootStrap from "react-bootstrap";
import { NavLink } from "react-router-dom";
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
      <Navbar sticky="top" id="nav" collapseOnSelect expand="md">
        <Navbar.Brand href="/about" onClick={handleClearQry} title="About Us">
          &nbsp;
          <img id="LOGO"
            src={Background}
            alt="logo"
            width="50"
            height="50"
            title={APPDATA.NAME}
          />
          &nbsp;{APPDATA.NAME}&nbsp;
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <ReactBootStrap.NavLink
              to="/sharing"
              href="/sharing"
              onClick={handleClearQry}
              id="nav-sharing"
            >
              Sharing
            </ReactBootStrap.NavLink>

            <ReactBootStrap.NavLink
              to="/recipes"
              href="/recipes"
              onClick={handleClearQry}
              id="nav-sharing"
            >
              Recipes
            </ReactBootStrap.NavLink>
          </Nav>

          <Nav className="me-auto">
            {currentUser ? (
              <>
               
                <NavDropdown title="My Food" className="nav-drop" id="collapsible-nav-dropdown">
                  <ul>
                    <li>
                      <NavLink
                        to="/myshare"
                        href="/myshare"
                        onClick={handleClearQry}
                        style={{ color: "black" }}
                        id="nav-sharing"
                      >
                        My Sharing
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/mytitles"
                        href="/mytitles"
                        onClick={handleClearQry}
                        style={{ color: "black" }}
                        id="nav-sharing"
                      >
                        My Recipes
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/newtitle"
                        href="/newtitle"
                        onClick={handleClearQry}
                        style={{ color: "black" }}
                        id="nav-sharing"
                      >
                        New Recipe
                      </NavLink>
                    </li>
                  </ul>
                </NavDropdown>
                <ReactBootStrap.NavLink
                  to="/profile"
                  href="/profile"
                  onClick={handleClearQry}
                  id="nav-sharing"
                >
                  Profile
                </ReactBootStrap.NavLink>
                <ReactBootStrap.NavLink
                  to="/login"
                  href="/login"
                  onClick={handleClearQry}
                  id="nav-sharing"
                >
                  Logout
                </ReactBootStrap.NavLink>
                <Navbar.Brand  id="nav-user" style={{ marginLeft:"30px", marginTop:"2px"}}>
                  {currentUser}:
                </Navbar.Brand>
              </>
            ) : (
              <>
                <ReactBootStrap.NavLink
                  to="/login"
                  href="/login"
                  onClick={handleClearQry}
                  id="nav-sharing"
                >
                  Login
                </ReactBootStrap.NavLink>
                <ReactBootStrap.NavLink
                  to="/about"
                  href="/about"
                  onClick={handleClearQry}
                  title="About Us"
                  id="nav-sharing"
                >
                  About
                </ReactBootStrap.NavLink>
              </>
            )}
          </Nav>

          <ReactBootStrap.Form className="d-flex">
            <ReactBootStrap.FormControl
              type="search"
              placeholder="Keyword search (in Title)"
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
