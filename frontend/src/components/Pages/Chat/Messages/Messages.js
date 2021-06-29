import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { List, Avatar, Input, Button, Icon } from "antd";
import moment from "moment-timezone";
import { getThreadMessages } from "../../../../actions/chat";
import "../Chat.css";
import _ from "lodash";
import "../Chat.css";
const { TextArea } = Input;
const Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
var hasscroll = false;
class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: "",
      disabled: true,
      messages: []
    };
  }
  handleChange = e => {
    if (e.target.value == "") {
      this.setState({
        ...this.state,
        newMessage: e.target.value,
        disabled: true
      });
    } else {
      this.setState({
        ...this.state,
        newMessage: e.target.value,
        disabled: false
      });
    }
  };
  handleSendClick = () => {
    const { websocket } = this.props;
    let thread;

    if (this.props.thread) {
      thread = this.props.thread.id;
    } else {
      thread = null;
    }
    let chat_dict = {
      thread: thread,
      sender: this.props.user.id,
      receiver: this.props.otherUser.id,
      message: this.state.newMessage
    };
    try {
      websocket.send(JSON.stringify(chat_dict));
      this.setState({
        newMessage: ""
      });
    } catch (error) {
      console.log(error);
    }
  };
  handleScroll = e => {
    console.log("scroll");
    let element = e.target;

    if (!(element.scrollTop > 0)) {
      console.log("previous data call");
    }
    // if (element.scrollHeight - element.scrollTop === element.clientHeight) {
    //   // do something at end of scroll
    // }
  };
  componentDidUpdate(prevProps) {
    if (this.state.messages.length != 0) {
      this.refs[this.state.messages.length - 1].scrollIntoView({
        block: "end"
      });
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    var sorted = "";
    if (nextProps.thread) {
      sorted = _.orderBy(
        nextProps.thread.messages,
        ["timestamp"],
        ["desc"]
      ).reverse();
    }

    if (this.props.otherUser) {
      if (this.props.otherUser.id != nextProps.otherUser.id) {
        if (nextProps.thread) {
          console.log("1");
          this.setState({
            ...this.state,
            messages: sorted
          });
        } else {
          console.log("2");
          this.setState({
            ...this.state,
            messages: []
          });
          this.props.getThreadMessages(nextProps.otherUser.id);
        }
      } else {
        if (nextProps.thread) {
          console.log("3");
          this.setState({
            ...this.state,
            messages: (sorted = _.orderBy(
              this.props.thread.messages,
              ["timestamp"],
              ["desc"]
            ).reverse())
          });
        } else {
          if (nextProps.messages) {
            console.log("4");
            this.setState({
              ...this.state,
              messages: [...this.state.messages, ...nextProps.messages]
            });
          } else {
            console.log("5");
            this.setState({
              ...this.state,
              messages: [...this.state.messages]
            });
          }
        }
      }
    } else {
      if (nextProps.thread) {
        console.log("22");
        this.setState({
          ...this.state,
          messages: sorted
        });
      }
    }
  }

  render() {
    let otherUserInfo;
    let sendArea;
    if (this.props.otherUser) {
      otherUserInfo = (
        <h3 className="userChat">{this.props.otherUser.full_name}</h3>
      );
      sendArea = (
        <div className="col-sm-12 messageSend">
          <div className="col-sm-11">
            <TextArea
              placeholder="Type your message here "
              onChange={this.handleChange}
              onPressEnter={this.handleChange}
              value={this.state.newMessage}
              rows={2}
            />
          </div>
          <div className="col-sm-1">
            <Button
              type="primary"
              onClick={this.handleSendClick}
              disabled={this.state.disabled}
            >
              Send
            </Button>
          </div>
        </div>
      );
    }
    let msg = this.state.messages.length - 1;
    const { user } = this.props;
    const { otherUser } = this.props;

    return (
      <Fragment>
        {this.props.otherUser ? (
          <Fragment>
            {otherUserInfo}
            <List
              itemLayout="horizontal"
              // className="chatList"
              style={{ marginBottom: "1.5em" }}
              id="chatMain"
            >
              {/* {otherUserInfo} */}

              <div
                style={{ position: "relative" }}
                className="chatList"
                id="chatScroll"
                onScroll={this.handleScroll}
              >
                {this.state.messages.map(function (message, i) {
                  return (
                    <div
                      ref={i}
                      key={message.id}
                    // style={
                    //   hasscroll
                    //     ? {
                    //         position: "absolute",
                    //         bottom: (msg - i) * 75,
                    //         width: "100%"
                    //       }
                    //     : null
                    // }
                    >
                      {message.sender == user.id ? (
                        <List.Item key={message.id} id="UserMsgList">
                          <div className="col-sm-4"></div>
                          <div className="col-sm-7">
                            <List.Item.Meta
                              title={message.message}
                              description={moment(message.timestamp)
                                .tz(Timezone)
                                .format("LLLL")}
                              id="userMsgInfo"
                            />
                          </div>
                          <div className="col-sm-1">
                            <Avatar src={user.image} />
                          </div>
                        </List.Item>
                      ) : (
                        <List.Item key={message.id} id="OtherMsgList">
                          <div className="col-sm-1">
                            <Avatar src={otherUser.image} />
                          </div>
                          <div className="col-sm-7">
                            <List.Item.Meta
                              title={message.message}
                              description={moment(message.timestamp)
                                .tz(Timezone)
                                .format("LLLL")}
                              id="otherMsgInfo"
                            />
                          </div>
                          <div className="col-sm-4"></div>
                        </List.Item>
                      )}
                    </div>
                  );
                })}
              </div>

              <br />
            </List>
          </Fragment>
        ) : (
          <Fragment>
            <div
              itemLayout="horizontal"
              // className="chatList"
              style={{ marginBottom: "1.5em", marginTop: "2.8em" }}
              id="chatIcon"
            >
              <div style={{ paddingTop: "15em", paddingBottom: "28em" }}>
                {/* <Icon type="message" style={{ fontSize: "10em" }} /> */}
                <br />
                <h4>Let's Connect with People !!</h4>
              </div>
            </div>
          </Fragment>
        )}

        <div className="row">{sendArea}</div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.chat.messages
});
export default connect(mapStateToProps, { getThreadMessages })(Messages);
