import React, { Component } from 'react'

class App extends Component {
  render() {
    return (
      <div className="wrap">
        <section className="left">
          <div className="profile">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1089577/user.jpg" />
            <div className="icons">
              <i className="fa fa-sign-out" aria-hidden="true"></i>
            </div>
          </div>
          <div className="contact-list"><div className="contact" id="6">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1089577/contact7.JPG" alt="profilpicture" />
            <div className="contact-preview">
              <div className="contact-text">
                <h1 className="font-name">Cool Kids</h1>
              </div>
            </div>
            <div className="contact-time"><p>&nbsp;</p></div>
          </div>
          </div>
        </section>

        <section className="right">

          <div className="wrap-chat">
            <div className="chat"></div>
            <div className="information"></div>
          </div>
          <div className="wrap-message">
            <div className="message">
              <input type="text" className="input-message" placeholder="Send Message..." />
            </div>
            <i style={{ color: "green", fontSize:"x-large"}} className="fa fa-paper-plane" aria-hidden="true"></i>
          </div>
        </section>
      </div>
    )
  }
}

export default App;
