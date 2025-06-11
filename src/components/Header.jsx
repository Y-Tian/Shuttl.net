import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faShoePrints,
  faBagShopping,
  faFeather,
  faCircleNotch,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <h1>Shuttl - Under Development</h1>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/rackets"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FontAwesomeIcon icon={faChevronRight} /> Rackets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shoes"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FontAwesomeIcon icon={faShoePrints} /> Shoes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bags"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FontAwesomeIcon icon={faBagShopping} /> Bags
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shuttles"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FontAwesomeIcon icon={faFeather} /> Shuttles
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/strings"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FontAwesomeIcon icon={faCircleNotch} /> Strings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/training"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FontAwesomeIcon icon={faDumbbell} /> Training
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
