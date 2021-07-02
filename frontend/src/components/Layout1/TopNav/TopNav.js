import React, { Component } from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import "./TopNav.css";
import {
  LogoutOutlined,
  EditOutlined,
  UploadOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { logout } from "../../../actions/auth";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateProfile } from "../../../actions/auth";
import UploadImage from "../../Common/UploadImage/UploadImage";
import defaultProfile from "../SideNav/default.png";

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
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1" icon={<UploadOutlined />}>
          Change Photo
        </Menu.Item>
        <Menu.Item key="2" icon={<EditOutlined />}>
          <Link to={`/quartz/change-password`}>Change Password</Link>
        </Menu.Item>

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
          zIndex: 3,
          width: "100%",
          background: "white",
        }}
      >
        {/* <div className="logo" />
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu> */}
        <div className="ant-pro-global-header ant-pro-global-header-layout-side">
          <div>
            <Link to="/">
              <HomeOutlined
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  padding: "0 12px",
                  cursor: "pointer",
                  transition: " all .3s",
                  fontSize: "18px",
                }}
              />
            </Link>
          </div>
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
        <UploadImage
          actionupload={this.props.updateProfile}
          userId={this.props.user.id}
          onRef={(ref) => (this.child = ref)}
        />
      </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});
export default connect(mapStateToProps, { logout, updateProfile })(TopNav);
