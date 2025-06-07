import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faShoePrints, faBagShopping, faFeather, faCircleNotch, faDumbbell } from '@fortawesome/free-solid-svg-icons';

function Header() {
  return (
    <header className="header">
      <h1>Shuttl</h1>
      <nav>
        <ul>
          <li>
            <a href="rackets" className="active">
              <FontAwesomeIcon icon={faChevronRight} /> Rackets
            </a>
          </li>
          <li>
            <a href="shoes">
              <FontAwesomeIcon icon={faShoePrints} /> Shoes
            </a>
          </li>
          <li>
            <a href="bags">
              <FontAwesomeIcon icon={faBagShopping} /> Bags
            </a>
          </li>
          <li>
            <a href="shuttles">
              <FontAwesomeIcon icon={faFeather} /> Shuttles
            </a>
          </li>
          <li>
            <a href="strings">
              <FontAwesomeIcon icon={faCircleNotch} /> Strings
            </a>
          </li>
          <li>
            <a href="training">
              <FontAwesomeIcon icon={faDumbbell} /> Training
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;