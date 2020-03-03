import React, { Component } from 'react'
import './global.css';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <h2>Dashboard</h2>
      </React.Fragment>
    )
  }
}

export default App;
