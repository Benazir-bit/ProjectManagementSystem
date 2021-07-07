import React, { Component, Fragment } from "react";
import { Menu, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { createHashHistory } from "history";
import { getNotifications } from "../../../../actions/notifications";
import { connect } from "react-redux";
import TimeAgo from "react-timeago";
import {
  BellOutlined
} from "@ant-design/icons";
var wsStart = "ws://";
if (window.location.protocol === "https:") {
  wsStart = "wss://";
}
var endpoint = wsStart + window.location.host;
const history = createHashHistory();

class Notification extends Component {
  // ws = new WebSocket(`ws://localhost:8000/notifications/?token=${localStorage.getItem("token")}`);
  ws = new WebSocket(
    `${endpoint}/notifications/?token=${localStorage.getItem("token")}`
  );
  state = {
    count: 0,
    notifications: [],
    connected: false
  };
  componentWillMount() {
    this.props.getNotifications();
  }

  notiBoxClick = () => {
    if (this.state.count > 0) {
      this.ws.send("read-all");
    }
    this.setState({
      count: 0
    });
  };

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the //console
      //console.log("connected");
      this.setState({
        connected: true
      });
    };
    this.ws.onmessage = evt => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      //this.setState({ dataFromServer: message })
      //console.log(message);
      this.setState({
        ...this.state,
        count: this.state.count + 1
      });
      this.state.notifications.unshift(message);
    };

    this.ws.onclose = () => {
      //console.log("disconnected");
      this.setState({
        connected: false
      });
      // automatically try to reconnect on connection loss
    };
    this.ws.onerror = err => {
      //console.log(err);
      this.setState({
        connected: false
      });
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        count: this.props.unread_count,
        notifications: this.props.notifications
      });
    }
  }

  notiUrlcClick(type, id) {
    // //console.log("get notification url", e.key);
    //console.log(type, id);
    let path = "/";
    if (type === "task") {
      path = `/task-details/${id}`;
    } else if (type === "project") {
      path = `/project-details/${id}`;
    } else if (type === "issue") {
      path = `/issue-details/${id}`;
    }
    history.push(path);
  }

  render() {
    if (!this.props.notifications) {
      return null;
    }
    //console.log(this.state.notifications, "RENDER");

    const noti = (
      <Fragment>
        <div className="row" id="noti_span">
          <span>Notifications</span>
        </div>
        <Menu className="notify_drop_down">
          {this.state.notifications.map((notification, i) => (
            <Menu.Item
              key={notification.id}
              onClick={() =>
                this.notiUrlcClick(notification.nf_type, notification.target.id)
              }
              className="header_menu_items"
            >
              <div className="ant-list-item-meta antd-pro-components-notice-icon-notice-list-meta">
                <div className="ant-list-item-meta-avatar">
                  <span className="ant-avatar antd-pro-components-notice-icon-notice-list-avatar ant-avatar-circle ant-avatar-image">
                    <img
                      src={
                        notification.actor === "System Admin"
                          ? ""
                          : notification.actor.image
                      }
                    />
                  </span>
                </div>
                <div className="ant-list-item-meta-content">
                  <h5 className="ant-list-item-meta-title">
                    <div
                      className="antd-pro-components-notice-icon-notice-list-title"
                      style={{ textAlign: "left", fontSize: "12px" }}
                    >
                      <b>{notification.actor.full_name} </b>
                      {notification.verb}
                      <div className="antd-pro-components-notice-icon-notice-list-extra" />
                    </div>
                  </h5>
                  <div className="ant-list-item-meta-description">
                    <div>
                      <div className="antd-pro-components-notice-icon-notice-list-description" />
                      <div
                        className="antd-pro-components-notice-icon-notice-list-datetime"
                        style={{ textAlign: "left", fontSize: "12px" }}
                      >
                        {/* <Icon type="clock-circle" /> */}
                        {/* <BellOutlined /> */}
                        <TimeAgo date={notification.created} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Menu.Item>
            // <Menu.Divider />
          ))}
        </Menu>
        <div className="row" id="noti_span">
          <span>
            <Link to="/notifications/all/">View All</Link>
          </span>
        </div>
      </Fragment>
    );
    return (
      <Fragment>
        <Dropdown
          overlay={noti}
          getPopupContainer={trigger => trigger.parentNode}
          trigger={["click"]}
          overlayClassName={"notificationScroll"}
        // style={{ left: "-8px" }}
        >
          <Link
            onClick={this.state.connected ? this.notiBoxClick : null}
            className="ant-dropdown-link"
            to="/"
          >
            {/* <Anchor className={"header_anchor"}> */}
            <p className={"header_icon_link"}>
              <BellOutlined className={"header_icon"} />
              {/* <Icon className={"header_icon"} type="bell" theme="filled" /> */}
            </p>
            {/* </Anchor> */}
          </Link>
        </Dropdown>
        {/* style={{display: 'none'}} */}
        <div
          className="notifications-count"
          style={{ position: "absolute", left: "22px", marginTop: "-17px" }}
        >
          <div
            style={{ fontSize: "11px", marginLeft: "3px", marginTop: "-22px" }}
          >
            <span className="label label-danger label-indicator animation-floating notification-counter">
              {this.state.count === 0 ? null : this.state.count}
            </span>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  unread_count: state.notifications.unread_count,
  notifications: state.notifications.notifications
});
export default connect(mapStateToProps, { getNotifications })(Notification);
