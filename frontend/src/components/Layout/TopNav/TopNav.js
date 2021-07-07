import React, { Component } from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import "./TopNav.css";
import {
  LogoutOutlined,
  EditOutlined,
  InboxOutlined,
  // HomeOutlined,
} from "@ant-design/icons";
import { logout } from "../../../actions/auth";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import defaultProfile from "../SideNav/default.png";
import Notification from "./Notification/Notification";

const { Header } = Layout;

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }
  handleMenuClick = (e) => {
    const key = parseInt(e.key);
    if (key === 1) {
      this.child.showModal();
    } else if (key === 3) {
      this.props.logout();
    }
  };

  render() {
    const msg = props => (
      <Menu
        defaultSelectedKeys={["0"]}
        className="msg_drop_down"
        multiple={true}
      >
        <div className="row" id="mail_span">
          <span>intraMail</span>
        </div>
        {/* <div id="mail_scroll"> */}
        <Menu.Item {...props} key="1" className="mail-notification-box">
          <div className="row">
            <Link to="/weekly_status/new_status/">
              <EditOutlined className={"header_icon"} />
              <strong>New Status Report</strong>
            </Link>
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item {...props} key="2" className="mail-notification-box">
          <div className="row">
            <Link to="/weekly_status/inbox/" id="inbox_link">
              <InboxOutlined className={"header_icon"} />

              <strong>
                Inbox
                <span className="badge" id="unread_mail_body" />
              </strong>
            </Link>
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item {...props} key="3" className="mail-notification-box">
          <div className="row">
            <Link to="/weekly_status/inbox/" id="inbox_link">
              <InboxOutlined className={"header_icon"} type="inbox" />

              <strong>
                Sent <span className="badge" id="unread_mail_body" />
              </strong>
            </Link>
          </div>
        </Menu.Item>
        {/* </div> */}
        <div className="row" id="mail_span">
          <span />
        </div>
      </Menu>
    );

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="3" icon={<LogoutOutlined />}>
          Logout
        </Menu.Item>
      </Menu>
    );
    return (
      <Header
        className="topHeader"
        style={{
          // position: "fixed",
          // zIndex: 3,
          width: "100%",
          background: "white",
        }}
      >

        <div className="ant-pro-global-header ant-pro-global-header-layout-side">
          <Menu theme="light" mode="horizontal" selectable={false} >
            <Menu.Item>
              <Notification />
            </Menu.Item>
          </Menu>
          <div className="antd-pro-components-global-header-index-right">

            <Dropdown overlay={menu} trigger={["click"]}>
              <span
                className="antd-pro-components-global-header-index-action 
                        antd-pro-components-global-header-index-account ant-dropdown-trigger"
              >
                <span
                  className="ant-avatar antd-pro-components-global-header-index-avatar 
                          ant-avatar-sm ant-avatar-circle ant-avatar-image"
                >
                  {this.props.user.photo ? (
                    <Avatar size={25} src={this.props.user.photo} />
                  ) : (
                    <Avatar size={25} src={defaultProfile} />
                  )}
                </span>

                <Link
                  to="#"
                  className="ant-dropdown-link"
                  style={{ marginLeft: 8 }}
                  onClick={(e) => e.preventDefault()}
                >
                  {`${this.props.user.username}`}
                </Link>
              </span>
            </Dropdown>
          </div>
        </div>

      </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});
export default connect(mapStateToProps, { logout })(TopNav);
