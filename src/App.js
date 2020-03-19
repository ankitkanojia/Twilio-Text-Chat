import React, { Component } from 'react'
import $ from 'jquery'
import TwilioChat from 'twilio-chat'

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

          chatClient.getPublicChannelDescriptors().then(function(paginator) {
            console.log('called afte joined');
            for (var i = 0; i < paginator.items.length; i++) {
              const channel = paginator.items[i];
              console.log('Channel: ' + channel.friendlyName);
            }
          });

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

    channel.on('typingStarted', function(member) {
      console.log(member.identity + 'is currently typing.');
    });
    // Listen for members typing
    channel.on('typingEnded', function(member) {
      console.log(member.identity + 'has stopped typing.');
    });

    channel.on('messageAdded', ({ author, body }) => {
      this.addMessage({ author, body })
    })

    channel.on('memberJoined', (member) => {
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
        <section className="left">
          <div className="profile">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1089577/user.jpg" /> {this.state.username}
            <div className="icons">
              <i className="fa fa-sign-out" aria-hidden="true"></i>
            </div>
          </div>
          <div className="contact-list">
            {this.state.onlineuser &&
              this.state.onlineuser.map((data, index) => {
                return (<div className="contact" id={index}>
                  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1089577/contact7.JPG" alt="profilpicture" />
                  <div className="contact-preview">
                    <div className="contact-text">
                      <h1 className="font-name">{data}</h1>
                    </div>
                  </div>
                  <div className="contact-time"><p>&nbsp;</p></div>
                </div>
                )
              })
            }
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
            <i style={{ color: "green", fontSize: "x-large" }} className="fa fa-paper-plane" aria-hidden="true"></i>
          </div>
        </section>
      </div>
    )
  }
}

export default App;
