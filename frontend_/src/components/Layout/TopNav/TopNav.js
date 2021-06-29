import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./TopNav.css";
import { Layout, Menu, Icon, Dropdown } from "antd";
import { Link } from "react-router-dom";
import Image from "../../Common/ImageSmall/ImageSmall";
import { Anchor } from "antd";
import { logout } from "../../../actions/auth";
import Notification from "./Notification/Notification";
const { Header } = Layout;

class TopNav extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onClickHandle = this.onClickHandle.bind(this);
  }

  onClick = e => {
    this.props.logout();
    localStorage.removeItem("selectedKey");
    localStorage.setItem("selectedKey", ["1"]);
  };

  onClickHandle = e => {
    localStorage.setItem("selectedKey", ["0"]);
  };

  render() {
    if (!this.props.user) {
      return null;
    }
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
              {/* <Icon className={"header_icon"} type="edit" /> */}
              <strong>New Status Report</strong>
            </Link>
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item {...props} key="2" className="mail-notification-box">
          <div className="row">
            <Link to="/weekly_status/inbox/" id="inbox_link">
              {/* <Icon className={"header_icon"} type="inbox" /> */}

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
              {/* <Icon className={"header_icon"} type="inbox" /> */}

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
    const pro_log = (
      <Menu defaultSelectedKeys={["0"]} className="msg_drop_down">
        <Menu.Item
          key="1"
          className="prolog_dropdown"
          onClick={this.onClickHandle}
        >
          <Link to={`/profile/${this.props.user.id}`}>
            {/* <Icon className={"header_icon"} type="user" /> */}
            <strong>Profile</strong>
          </Link>
        </Menu.Item>
        <Menu.Item key="2" className="prolog_dropdown" onClick={this.onClick}>
          <span style={{ paddingLeft: "17px" }}>
            {/* <Icon className={"header_icon"} type="logout" id="inbox_link" /> */}
            <strong>Logout </strong>
          </span>
        </Menu.Item>
      </Menu>
    );
    return (
      <Header className="header">
        <div className="logo" />
        <Link to="/" id="logo_top" className="navbar-brand">
          <strong>U</strong>LKASEMI
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["0"]}
          style={{ lineHeight: "52px", float: "right" }}
        >
          {/*  Off For Appraisal <Menu.Item key="1" align="right" className="header_li">
            <Link className="ant-dropdown-link " to="/chat">
              <Anchor className={"header_anchor"}>
                <p className={"header_icon_link"}>
                  <Icon
                    className={"header_icon"}
                    type="message"
                    theme="filled"
                  />
                </p>
              </Anchor>
            </Link>
          </Menu.Item> */}
          <Menu.Item key="2" align="right" className="header_li">
            <Notification />
          </Menu.Item>

          {/* <Menu.Item key="3" align="right" className="header_li">
            <Dropdown
              overlay={msg}
              trigger={["click"]}
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Link className="ant-dropdown-link " to="/">
                <Anchor className={"header_anchor"}>
                  <p className={"header_icon_link"}>
                    <Icon
                      className={"header_icon"}
                      type="mail"
                      theme="filled"
                    />
                  </p>
                </Anchor>
              </Link>
            </Dropdown>
          </Menu.Item> */}
          <Menu.Item key="4" className="header_li">
            <Dropdown
              overlay={pro_log}
              getPopupContainer={trigger => trigger.parentNode}
              // overlayClassName={"fixedpos"}
              trigger={["click"]}
            >
              <Link
                style={{ textDecoration: "none" }}
                className="ant-dropdown-link"
                to="#"
              >
                <Image
                  width={"30"}
                  height={"30"}
                  altname={this.props.user.full_name}
                  id={"profile_logo_header"}
                  srcfile={
                    this.props.user.image
                      ? this.props.user.image
                      : "https://www.sackettwaconia.com/wp-content/uploads/default-profile.png"
                  }
                />{" "}
                {/* <Icon type="down" /> */}
              </Link>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});
export default connect(mapStateToProps, { logout })(TopNav);
