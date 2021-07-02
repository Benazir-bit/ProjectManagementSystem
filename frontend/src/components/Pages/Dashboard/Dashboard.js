import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import "./Dashboard.css";
import { getTypeProjects } from "../../../actions/projects";
import { getAdminDashboardProjects } from "../../../actions/projects";
import { getTypeTaskOverview, getTypeTasks } from "../../../actions/task";
import { getTypeIssues } from "../../../actions/issues";
import { getTypeNotices } from "../../../actions/notice";
import { getDashPanelData } from "../../../actions/profile";
import { getGroupList } from "../../../actions/group";
import { getRequests } from "../../../actions/accounts";
import NoData from "../../Common/NoData/NoData";

import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import SliderCardSection from "../Dashboard/SliderCardSection/SliderCardSection";
import HRSliderCardSection from "../Dashboard/SliderCardSection/HRSliderCardSection";
import CurrentTasksPie from "../Dashboard/CurrentTasksPie/CurrentTasksPie";
import NoticeSlider from "../../Common/NoticeSlider/NoticeSlider";
import MyProject from "./MyProject/MyProject";
import CurrentTask from "./CurrentTask/CurrentTask";
import MyIssues from "./MyIssues/MyIssues";
import ActivityList from "../../Layout/ActivityList/ActivityList";
import HRTable from "./HRTable/HRTable";
// import DashboardFNA from "../Accounts/AccountDashboard/DashboardFNA";
const { Content } = Layout;
class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getTypeNotices("onboard");
    if (
      !this.props.user.is_staff &&
      !this.props.user.is_hr &&
      !this.props.user.is_fna
    ) {
      this.props.getTypeTaskOverview("user", this.props.user.id);
      this.props.getTypeProjects("user", "ongoing", this.props.user.id);
      this.props.getTypeTasks("user", "current", this.props.user.id);
      this.props.getTypeIssues("user", "unresolved", this.props.user.id);
      this.props.getDashPanelData();
    } else if (this.props.user.is_hr) {
      this.props.getDashPanelData();
      this.props.getGroupList();
    } else if (this.props.user.is_fna) {
      this.props.getRequests();
    } else if (this.props.user.is_staff) {
      this.props.getAdminDashboardProjects();
    }
  }

  render() {
    let dash_content;
    if (this.props.user.is_staff) {
      dash_content = this.props.group_projects
        ? this.props.group_projects.map(group => (
          <Fragment key={group.id}>
            <br />
            <div className="col-sm-12" style={{ marginTop: 15 }}>
              <div className="col-lg-8 col-md-12">
                <MyProject
                  type="group"
                  id={group.id}
                  title={group.name}
                  projects={group.project_set}
                />
              </div>
              <div className="col-lg-4 col-md-12">
                <CurrentTasksPie
                  cardTitle={"Task Overview"}
                  overview={group.overview}
                  id={`pie_group_${group.id}`}
                />
              </div>
            </div>
          </Fragment>
        ))
        : null;
    } else {
      if (this.props.user.is_hr) {
        dash_content = (
          <Fragment>
            <HRSliderCardSection />
            <div className="col-sm-12" style={{ marginTop: 15 }}>
              <HRTable />
              {/* <DashboardFNA /> */}
            </div>
          </Fragment>
        );
      } else {
        dash_content = (
          <Fragment>
            <SliderCardSection />
            <div className="col-sm-12" style={{ marginTop: 15 }}>
              <div className="col-lg-8 col-md-12">
                <MyProject
                  title="My Projects"
                  projects={this.props.user_projects}
                  user={this.props.user}
                />
              </div>
              <div className="col-lg-4 col-md-12">
                <CurrentTasksPie
                  overview={this.props.overview}
                  cardTitle={"Current Tasks"}
                />
              </div>
            </div>
            <div className="col-sm-12" style={{ marginTop: 15 }}>
              <CurrentTask user={this.props.user} tasks={this.props.tasks} />
            </div>
            <div className="col-sm-12" style={{ marginTop: 15 }}>
              <MyIssues user={this.props.user} />
            </div>
          </Fragment>
        );
      }
    }
    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader title={"Dashboard"} title_color={"#337ab7"} />
                  {this.props.notices ? (
                    this.props.notices.length != 0 ? (
                      <NoticeSlider notices={this.props.notices} />
                    ) : null
                  ) : null}
                  <br />
                  {dash_content}
                </div>
              </div>
            </div>
          </div>
        </Content>

        {/* <ActivityList id={this.props.user.id} type={"all"} /> */}
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  notices: state.notice.notices,
  user: state.auth.user,
  user_projects: state.projects.projects,
  group_projects: state.projects.adminprojects,
  overview: state.taskoverview.overview,
  tasks: state.tasks.tasks
});
export default connect(mapStateToProps, {
  getTypeNotices,
  getTypeProjects,
  getAdminDashboardProjects,
  getTypeTaskOverview,
  getTypeTasks,
  getDashPanelData,
  getTypeIssues,
  getGroupList,
  getRequests
})(Dashboard);
