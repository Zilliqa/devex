import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/HomePage/HomePage'
import Layout from './components/Layout/Layout'
import DSBlocksPage from './components/ViewAllPages/DSBlocksPage/DSBlocksPage'
import TxBlocksPage from './components/ViewAllPages/TxBlocksPage/TxBlocksPage'
import TxnsPage from './components/ViewAllPages/TxnsPage/TxnsPage'
import * as serviceWorker from './serviceWorker'
import { NetworkProvider } from './services/networkProvider'

import './index.css'
import DSBlockDetailsPage from './components/DetailsPages/DSBlockDetailsPage/DSBlockDetailsPage'
import TxBlockDetailsPage from './components/DetailsPages/TxBlockDetailsPage/TxBlockDetailsPage'
import TxnDetailsPage from './components/DetailsPages/TxnDetailsPage/TxnDetailsPage'

ReactDOM.render(
  <>
    <Router>
      <NetworkProvider>
        <Layout>
          <React.StrictMode>
          <Route exact path="/" component={Home} />
          <Route exact path="/dsbk" component={DSBlocksPage} />
            <Route path={`/dsbk/:blockNum`}><DSBlockDetailsPage/></Route>
          <Route exact path="/txbk" component={TxBlocksPage} />
            <Route path={`/txbk/:blockNum`}><TxBlockDetailsPage/></Route>
          <Route exact path="/tx" component={TxnsPage} />
            <Route path={`/tx/:txnHash`}><TxnDetailsPage/></Route>
          </React.StrictMode>
        </Layout>
      </NetworkProvider>
    </Router>
  </>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
