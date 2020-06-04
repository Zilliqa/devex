import React from 'react'

import Dashboard from './Dashboard/Dashboard'
import Searchbar from './Searchbar/Searchbar'

/*
            Home Layout
    ++++++++++++++++++++++++++++
    |        Search Bar        |
    ++++++++++++++++++++++++++++
    |                          |
    |                          |
    |        Dashboard         |
    |                          |
    |                          |
    ++++++++++++++++++++++++++++
*/
const HomePage: React.FC = () => {
  return (
    <div>
      <Searchbar />
      <Dashboard />
    </div>
  );
}

export default HomePage;
