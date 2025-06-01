import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faShoePrints, faBagShopping, faFeather } from '@fortawesome/free-solid-svg-icons';

function Header() {
  return (
    <header className="header">
      <h1>Shuttl</h1>
      <nav>
        <ul>
          <li>
            <a href="#" className="active">
              <FontAwesomeIcon icon={faChevronRight} /> Rackets
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faShoePrints} /> Shoes
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faBagShopping} /> Bags
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faFeather} /> Shuttles
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;