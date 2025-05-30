import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud } from '@fortawesome/free-solid-svg-icons';

function Header() {
  return (
    <header className="header">
      <h1>Badminton Hub</h1>
      <nav>
        <ul>
          <li>
            <a href="#" className="active">
              <FontAwesomeIcon icon={faCloud} /> Rackets
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faCloud} /> Shoes
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faCloud} /> Bags
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faCloud} /> Shuttles
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;