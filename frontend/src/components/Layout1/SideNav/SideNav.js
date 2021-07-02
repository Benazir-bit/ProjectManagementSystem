import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  TeamOutlined,
  UserOutlined,
  MacCommandOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Avatar } from "antd";
import "./SideNav.css";
import profileDefault from "./default.png";
import { getLastthreeyears } from "../../../actions/report";
import moment from "moment-timezone";

const { Sider } = Layout;

class SideNav extends Component {
  state = {
    collapsed: false,
    collapsedWidth: 80,
    selectedKey: true,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };
  OPSREVIEW = () => {
    this.setState({ selectedKey: false });
  };

  componentDidMount() {
    this.props.getLastthreeyears();
  }

  render() {
    const year_list = this.props.years;

    return (
      <Fragment>
        <div
          className={
            this.state.collapsedWidth === 80
              ? this.state.collapsed
                ? "small"
                : "big"
              : null
          }
        />
        <Sider
          collapsible
          breakpoint="xs"
          collapsedWidth={this.state.collapsedWidth}
          onBreakpoint={(broken) => {
            if (broken) {
              this.setState({
                collapsedWidth: 0,
              });
            } else {
              this.setState({
                collapsedWidth: 80,
              });
            }
          }}
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          style={{
            zIndex: 4,
            position: "fixed",
            height: "100%",
          }}
          className={"sidescroll"}
        >
          <div className="ant-pro-sider-logo" id="sidenavpic">
            {/* <Link to={`/quartz/profile/${this.props.user.id}`}> */}
            {this.props.user.photo ? (
              <Avatar
                size={60}
                style={{ margin: 10 }}
                src={this.props.user.photo}
              />
            ) : (
              <Avatar size={60} style={{ margin: 10 }} src={profileDefault} />
            )}
            {/* </Link> */}
          </div>
          <div id="sidescrollbar" style={{ overflow: "hidden auto" }}>
            <Menu
              theme="dark"
              selectedKeys={[window.location.pathname]}
              mode="inline"
            >
              {this.props.user.is_superuser ? (
                <Menu.Item
                  key="/quartz/design-kit"
                  icon={<MacCommandOutlined />}
                  className="sidenavlistitem"
                >
                  <Link to={`/quartz/design-kit`}>Design Kit </Link>
                </Menu.Item>
              ) : (
                <Menu.Item
                  key="/quartz/design-kit"
                  icon={<MacCommandOutlined />}
                  className="sidenavlistitem"
                >
                  <Link to={`/quartz/design-kit`}>Design Kit </Link>
                </Menu.Item>
              )}
              <Menu.Item key="/quartz/mergekit" icon={<MacCommandOutlined />}>
                <Link to={`/quartz/mergekit`}>Merge Kit </Link>
              </Menu.Item>
              <Menu.Item
                key="/quartz/silicon-report"
                icon={<MacCommandOutlined />}
              >
                <Link to={`/quartz/silicon-report`}>Silicon Report</Link>
              </Menu.Item>
              <Menu.Item key="/quartz/sow" icon={<MacCommandOutlined />}>
                <Link to={`/quartz/sow`}>SOW </Link>
              </Menu.Item>

              <Menu.SubMenu
                key="/quartz/ops-meeting-review"
                icon={<MacCommandOutlined />}
                title="OPS Meeting"
              >
                <Menu.Item
                  key="/quartz/ops-meeting-review"
                  icon={<CalendarOutlined />}
                >
                  <Link
                    onClick={this.OPSREVIEW}
                    to={`/quartz/ops-meeting-review`}
                  >
                    All Review
                  </Link>
                </Menu.Item>

                {year_list
                  ? year_list.map((year, index) => {
                    return (
                      <Menu.Item
                        key={`/quartz/ops-meeting-review/${year.ops_year}`}
                        icon={<CalendarOutlined />}
                      >
                        <Link
                          onClick={this.OPSREVIEW}
                          to={`/quartz/ops-meeting-review/${year.ops_year}`}
                        >
                          Year {year.ops_year}
                        </Link>
                      </Menu.Item>
                    );
                  })
                  : null}
              </Menu.SubMenu>
              <Menu.Item
                key="/quartz/qms-training"
                icon={<MacCommandOutlined />}
              >
                <Link to={`/quartz/qms-training`}>QMS Training</Link>
              </Menu.Item>

              <Menu.Item
                key={`/quartz/qa-highlights/${moment().year()}/${moment().month() + 1
                  }`}
                icon={<MacCommandOutlined />}
              >
                <Link
                  to={`/quartz/qa-highlights/${moment().year()}/${moment().month() + 1
                    }`}
                >
                  QA Highlights
                </Link>
              </Menu.Item>

              {this.props.user.is_superuser ? (
                <Menu.Item key="/quartz/create-user" icon={<UserOutlined />}>
                  <Link to={`/quartz/create-user`}>Create User</Link>
                </Menu.Item>
              ) : null}

              {this.props.user.is_superuser ? (
                <Menu.Item key="/quartz/manage-users" icon={<TeamOutlined />}>
                  <Link to={`/quartz/manage-users`}>Manage Users</Link>
                </Menu.Item>
              ) : null}
              {this.props.user.is_superuser ? (
                <Menu.Item key="/quartz/create-group" icon={<UserOutlined />}>
                  <Link to={`/quartz/create-group`}>Create Group</Link>
                </Menu.Item>
              ) : null}
              {this.props.user.is_superuser ? (
                <Menu.Item key="/quartz/manage-groups" icon={<UserOutlined />}>
                  <Link to={`/quartz/manage-groups`}>Manage Groups</Link>
                </Menu.Item>
              ) : null}
            </Menu>
          </div>
        </Sider>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.auth.user,
  years: state.report.last_three_years,
});
export default connect(mapStateToProps, { getLastthreeyears })(SideNav);
