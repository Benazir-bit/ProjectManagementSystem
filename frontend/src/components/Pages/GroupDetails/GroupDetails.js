import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getGroupDetails } from "../../../actions/group";
import { getTypeProjects } from "../../../actions/projects";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import GroupMembers from "./GroupMembers/GroupMembers";
import AllCardBody from "../../Common/AllCard/AllCardBody";
import GroupInfo from "./GroupInfo/GroupInfo";
import CommonTable from "../../Common/AllTables/CommonTable";
import TableProgress from "../../Common/AllTables/TableProgress/TableProgress";
import { Link } from "react-router-dom";
import { Skeleton, List } from "antd";
import "./GroupDetails.css";
import AllButton from "../../Common/AllButton/AllButton";
import AddProjectModal from "../../Common/Modals/AddProjectModal/AddProjectModal";
import CardBodyOnly from "../../Common/AllCard/CardBodyOnly";
// import ActivityList from "../../Layout/ActivityList/ActivityList";
import { Layout } from "antd";
import Page404 from "../../Common/404Page/404Page";
import { getTypeTaskOverview } from "../../../actions/task";
const { Content } = Layout;
class GroupDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      update: false
    };
  }
  componentDidMount() {
    this.setState({ fetchingData: true });
    this.props.getGroupDetails(this.props.match.params.id);
    this.props.getTypeProjects("group", "ongoing", this.props.match.params.id);
    this.props.getTypeTaskOverview("group", this.props.match.params.id);
  }
  componentWillReceiveProps() {
    this.setState({ fetchingData: false });
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.setState({ update: true });
      // (update = true), 
      this.props.getGroupDetails(this.props.match.params.id);
      this.props.getTypeProjects(
        "group",
        "ongoing",
        this.props.match.params.id
      );
      this.props.getTypeTaskOverview("group", this.props.match.params.id);
    }
  }

  render() {
    // if (!this.props.projects) {
    //   return null;
    // }
    // const { fetchingData } = this.state;
    let project_list = [];
    if (!this.props.projects) {
      for (let i = 0; i < 3; i++) {
        let proj_object = {
          "Project Title": <Skeleton active loading={true} paragraph={false} />,
          "Started On": <Skeleton active loading={true} paragraph={false} />,
          "Due Date": <Skeleton active loading={true} paragraph={false} />,
          Status: <Skeleton active loading={true} paragraph={false} />
        };
        project_list.push(proj_object);
      }
    } else {
      this.props.projects.map(project => {
        let proj_object = {
          "Project Title": (
            <Link to={`/project-details/${project.id}`}>{project.name}</Link>
          ),
          "Started On": project.created_date,
          "Due Date": project.due_date,
          Status: <TableProgress percent={project.proj_completeion_rate} />
        };
        project_list.push(proj_object);
      });
    }
    var tableData = {
      columns: ["Project Title", "Started On", "Due Date", "Status"],
      rows: project_list
    };

    let inGroup = false;
    if (!this.props.user.is_staff) {
      inGroup = this.props.user.groups.map(userGrp => {
        return userGrp.id === parseInt(this.props.match.params.id, 10)
          ? true
          : null;
      });
    } else {
      inGroup = true;
    }

    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  {!inGroup ? (
                    <Page404 />
                  ) : (
                    <Fragment>
                      <TitleHeader
                        title={this.props.group ? this.props.group.name : null}
                        title_color={"#337ab7"}
                      />
                      <div className="col-sm-12 col-md-8 col-xs-12">
                        <GroupInfo
                          group={this.props.group}
                          id={this.props.match.params.id}
                        // fetchingData={fetchingData}
                        />
                      </div>

                      <div className="col-sm-12 col-md-4 col-xs-12">
                        <CardBodyOnly>
                          <Fragment>
                            <center>
                              {this.props.user.is_teamleader ||
                                this.props.user.is_staff ? (
                                this.props.group ? (
                                  <List
                                    className="list-group-item detailBtn"
                                    style={{ display: "inline-table" }}
                                  >
                                    <AddProjectModal
                                      group={this.props.group}
                                      // group={this.props.group.id}
                                      user={this.props.user.id}
                                    />
                                    &emsp;
                                    <Fragment>
                                      {" "}
                                      <AllButton
                                        btnhref={`/group/projects/all/${this.props.group.id}`}
                                        btnclassName={"btn btn-success"}
                                        name={"View All Projects"}
                                        id={"AllProjBtn"}
                                      />
                                      <br />
                                      <AllButton
                                        btnhref={`/group-issues/group/${this.props.group.id}`}
                                        btnclassName={"btn btn-info"}
                                        name={"Group Issues"}
                                        id={"AllIssueBtn"}
                                      />
                                    </Fragment>
                                  </List>
                                ) : (
                                  <List>
                                    <Skeleton
                                      loading={true}
                                      paragraph={false}
                                      title={{ width: 70 }}
                                    />
                                    <Skeleton
                                      loading={true}
                                      paragraph={false}
                                      title={{ width: 70 }}
                                    />
                                    <Skeleton
                                      loading={true}
                                      paragraph={false}
                                      title={{ width: 70 }}
                                    />
                                  </List>
                                )
                              ) : this.props.group ? (
                                <List
                                  className="list-group-item detailBtn"
                                  style={{ display: "inline-table" }}
                                >
                                  <AllButton
                                    btnhref={`/group/projects/all/${this.props.group.id}`}
                                    btnclassName={"btn btn-success"}
                                    name={"View All Projects"}
                                    id={"AllProjBtn"}
                                  />{" "}
                                  &emsp;
                                  <AllButton
                                    btnhref={`/group-issues/group/${this.props.group.id}`}
                                    btnclassName={"btn btn-info"}
                                    name={"Group Issues"}
                                    id={"AllIssueBtn"}
                                  />
                                </List>
                              ) : (
                                <List>
                                  <Skeleton
                                    loading={true}
                                    paragraph={false}
                                    title={{ width: 70 }}
                                  />
                                  <Skeleton
                                    loading={true}
                                    paragraph={false}
                                    title={{ width: 70 }}
                                  />
                                  <Skeleton
                                    loading={true}
                                    paragraph={false}
                                    title={{ width: 70 }}
                                  />
                                </List>
                              )}
                            </center>
                          </Fragment>
                        </CardBodyOnly>

                        <GroupMembers group={this.props.group} />
                      </div>

                      <div className="row">
                        <div
                          className="col-sm-12"
                          style={{ padding: "0 2em 0 2em" }}
                        >
                          <AllCardBody
                            BodyId={"GroupAllProj"}
                            cardTitle={"Ongoing Projects"}
                          >
                            <CommonTable
                              clsattr={" table ProjectTable"}
                              width={"200%"}
                              data={tableData}
                              class_div={"GroupAllProj"}
                            />
                          </AllCardBody>
                        </div>
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Content>
        {/* {this.props.group ? (
          <ActivityList id={this.props.group.id} type={"group"} />
        ) : null} */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  group: state.group.group,
  user: state.auth.user,
  // user: state.auth.user.id,
  projects: state.projects.group_projects
});

export default connect(mapStateToProps, {
  getGroupDetails,
  getTypeProjects,
  getTypeTaskOverview
})(GroupDetails);
