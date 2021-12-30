import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import * as ReactBootStrap from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NavbarTop = ({
  APPDATA,
  handleSearchClick,
  handleClearQry,
  categories,
  currentUser,
}) => {
  let key = 0;
  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Navbar.Brand href="/" onClick={handleClearQry}>
          {APPDATA.NAME}
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <ReactBootStrap.NavLink to="/" href="/" onClick={handleClearQry}>
              Home
            </ReactBootStrap.NavLink>
            <NavDropdown title="Categories" id="collapsible-nav-dropdown">
              <ul>
                {categories.map((item) => (
                  <li key={key++}>
                    <NavLink
                      to={`categories/${item.name}`}
                      href={item.name}
                      onClick={handleClearQry}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </NavDropdown>
          </Nav>

          <Nav className="me-auto">
            {currentUser ? null : (
              <ReactBootStrap.NavLink
                to="/login"
                href="/login"
                onClick={handleClearQry}
              >
                Login
              </ReactBootStrap.NavLink>
            )}

            {currentUser ? (
              <>
                <NavDropdown
                  title={currentUser + "'s Recipes"}
                  id="collapsible-nav-dropdown"
                >
                  <ul>
                    <li>
                      <NavLink
                        to="/newtitle"
                        href="/newtitle"
                        onClick={handleClearQry}
                      >
                        Create a Title
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/login"
                        href="/login"
                        onClick={handleClearQry}
                      >
                        Logout
                      </NavLink>
                    </li>{" "}
                  </ul>
                </NavDropdown>
              </>
            ) : null}

            {/* <ReactBootStrap.NavLink to="/" href="/" onClick={handleClearQry}>
              Contact
            </ReactBootStrap.NavLink> */}
          </Nav>

          <ReactBootStrap.Form className="d-flex">
            <ReactBootStrap.FormControl
              type="search"
              placeholder="Search in Titles"
              autoFocus
              className="me-2"
              aria-label="Search"
            />
            <ReactBootStrap.Button
              type="submit"
              onClick={(e) => handleSearchClick(e)}
            >
              Search
            </ReactBootStrap.Button>
          </ReactBootStrap.Form>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavbarTop;
