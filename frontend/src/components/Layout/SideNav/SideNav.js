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
import PropTypes from "prop-types";
import { getGroupListAll } from "../../../actions/group";
// import profileDefault from "./default.png";
const { SubMenu } = Menu;
const { Sider } = Layout;

class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedKey: ["1"],
      openKeys: []
    };
    this.onClick = this.onClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  rootSubmenuKeys = ["grphr", "issueSub", "reportsub", "accounts"];
  componentDidMount() {
    let selectedId = this.state.selectedKey.slice();
    selectedId[0] = localStorage.getItem("selectedKey");
    this.setState({ selectedKey: selectedId });
    this.props.getGroupListAll();
  }
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };
  onClick = selectedKey => e => {
    let selectedId = this.state.selectedKey.slice();
    selectedId[0] = selectedKey;
    localStorage.setItem("selectedKey", selectedId);
    this.setState({ selectedId });
  };

  onCollapse = collapsed => {
    this.setState({
      collapsed
    });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
    this.profileLogo = this.profileLogo.bind(this);
  };


  render() {
    // if (!this.props.auth.isAuthenticated) {
    //   return null;
    // }
    let groups;

    let management;
    if (this.props.user.groups) {
      this.props.user.groups.map(grp => {
        //console.log(grp.name, "pppppppp"),
        management = grp.name == "Core Director" ? true : false;
      });
    }

    //console.log(management, "kkkkkkkkkk");
    if (this.props.user.is_hr) {
      groups = (
        <SubMenu
          key="grphr"
          title={
            <span>
              {/* <Icon type="team" /> */}
              <span>Groups</span>
            </span>
          }
        >
          {this.props.allgroup
            ? this.props.allgroup.map(group => (
              <Menu.Item
                key={`grphr_${group.id}`}
                onClick={this.onClick(`grphr_${group.id}`)}
              >
                {this.props.user.is_hr ? (
                  <Link to={`/allmembers/${group.id}`}>{group.name}</Link>
                ) : (
                  <Link to={`/group/${group.id}`}>{group.name}</Link>
                )}
              </Menu.Item>
            ))
            : null}
        </SubMenu>
      );
    } else if (this.props.user.is_fna) {
      groups = null;
    } else if (this.props.user.is_staff) {
      groups = (
        <SubMenu
          key="grphr"
          title={
            <span>
              {/* <Icon type="team" /> */}
              <span>Groups</span>
            </span>
          }
        >
          {this.props.allgroup
            ? this.props.allgroup.map(group => (
              <Menu.Item
                key={`grphr_${group.id}`}
                onClick={this.onClick(`grphr_${group.id}`)}
              >
                {this.props.user.is_hr ? (
                  <Link to={`/allmembers/${group.id}`}>{group.name}</Link>
                ) : (
                  <Link to={`/group/${group.id}`}>{group.name}</Link>
                )}
              </Menu.Item>
            ))
            : null}
        </SubMenu>
      );
    }
    // else if (this.props.user.groups) {
    //   this.props.user.groups.length > 1
    //     ? (groups = (
    //       <SubMenu
    //         key="grphr"
    //         title={
    //           <span>
    //             {/* <Icon type="team" /> */}
    //             <span>Groups</span>
    //           </span>
    //         }
    //       >
    //         {this.props.user.groups.map(group => (
    //           <Menu.Item
    //             key={`grphr_${group.id}`}
    //             onClick={this.onClick(`grphr_${group.id}`)}
    //           >
    //             {this.props.user.is_hr ? (
    //               <Link to={`/allmembers/${group.id}`}>{group.name}</Link>
    //             ) : (
    //               <Link to={`/group/${group.id}`}>{group.name}</Link>
    //             )}
    //           </Menu.Item>
    //         ))}
    //       </SubMenu>
    //     ))
    //     : (groups = this.props.auth.user.groups.map(group => (
    //       <Menu.Item
    //         key={`grphr_${group.id}`}
    //         onClick={this.onClick(`grphr_${group.id}`)}
    //       >
    //         <Link to={`/group/${group.id}`}>
    //           {/* <Icon type="team" /> */}
    //           <span>{group.name}</span>
    //         </Link>
    //       </Menu.Item>
    //     )));
    // }
    <SubMenu
      key="grphr"
      title={
        <span>
          {/* <Icon type="team" /> */}
          <span>Groups</span>
        </span>
      }
    >
      {this.props.user.groups ? this.props.user.groups.map(group => (
        <Menu.Item
          key={`grphr_${group.id}`}
          onClick={this.onClick(`grphr_${group.id}`)}
        >
          {this.props.user.is_hr ? (
            <Link to={`/allmembers/${group.id}`}>{group.name}</Link>
          ) : (
            <Link to={`/group/${group.id}`}>{group.name}</Link>
          )}
        </Menu.Item>
      )) : null}
    </SubMenu>;

    let issue_menu;
    if (!this.props.user.is_hr && !this.props.user.is_fna) {
      if (this.props.user.is_staff) {
        issue_menu = (
          <SubMenu
            key="issueStf"
            title={
              <span>
                {/* <Icon type="issues-close" /> */}
                <span>Issues</span>
              </span>
            }
          >
            {this.props.allgroup
              ? this.props.allgroup.map(group => (
                <Menu.Item
                  key={`issueStf${group.id}`}
                  onClick={`issueStf${group.id}`}
                >
                  <Link to={`/group-issues/group/${group.id}`}>
                    {group.name}
                  </Link>
                </Menu.Item>
              ))
              : null}
          </SubMenu>
        );
      } else {
        issue_menu = (
          <SubMenu
            key="issueSub"
            title={
              <span>
                {/* <Icon type="issues-close" /> */}
                <span>Issues</span>
              </span>
            }
          >
            <Menu.Item key="issueSub1" onClick={this.onClick("issueSub1")}>
              <Link to={`/raised-issues/${this.props.user.id}`}>
                Raised Issues
              </Link>
            </Menu.Item>
            <Menu.Item key="issueSub2" onClick={this.onClick("issueSub2")}>
              <Link to={`/solved-issues/${this.props.user.id}`}>
                Solved Issues
              </Link>
            </Menu.Item>
            <Menu.Item key="issueSub3" onClick={this.onClick("issueSub3")}>
              <Link to={`/group-issues/user/${this.props.user.id}`}>
                Group Issues
              </Link>
            </Menu.Item>
          </SubMenu>
        );
      }
    }

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
                style={{ margin: "58px 0px 6px 65px" }}
                src={this.props.user.photo}
              />
            ) : (
              <Avatar size={60} style={{ margin: "58px 0px 6px 65px" }} />
            )}
            {/* </Link> */}
          </div>
          <div id="sidescrollbar" style={{ overflow: "hidden auto" }}>
            <Menu
              theme="dark"
              mode="inline"
              id="menuSide"
              openKeys={this.state.openKeys}
              onOpenChange={this.onOpenChange}
              defaultSelectedKeys={this.state.selectedKey}
              style={{ height: "100%" }}
            >
              <Menu.Item key="home" onClick={this.onClick("home")}>
                <Link to="/">
                  {/* <Icon type="home" theme="filled" /> */}
                  <span>Home</span>
                </Link>
              </Menu.Item>
              {groups}
              {this.props.user.is_hr ? (
                <Menu.Item
                  key="manageMem"
                  onClick={this.onClick("manageMem")}
                >
                  <Link to={`/allmembers/all`}>
                    {/* <Icon type="usergroup-add" /> */}
                    <span>Manage Members</span>
                  </Link>
                </Menu.Item>
              ) : null}
              {this.props.user.is_hr ? (
                <Menu.Item
                  key="createUser"
                  onClick={this.onClick("createUser")}
                >
                  <Link to="/createuser">
                    {/* <Icon type="user-add" /> */}
                    <span>Create User</span>
                  </Link>
                </Menu.Item>
              ) : null}
              {this.props.user.is_hr ? (
                <Menu.Item
                  key="manageGrp"
                  onClick={this.onClick("manageGrp")}
                >
                  <Link to="/managegrp">
                    {/* <Icon type="user-add" /> */}
                    <span>Manage groups</span>
                  </Link>
                </Menu.Item>
              ) : null}
              {this.props.user.is_hr ? (
                <Menu.Item key="hrDesig" onClick={this.onClick("hrDesig")}>
                  <Link to="/jobtitle">
                    {/* <Icon type="cluster" /> */}
                    <span>Designations</span>
                  </Link>
                </Menu.Item>
              ) : null}
              {!this.props.user.is_staff &&
                !this.props.user.is_fna &&
                !this.props.user.is_hr ? (
                <Menu.Item key="project" onClick={this.onClick("project")}>
                  <Link to={`/user/projects/all/${this.props.user.id}`}>
                    {/* <Icon type="project" /> */}
                    <span>My Projects</span>
                  </Link>
                </Menu.Item>
              ) : null}
              {!this.props.user.is_staff &&
                !this.props.user.is_fna &&
                !this.props.user.is_hr ? (
                <Menu.Item key="myTask" onClick={this.onClick("myTask")}>
                  <Link to={`/user/tasks/current/${this.props.user.id}`}>
                    {/* <Icon type="file-protect" /> */}
                    <span>My Tasks</span>
                  </Link>
                </Menu.Item>
              ) : null}
              {/* {!this.props.user.is_staff &&
                !this.props.user.is_fna &&
                !this.props.user.is_hr ? (
                <Menu.Item
                  key="kpiDetails"
                  onClick={this.onClick("kpiDetails")}
                >
                  <Link to={`/kpi-details/${this.props.auth.user.id}`}>
                    <Icon type="area-chart" />
                    <span>KPI</span>
                  </Link>
                </Menu.Item>
              ) : null} */}
              {issue_menu}
              {!this.props.user.is_staff &&
                !this.props.user.is_fna &&
                !this.props.user.is_hr ? (
                <SubMenu
                  key="reportsub"
                  title={
                    <span>
                      {/* <Icon type="container" /> */}
                      <span>Reports</span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="reportsub1"
                    onClick={this.onClick("reportsub1")}
                  >
                    <Link to={"/weeklystatusreport/"}>Work Report</Link>
                  </Menu.Item>
                  <Menu.Item key="inbox" onClick={this.onClick("inboxsub")}>
                    <Link to={"/weeklyreportlist/inbox"}>Inbox</Link>
                  </Menu.Item>
                  <Menu.Item key="sent" onClick={this.onClick("sentsub")}>
                    <Link to={"/weeklyreportlist/sent"}>Sent</Link>
                  </Menu.Item>
                </SubMenu>
              ) : null}

              {this.props.user.is_hr ? (
                <SubMenu
                  key="hrNotice"
                  title={
                    <span>
                      {/* <Icon type="fund" /> */}
                      <span>Notice</span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="hrNotice1"
                    onClick={this.onClick("hrNotice1")}
                  >
                    <Link to={`/notices/onboard`}>Onboard Notice</Link>
                  </Menu.Item>
                  <Menu.Item
                    key="hrNotice2"
                    onClick={this.onClick("hrNotice2")}
                  >
                    <Link to={`/notices/allnotice`}>All Notices</Link>
                  </Menu.Item>
                </SubMenu>
              ) : (
                <Menu.Item
                  key="UserNotice"
                  onClick={this.onClick("UserNotice")}
                >
                  <Link to="/notices/allnotice">
                    {/* <Icon type="notification" /> */}
                    <span>Notice Board</span>
                  </Link>
                </Menu.Item>
              )}
              {/* <Menu.Item key="ContactUs" onClick={this.onClick("ContactUs")}>
                  <Link to={`/contactus/${this.props.user.id}`}>
                    <Icon type="project" />
                    <span>Contact Us</span>
                  </Link>
                </Menu.Item> */}
            </Menu>
          </div>
        </Sider>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.auth.user,

});
export default connect(mapStateToProps, { getGroupListAll })(SideNav);
