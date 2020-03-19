import React, { Component } from 'react'
import $ from 'jquery'
import TwilioChat from 'twilio-chat';
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      username: null,
      channel: null,
      onlineuser: []
    }
  }

  componentDidMount = () => {
    this.getToken().then(this.createChatClient)
      .then(this.joinGeneralChannel)
      .then(this.configureChannelEvents)
      .catch((error) => {
        this.addMessage({ body: `Error: ${error.message}` })
      });
  }

  getUsers =() =>{
    this.props.getOnlineUsers();
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

  createChatClient = (token) => {
    return new Promise((resolve, reject) => {
      resolve(new TwilioChat(token.jwt))
    })
  }

  joinGeneralChannel = (chatClient) => {
    return new Promise((resolve, reject) => {
      chatClient.getSubscribedChannels().then(() => {
        chatClient.getChannelByUniqueName('general').then((channel) => {
          this.addMessage({ body: 'Joining general channel...' })
          this.setState({ channel })

          channel.join().then(() => {
            this.addMessage({ body: `Joined general channel as ${this.state.username}` })
            window.addEventListener('beforeunload', () => channel.leave())
          }).catch(() => reject(Error('Could not join general channel.')))

          resolve(channel)
        }).catch(() => this.createGeneralChannel(chatClient));
      }).catch(() => reject(Error('Could not get channel list.')))
    })
  }

  createGeneralChannel = (chatClient) => {
    return new Promise((resolve, reject) => {
      this.addMessage({ body: 'Creating general channel...' })
      chatClient
        .createChannel({ uniqueName: 'general', friendlyName: 'General Chat' })
        .then(() => this.joinGeneralChannel(chatClient))
        .catch(() => reject(Error('Could not create general channel.')))
    })
  }

  configureChannelEvents = (channel) => {

    channel.on('typingStarted', function (member) {
      console.log(member.identity + 'is currently typing.');
    });
    // Listen for members typing
    channel.on('typingEnded', function (member) {
      console.log(member.identity + 'has stopped typing.');
    });

    channel.on('messageAdded', ({ author, body }) => {
      this.addMessage({ author, body })
    })

    channel.on('memberJoined', (member) => {
      console.log('memberJoined');
      this.props.addUser(member.identity);
      this.addMessage({ body: `${member.identity} has joined the channel.` })
    })

    channel.on('memberLeft', (member) => {
      this.addMessage({ body: `${member.identity} has left the channel.` })
    })
  }

  addMessage = (message) => {
    const messageData = { ...message, me: message.author === this.state.username }
    this.setState({
      messages: [...this.state.messages, messageData],
    })
  }

  handleNewMessage = (text) => {
    if (this.state.channel) {
      this.state.channel.sendMessage(text)
    }
  }

  render() {
    return (
      <div className="wrap">
        <a target="_blank" href="https://github.com/ankitkanojia/Twilio_TextChat"><img className="githubribbon attachment-full size-full" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_green_007200.png?resize=149%2C149" alt="Fork me on GitHub" data-recalc-dims="1" /></a>
        <section className="right">
          <div className="wrap-chat">
            <div className="chat">
              <div class="chat-bubble me">
                <div class="my-mouth"></div>
                <div class="content">Hallo :) Mir gehts auch gut. Kaffee trinken geht bei mir morgen leider nicht, weil bin noch bis Freitag in Hagenberg :(
                  </div>
                {/* <div class="time">17:48</div> */}
              </div>
              <div class="chat-bubble you">
                <div class="your-mouth"></div>
                <h4>Linda Gahleitner</h4>
                <div class="content">Hallo! Wie gehts euch?</div>
              </div>
            </div>
          </div>
          <div className="wrap-message">
            <div className="message">
              <input type="text" className="input-message" placeholder="Send Message..." />
            </div>
            <i onClick={this.getUsers} style={{ color: "green", fontSize: "x-large" }} className="fa fa-paper-plane" aria-hidden="true"></i>
          </div>
        </section>
      </div>
    )
  }
}

export default App