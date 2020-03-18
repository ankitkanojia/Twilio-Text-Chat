import React, { Component } from 'react'
import $ from 'jquery';

class App extends Component {
 
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      username: null,
      channel: null,
    }
  }

  addMessage = (message) => {
    const messageData = { ...message, me: message.author === this.state.username }
    this.setState({
      messages: [...this.state.messages, messageData],
    })
  }

  componentDidMount = () => {
    this.getToken()
      .then(this.createChatClient)
      .then(this.joinGeneralChannel)
      .then(this.configureChannelEvents)
      .catch((error) => {
        this.addMessage({ body: `Error: ${error.message}` })
      })
  }

  getToken = () => {
    return new Promise((resolve, reject) => {
      this.addMessage({ body: 'Connecting...' })

      $.getJSON('/token', (token) => {
        this.setState({ username: token.identity })
        resolve(token)
      }).fail(() => {
        reject(Error('Failed to connect.'))
      })
    })
  }
  
  render() {
    return (
        <div className="container">
          <a target="_blank" href="https://github.com/ankitkanojia/twillio_videochat"><img className="githubribbon attachment-full size-full" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_green_007200.png?resize=149%2C149" alt="Fork me on GitHub" data-recalc-dims="1" /></a>
          <h2 className="mt-2">Twillio Real-Time Programmable Text Chat</h2>
          <form className="MessageForm" onSubmit={this.handleFormSubmit}>
            <div className="input-container">
              <input
                type="text"
                ref={(node) => (this.input = node)}
                placeholder="Enter your message..."
              />
            </div>
            <div className="button-container">
              <button type="submit">
                Send
          </button>
            </div>
          </form>
        </div>
    )
  }
}

export default App;
