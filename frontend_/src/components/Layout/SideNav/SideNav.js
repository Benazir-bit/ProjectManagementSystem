import React, { Fragment } from "react";
import ImageSideNav from "./ImageSideNav";
import { Layout, Menu, Icon } from "antd";
import "./SideNav.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getGroupListAll } from "../../../actions/group";
const { Sider } = Layout;
const { SubMenu } = Menu;

class SideNav extends React.PureComponent {
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
  static propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object
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

  profileLogo = show => {
    if (show) {
      return (
        <Fragment>
          <div id="sidenav_logopic" style={{ marginBottom: "54px" }}>
            <Link to={`/profile/${this.props.auth.user.id}`}>
              <ImageSideNav
                altname={this.props.user.full_name}
                id={"profile_logo"}
                srcfile={
                  this.props.user.image
                    ? this.props.user.image
                    : "https://www.sackettwaconia.com/wp-content/uploads/default-profile.png"
                }
                width={"70"}
                height={"70"}
              />
            </Link>
          </div>
        </Fragment>
      );
    } else {
      return (
        <div id="sidenav_logopic">
          <Link to={`/profile/${this.props.auth.user.id}`}>
            <ImageSideNav
              altname={this.props.user.full_name}
              id={"profile_logo"}
              srcfile={
                this.props.user.image
                  ? this.props.user.image
                  : "https://www.sackettwaconia.com/wp-content/uploads/default-profile.png"
              }
              width={"70"}
              height={"70"}
            />
          </Link>
          <Link to={`/profile/${this.props.auth.user.id}`}>
            <h5 id="profile_name">{this.props.user.full_name}</h5>
          </Link>
          <h6 id="profile_desig">
            {this.props.user.is_teamleader ? "Team Lead," : null}
            &nbsp;{this.props.user.dsg}
          </h6>
        </div>
      );
    }
  };

  render() {
    if (!this.props.auth.isAuthenticated) {
      return null;
    }
    const SideNavProfile = this.profileLogo(this.state.collapsed);

    let groups;

    let management;
    this.props.user.groups.map(grp => {
      //console.log(grp.name, "pppppppp"),
      management = grp.name == "Core Director" ? true : false;
    });
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
    } else {
      this.props.user.groups.length > 1
        ? (groups = (
          <SubMenu
            key="grphr"
            title={
              <span>
                {/* <Icon type="team" /> */}
                <span>Groups</span>
              </span>
            }
          >
            {this.props.user.groups.map(group => (
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
            ))}
          </SubMenu>
        ))
        : (groups = this.props.auth.user.groups.map(group => (
          <Menu.Item
            key={`grphr_${group.id}`}
            onClick={this.onClick(`grphr_${group.id}`)}
          >
            <Link to={`/group/${group.id}`}>
              {/* <Icon type="team" /> */}
              <span>{group.name}</span>
            </Link>
          </Menu.Item>
        )));
    }
    <SubMenu
      key="grphr"
      title={
        <span>
          {/* <Icon type="team" /> */}
          <span>Groups</span>
        </span>
      }
    >
      {this.props.user.groups.map(group => (
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
      ))}
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
        <div>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            width={255}
            onCollapse={this.onCollapse}
          >
            <div style={{ position: "fixed", height: "100%", width: "255px" }}>
              <Menu
                theme="dark"
                mode="inline"
                id="menuSide"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                defaultSelectedKeys={this.state.selectedKey}
                style={{ height: "100%" }}
              >
                {SideNavProfile}
                {/* <Menu.Item key="home" onClick={this.onClick("home")}>
                  <Link to="/">
                    <Icon type="home" theme="filled" />
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
                      <Icon type="usergroup-add" />
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
                      <Icon type="user-add" />
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
                      <Icon type="user-add" />
                      <span>Manage groups</span>
                    </Link>
                  </Menu.Item>
                ) : null}

                {this.props.user.is_hr ? (
                  <Menu.Item key="hrDesig" onClick={this.onClick("hrDesig")}>
                    <Link to="/jobtitle">
                      <Icon type="cluster" />
                      <span>Designations</span>
                    </Link>
                  </Menu.Item>
                ) : null}

                {!this.props.user.is_staff &&
                !this.props.user.is_fna &&
                !this.props.user.is_hr ? (
                  <Menu.Item key="project" onClick={this.onClick("project")}>
                    <Link to={`/user/projects/all/${this.props.user.id}`}>
                      <Icon type="project" />
                      <span>My Projects</span>
                    </Link>
                  </Menu.Item>
                ) : null}

                {!this.props.user.is_staff &&
                !this.props.user.is_fna &&
                !this.props.user.is_hr ? (
                  <Menu.Item key="myTask" onClick={this.onClick("myTask")}>
                    <Link to={`/user/tasks/current/${this.props.user.id}`}>
                      <Icon type="file-protect" />
                      <span>My Tasks</span>
                    </Link>
                  </Menu.Item>
                ) : null}

                {!this.props.user.is_staff &&
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
                ) : null}

                {issue_menu}
                {!this.props.user.is_staff &&
                !this.props.user.is_fna &&
                !this.props.user.is_hr ? (
                  <SubMenu
                    key="reportsub"
                    title={
                      <span>
                        <Icon type="container" />
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
                <SubMenu
                  key="attendance"
                  title={
                    <span>
                      <Icon type="monitor" />
                      <span>Attendance</span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="my_attendance"
                    onClick={this.onClick("my_attendance")}
                  >
                    <Link to={"/my-attendance/"}>My Attendance</Link>
                  </Menu.Item>
                  {this.props.user.is_hr ? (
                    <Menu.Item
                      key="config_working_hour"
                      onClick={this.onClick("config_working_hour")}
                    >
                      <Link to={"/config-working-hour/"}>
                        Configure Working Hour
                      </Link>
                    </Menu.Item>
                  ) : null}

                  {this.props.user.is_teamleader ||
                  this.props.user.is_hr ||
                  this.props.user.is_staff ? (
                    <Menu.Item
                      key="group_attendance"
                      onClick={this.onClick("group_attendance")}
                    >
                      <Link to={"/group-attendance/"}>Group Attendance</Link>
                    </Menu.Item>
                  ) : null}
                  {this.props.user.is_teamleader ||
                  this.props.user.is_hr ||
                  this.props.user.is_staff ? (
                    <Menu.Item
                      key="user_attendance"
                      onClick={this.onClick("user_attendance")}
                    >
                      <Link to={"/user-attendance/"}>User Attendance</Link>
                    </Menu.Item>
                  ) : null}
                  <Menu.Item key="holidays" onClick={this.onClick("holidays")}>
                    <Link to={"/holidays/"}>Holidays</Link>
                  </Menu.Item>
                </SubMenu>

                {this.props.user.is_hr ? (
                  <SubMenu
                    key="accounts"
                    title={
                      <span>
                        <Icon type="wallet" />
                        <span>Accounts</span>
                      </span>
                    }
                  >
                    <Menu.Item
                      key="accounts1"
                      onClick={this.onClick("accounts1")}
                    >
                      <Link to={`/account-dash/`}>Manage Accounts</Link>
                    </Menu.Item>
                    <Menu.Item
                      key="accounts2"
                      onClick={this.onClick("accounts2")}
                    >
                      <Link to={`/myaccount/`}>My Accounts</Link>
                    </Menu.Item>
                  </SubMenu>
                ) : (
                  <Menu.Item
                    key="AccountsServices"
                    onClick={this.onClick("AccountsServices")}
                  >
                    <Link to={`/myaccount/`}>
                      <Icon type="wallet" />
                      <span>My Accounts</span>
                    </Link>
                  </Menu.Item>
                )}

                {this.props.user.is_fna ? (
                  <SubMenu
                    key="salary"
                    title={
                      <span>
                        <Icon type="credit-card" />
                        <span>Manage Salaries</span>
                      </span>
                    }
                  >
                    <Menu.Item key="salary1" onClick={this.onClick("salary1")}>
                      <Link to={`/service/distribution-settings/`}>
                        Salary Distribution
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="salary2" onClick={this.onClick("salary2")}>
                      <Link to={`/all-accounts/`}>All User Salary</Link>
                    </Menu.Item>
                    <Menu.Item key="salary3" onClick={this.onClick("salary3")}>
                      <Link to={`/salary-year/`}>Salary Year</Link>
                    </Menu.Item>
                  </SubMenu>
                ) : null}

                {this.props.user.is_fna ? (
                  <Menu.Item
                    key="providant"
                    onClick={this.onClick("providant")}
                  >
                    <Link to={`/provident-fund/`}>
                      <Icon type="fund" />
                      <span>Providant Fund</span>
                    </Link>
                  </Menu.Item>
                ) : null}

                {this.props.user.is_fna ? (
                  <SubMenu
                    key="fnaaccounts"
                    title={
                      <span>
                        <Icon type="wallet" />
                        <span>Payslip</span>
                      </span>
                    }
                  >
                    <Menu.Item
                      key="fnaaccounts1"
                      onClick={this.onClick("fnaaccounts1")}
                    >
                      <Link to={`/createpayslip/`}>Generate Payslip</Link>
                    </Menu.Item>
                    <Menu.Item
                      key="fnaaccounts2"
                      onClick={this.onClick("fnaaccounts2")}
                    >
                      <Link to={`/all-salary-payslips/`}>Salary Payslip</Link>
                    </Menu.Item>
                    <Menu.Item
                      key="fnaaccounts3"
                      onClick={this.onClick("fnaaccounts3")}
                    >
                      <Link to={`/all-payslips/`}>All Payslip</Link>
                    </Menu.Item>
                  </SubMenu>
                ) : null}
                {this.props.user.is_fna ? (
                  <Menu.Item key="service" onClick={this.onClick("service")}>
                    <Link to={`/all-service/`}>
                      <Icon type="container" />
                      <span>All Services</span>
                    </Link>
                  </Menu.Item>
                ) : null}
                {this.props.user.is_fna ? (
                  <Menu.Item key="loan" onClick={this.onClick("loan")}>
                    <Link to={`/loans/`}>
                      <Icon type="audit" />
                      <span>Loans</span>
                    </Link>
                  </Menu.Item>
                ) : null}

                {this.props.user.is_hr ? (
                  <SubMenu
                    key="hrNotice"
                    title={
                      <span>
                        <Icon type="fund" />
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
                      <Icon type="notification" />
                      <span>Notice Board</span>
                    </Link>
                  </Menu.Item>
                )}
                {!this.props.user.is_hr ? (
                  <SubMenu
                    key="appraisaluser"
                    title={
                      <span>
                        <Icon type="build" />
                        <span>Appraisal</span>
                      </span>
                    }
                  >
                    <Menu.Item
                      key="appraisalforms"
                      onClick={this.onClick("appraisalforms")}
                    >
                      <Link to="/appraisal-forms/">
                        <span>Appraisal Forms</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="myappraisalstatus"
                      onClick={this.onClick("myappraisalstatus")}
                    >
                      <Link to="/appraisalstatus/">
                        <span>Appraisal Status</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="appraisalrevforms"
                      onClick={this.onClick("appraisalrevforms")}
                    >
                      <Link to="/appraisal-review-forms/">
                        <span>Appraisals For Review</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="appraisalrevcompforms"
                      onClick={this.onClick("appraisalrevcompforms")}
                    >
                      <Link to="/appraisal-review-completed-forms/">
                        <span>Appraisals Review Completed</span>
                      </Link>
                    </Menu.Item>
                  </SubMenu>
                ) : (
                  <SubMenu
                    key="appraisaluser"
                    title={
                      <span>
                        <Icon type="build" />
                        <span>Appraisal</span>
                      </span>
                    }
                  >
                    <Menu.Item
                      key="appraisalforms"
                      onClick={this.onClick("appraisalforms")}
                    >
                      <Link to="/appraisal-forms/">
                        <span>My Appraisal Forms</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="myappraisalstatus"
                      onClick={this.onClick("myappraisalstatus")}
                    >
                      <Link to="/appraisalstatus/">
                        <span>My Appraisal Status</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="allapraisalhr"
                      onClick={this.onClick("allapraisalhr")}
                    >
                      <Link to="/appraisal-list-hr">
                        <span>All Appraisals</span>
                      </Link>
                    </Menu.Item>
                  </SubMenu>
                )}
                <Menu.Item key="ContactUs" onClick={this.onClick("ContactUs")}>
                  <Link to={`/contactus/${this.props.user.id}`}>
                    <Icon type="project" />
                    <span>Contact Us</span>
                  </Link>
                </Menu.Item>
               
                {this.props.user.is_hr ? (
                  <SubMenu
                    key="appraisalhr"
                    title={
                      <span>
                        <Icon type="setting" />
                        <span>Appraisal Settings</span>
                      </span>
                    }
                  >
                    <Menu.Item
                      key="createaprcycle"
                      onClick={this.onClick("createaprcycle")}
                    >
                      <Link to="/appraisal-cycle">
                        <span>Create Appraisal Cycle</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="allaprcycle"
                      onClick={this.onClick("allaprcycle")}
                    >
                      <Link to="/appraisal-cycles/">
                        <span>All Appraisal Cycles</span>
                      </Link>
                    </Menu.Item>

                    <Menu.Item
                      key="createtemplate"
                      onClick={this.onClick("createtemplate")}
                    >
                      <Link to="/template-config/">
                        <span>Create Teamplate</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="alltemplate"
                      onClick={this.onClick("alltemplate")}
                    >
                      <Link to="/template-list/">
                        <span>All Templates</span>
                      </Link>
                    </Menu.Item>
                  </SubMenu>
                ) : null} */}
                <Menu.Item
                  key="appraisalforms"
                  onClick={this.onClick("appraisalforms")}
                >
                  <Link to="/">
                    {/* <span>Appraisal Forms</span> */}
                    <span>
                      {/* <Icon type="home" /> */}
                      <span>Appraisal Forms</span>
                    </span>
                  </Link>
                </Menu.Item>
                {this.props.user.is_hr ? (
                  // <SubMenu
                  //   key="appraisaluser"
                  //   title={
                  //     <span>
                  //       <Icon type="build" />
                  //       <span>Appraisal</span>
                  //     </span>
                  //   }
                  // >

                  //   <Menu.Item
                  //     key="myappraisalstatus"
                  //     onClick={this.onClick("myappraisalstatus")}
                  //   >
                  //     <Link to="/appraisalstatus/">
                  //       <span>My Appraisal Status</span>
                  //     </Link>
                  //   </Menu.Item>
                  //   <Menu.Item
                  //     key="allapraisalhr"
                  //     onClick={this.onClick("allapraisalhr")}
                  //   >
                  //     <Link to="/appraisal-list-all">
                  //       <span>All Appraisals</span>
                  //     </Link>
                  //   </Menu.Item>
                  // </SubMenu>
                  <Menu.Item
                    key="allapraisalhr"
                    onClick={this.onClick("allapraisalhr")}
                  >
                    <Link to="/appraisal-list-all">
                      {/* <Icon type="build" /> */}
                      <span>All Appraisals</span>
                    </Link>
                  </Menu.Item>
                ) : management ? (
                  // <SubMenu
                  //   key="appraisaluser"
                  //   title={
                  //     <span>
                  //       <Icon type="build" />
                  //       <span>Appraisal</span>
                  //     </span>
                  //   }
                  // >

                  //   <Menu.Item
                  //     key="appraisalrevforms"
                  //     onClick={this.onClick("appraisalrevforms")}
                  //   >
                  //     <Link to="/appraisal-review-forms/">
                  //       <span>Appraisals For Review</span>
                  //     </Link>
                  //   </Menu.Item>
                  //   <Menu.Item
                  //     key="appraisalrevcompforms"
                  //     onClick={this.onClick("appraisalrevcompforms")}
                  //   >
                  //     <Link to="/appraisal-review-completed-forms/">
                  //       <span>Appraisals Review Completed</span>
                  //     </Link>
                  //   </Menu.Item>
                  //   <Menu.Item
                  //     key="allapraisalhr"
                  //     onClick={this.onClick("allapraisalhr")}
                  //   >
                  //     <Link to="/appraisal-list-all">
                  //       <span>All Appraisals</span>
                  //     </Link>
                  //   </Menu.Item>
                  // </SubMenu>
                  <Menu.Item
                    key="allapraisalhr"
                    onClick={this.onClick("allapraisalhr")}
                  >
                    {" "}
                    <Link to="/appraisal-list-all">
                      {/* <Icon type="build" /> */}
                      <span>All Appraisals</span>
                    </Link>
                  </Menu.Item>
                ) : null}
                {management ? (
                  <Menu.Item
                    key="linemanager"
                    onClick={this.onClick("linemanager")}
                  >
                    <Link to="/line-manager-tree/">
                      <span>Organogram</span>
                    </Link>
                  </Menu.Item>
                ) : null}

                {this.props.user.is_hr ? (
                  <SubMenu
                    key="appraisalhr"
                    title={
                      <span>
                        {/* <Icon type="setting" /> */}
                        <span>Appraisal Settings</span>
                      </span>
                    }
                  >
                    <Menu.Item
                      key="createaprcycle"
                      onClick={this.onClick("createaprcycle")}
                    >
                      <Link to="/appraisal-cycle">
                        <span>Create Appraisal Cycle</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="allaprcycle"
                      onClick={this.onClick("allaprcycle")}
                    >
                      {" "}
                      <Link to="/appraisal-cycles/">
                        <span>All Appraisal Cycles</span>
                      </Link>
                    </Menu.Item>

                    <Menu.Item
                      key="createtemplate"
                      onClick={this.onClick("createtemplate")}
                    >
                      <Link to="/template-config/">
                        <span>Create Teamplate</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="alltemplate"
                      onClick={this.onClick("alltemplate")}
                    >
                      <Link to="/template-list/">
                        <span>All Templates</span>
                      </Link>
                    </Menu.Item>
                  </SubMenu>
                ) : null}
                {/* <Menu.Item key="ContactUs" onClick={this.onClick("ContactUs")}>
                  <Link to={`/contactus/${this.props.user.id}`}>
                    <Icon type="project" />
                    <span>Contact Us</span>
                  </Link>
                </Menu.Item> */}
              </Menu>
            </div>
          </Sider>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.auth.user,
  allgroup: state.group.allgroup
});

export default connect(mapStateToProps, { getGroupListAll })(SideNav);
