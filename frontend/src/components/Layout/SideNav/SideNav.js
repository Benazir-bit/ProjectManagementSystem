import React, { Fragment } from "react";
import ImageSideNav from "./ImageSideNav";
import { Layout, Menu } from "antd";
import "./SideNav.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getGroupListAll } from "../../../actions/group";
import {
    // TeamOutlined,
    // UserOutlined,
    MacCommandOutlined,
    // CalendarOutlined,
} from "@ant-design/icons";
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
            management = grp.name === "Core Director" ? true : false;
        });
        //console.log(management, "kkkkkkkkkk");
        if (this.props.user.is_hr) {
            groups = (
                <SubMenu
                    key="grphr"
                    title={
                        <span>
                            <MacCommandOutlined type="team" />
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
                            <MacCommandOutlined type="team" />
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
                                <MacCommandOutlined type="team" />
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
                            <MacCommandOutlined type="team" />
                            <span>{group.name}</span>
                        </Link>
                    </Menu.Item>
                )));
        }
        <SubMenu
            key="grphr"
            title={
                <span>
                    <MacCommandOutlined type="team" />
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
                                <MacCommandOutlined type="issues-close" />
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
                                <MacCommandOutlined type="issues-close" />
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
                    <div id="sidescrollbar" style={{ overflow: "hidden auto" }}>

                        <Menu
                            theme="dark"
                            mode="inline"
                            id="menuSide"
                            openKeys={this.state.openKeys}
                            onOpenChange={this.onOpenChange}
                            SelectedKeys={this.state.selectedKey}
                            style={{ height: "100%" }}
                        >
                            {SideNavProfile}
                            <Menu.Item key="home" onClick={this.onClick("home")}>
                                <Link to="/">
                                    <MacCommandOutlined type="home" theme="filled" />
                                    <span>Dashboard</span>
                                </Link>
                            </Menu.Item>
                            {/* {groups} */}

                            {this.props.user.is_hr ? (
                                <Menu.Item
                                    key="manageMem"
                                    onClick={this.onClick("manageMem")}
                                >
                                    <Link to={`/allmembers/all`}>
                                        <MacCommandOutlined type="usergroup-add" />
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
                                        <MacCommandOutlined type="user-add" />
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
                                        <MacCommandOutlined type="user-add" />
                                        <span>Manage groups</span>
                                    </Link>
                                </Menu.Item>
                            ) : null}

                            {this.props.user.is_hr ? (
                                <Menu.Item key="hrDesig" onClick={this.onClick("hrDesig")}>
                                    <Link to="/jobtitle">
                                        <MacCommandOutlined type="cluster" />
                                        <span>Designations</span>
                                    </Link>
                                </Menu.Item>
                            ) : null}

                            {!this.props.user.is_staff &&
                                !this.props.user.is_fna &&
                                !this.props.user.is_hr ? (
                                <Menu.Item key="project" onClick={this.onClick("project")}>
                                    <Link to={`/user/projects/all/${this.props.user.id}`}>
                                        <MacCommandOutlined type="project" />
                                        <span>My Projects</span>
                                    </Link>
                                </Menu.Item>
                            ) : null}

                            {!this.props.user.is_staff &&
                                !this.props.user.is_fna &&
                                !this.props.user.is_hr ? (
                                <Menu.Item key="myTask" onClick={this.onClick("myTask")}>
                                    <Link to={`/user/tasks/current/${this.props.user.id}`}>
                                        <MacCommandOutlined type="file-protect" />
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
                                        <MacCommandOutlined type="area-chart" />
                                        <span>KPI</span>
                                    </Link>
                                </Menu.Item>
                            ) : null}

                            {issue_menu}
                            {/* {!this.props.user.is_staff &&
                                    !this.props.user.is_fna &&
                                    !this.props.user.is_hr ? (
                                    <SubMenu
                                        key="reportsub"
                                        title={
                                            <span>
                                                <MacCommandOutlined type="container" />
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
                                ) : null} */}
                            {/* 
                                {this.props.user.is_hr ? (
                                    <SubMenu
                                        key="hrNotice"
                                        title={
                                            <span>
                                                <MacCommandOutlined type="fund" />
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
                                            <MacCommandOutlined type="notification" />
                                            <span>Notice Board</span>
                                        </Link>
                                    </Menu.Item>
                                )} */}
                            {/*                                        
                                <Menu.Item key="ContactUs" onClick={this.onClick("ContactUs")}>
                                    <Link to={`/contactus/${this.props.user.id}`}>
                                        <MacCommandOutlined type="project" />
                                        <span>Contact Us</span>
                                    </Link>
                                </Menu.Item> */}

                            {/* <Menu.Item key="ContactUs" onClick={this.onClick("ContactUs")}>
                  <Link to={`/contactus/${this.props.user.id}`}>
                    <MacCommandOutlined type="project" />
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

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.auth.user,
    allgroup: state.group.allgroup
});

export default connect(mapStateToProps, { getGroupListAll })(SideNav);
