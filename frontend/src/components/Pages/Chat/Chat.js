import React, { Component, Fragment } from "react";
import { Layout, Input, Tabs, Icon } from "antd";
import { connect } from "react-redux";
import Contacts from "./Contacts/Contacts";
import Threads from "./Threads/Threads";
import Messages from "./Messages/Messages";
import { getAllThreads } from "../../../actions/chat";

const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

var wsStart = "ws://";
if (window.location.protocol == "https:") {
  wsStart = "wss://";
}
var endpoint = wsStart + window.location.host;

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: null,
      currentThread: null,
      currentContact: null,
      threadAvailable: false
    };
  }
  ws = new WebSocket(
    `${endpoint}/chat/?token=${localStorage.getItem("token")}`
  );

  handleContactSelect = other_user => {
    let index = _.findIndex(this.state.threads, function (thread) {
      return thread.other_user.id == other_user.id;
    });

    if (index != -1) {
      this.setState({
        ...this.state,
        currentThread: this.state.threads[index],
        currentContact: other_user
      });
    } else {
      this.setState({
        ...this.state,
        currentThread: null,
        currentContact: other_user
      });
    }
  };

  handleIncomingThread = newThread => {
    let index = _.findIndex(this.state.threads, function (thread) {
      return thread.id == newThread.id;
    });
    if (index != -1) {
      const threads_copy = this.state.threads.slice();
      threads_copy[index].last_updated = newThread.last_updated;
      threads_copy[index].messages.push(newThread.messages[0]);
      this.setState({
        ...this.state,
        threads: threads_copy
      });
      if (this.state.currentThread) {
        if (this.state.currentThread.id === newThread.id) {
          this.setState({
            ...this.state,
            currentThread: this.state.threads[index],
            currentContact: newThread.other_user
          });
        }
      }
    } else {
      let updated_threads = this.state.threads;
      updated_threads.push(newThread);
      this.setState({
        ...this.state,
        threads: updated_threads
      });
      if (this.state.currentContact) {
        if (this.state.currentContact.id == newThread.other_user.id) {
          this.setState({
            ...this.state,
            currentThread: newThread
          });
        }
      }
    }
  };

  componentDidMount() {
    this.props.getAllThreads();
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
      //   this.setState({
      //     connected: true
      //   });
    };
    this.ws.onmessage = evt => {
      const thread = JSON.parse(evt.data);
      this.handleIncomingThread(thread);
    };

    this.ws.onclose = () => {
      console.log("disconnected");
      //   this.setState({
      //     connected: false
      //   });
      // automatically try to reconnect on connection loss
    };
    this.ws.onerror = err => {
      console.log(err);
      //   this.setState({
      //     connected: false
      //   });
    };
  }

  handleThreadSelect = thread => {
    this.setState({
      currentThread: thread,
      currentContact: thread.other_user
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.isThreadLoading) {
      this.setState({
        ...this.state,
        threads: nextProps.threads
      });
    }
  }
  render() {
    return (
      <Fragment>
        <Content>
          <div
            className="col-sm-11"
            id="base-main-body"
          // style={{ padding: "0em" }}
          >
            <div className="row">
              <div className="col-sm-12">
                <br />
                <div id="main-body-div">
                  <Messages
                    thread={this.state.currentThread}
                    user={this.props.auth_user}
                    otherUser={this.state.currentContact}
                    websocket={this.ws}
                  />
                </div>
              </div>
            </div>
          </div>
        </Content>
        <div
          style={{
            // height: "100%",
            // height: "896px",
            width: "16%",
            paddingLeft: "2em",
            backgroundColor: "#f9f9f9",
            marginTop: "3.7em"
            // position: "fixed"
          }}
        >
          <Search
            placeholder="input search text"
            onSearch={value => console.log(value)}
            style={{
              width: "auto",
              alignItems: "center",
              marginTop: "15px"
            }}
          />
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  {/* <Icon type="history" /> */}
                  Chat
                </span>
              }
              key="1"
            >
              <Threads
                threads={this.state.threads}
                handleThreadSelect={this.handleThreadSelect}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  {/* <Icon type="contacts" /> */}
                  Contacts
                </span>
              }
              key="2"
            >
              <Contacts handleContactSelect={this.handleContactSelect} />
            </TabPane>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isThreadLoading: state.chat.isThreadLoading,
  threads: state.chat.threads,
  auth_user: state.auth.user
});

export default connect(mapStateToProps, { getAllThreads })(Chat);
