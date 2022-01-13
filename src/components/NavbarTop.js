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
      <Navbar id="nav" collapseOnSelect expand="md">
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
            >
              Sharing
            </ReactBootStrap.NavLink>

            <ReactBootStrap.NavLink
              to="/recipes"
              href="/recipes"
              onClick={handleClearQry}
            >
              Recipes
            </ReactBootStrap.NavLink>
          </Nav>

          <Nav className="me-auto">
            {currentUser ? (
              <>
               
                <NavDropdown title="My Food" id="collapsible-nav-dropdown">
                  <ul>
                    <li>
                      <NavLink
                        to="/myshare"
                        href="/myshare"
                        onClick={handleClearQry}
                        style={{ color: "black" }}
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
                >
                  Profile
                </ReactBootStrap.NavLink>
                <ReactBootStrap.NavLink
                  to="/login"
                  href="/login"
                  onClick={handleClearQry}
                >
                  Logout
                </ReactBootStrap.NavLink>
                <Navbar.Brand style={{ marginLeft:"30px", marginTop:"2px"}}>
                  {currentUser}:
                </Navbar.Brand>
              </>
            ) : (
              <>
                <ReactBootStrap.NavLink
                  to="/login"
                  href="/login"
                  onClick={handleClearQry}
                >
                  Login
                </ReactBootStrap.NavLink>
                <ReactBootStrap.NavLink
                  to="/about"
                  href="/about"
                  onClick={handleClearQry}
                  title="About Us"
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
              variant="warning"
              onClick={(e) => handleSearchClick(e)}
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
