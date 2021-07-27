import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  getProjectDetails
  , getprojectchart 
} from "../../../actions/projects";
import { getTypeMembers } from "../../../actions/member";
import { getTypeTasks } from "../../../actions/task";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import ProjectMembers from "./ProjectMembers/ProjectMembers";
import AllCardBody from "../../Common/AllCard/AllCardBody";
import ProjectInfo from "./ProjectInfo/ProjectInfo";
import CommonTable from "../../Common/AllTables/CommonTable";
import "./ProjectDetails.css";
import CardBodyOnly from "../../Common/AllCard/CardBodyOnly";
import { Select, Skeleton, List } from "antd";
import { Link } from "react-router-dom";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import ProjectUpdateModal from "../../Common/Modals/ProjectUpdateModal/ProjectUpdateModal";
import DeleteModal from "../../Common/Modals/DeleteModal/DeleteModal";
import AddTaskModal from "../../Common/Modals/AddTaskModal/AddTaskModal";
import NoData from "../../Common/NoData/NoData";
import ProjectGanttChart from "./ProjectGanttChart/ProjectGanttChart"
// import ActivityList from "../../Layout/ActivityList/ActivityList";
import { Layout } from "antd";
import AddTaskUserModal from "../../Common/Modals/AddTaskModal/AddTaskUserModal";
const { Content } = Layout;
const { Option } = Select;

class ProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      tasks: this.props.getTypeTasks(
        "project",
        "all",
        this.props.match.params.id
      )
    };
  }

  componentDidMount() {
    this.props.getProjectDetails(this.props.match.params.id);
    this.props.getTypeMembers("project-group", this.props.match.params.id);
    this.props.getprojectchart(this.props.match.params.id)
    this.setState({ fetchingData: true });
  }

  componentWillReceiveProps() {
    this.setState({ fetchingData: false });
  }

  selectOption = value => {
    if (value == "Ongoing") {
      this.setState({
        tasks: this.props.getTypeTasks(
          "project",
          "ongoing",
          this.props.match.params.id
        )
      });
    } else if (value == "Not Started Yet") {
      this.setState({
        tasks: this.props.getTypeTasks(
          "project",
          "not-started",
          this.props.match.params.id
        )
      });
    } else if (value == "Paused") {
      this.setState({
        tasks: this.props.getTypeTasks(
          "project",
          "paused",
          this.props.match.params.id
        )
      });
    } else if (value == "Waiting For Review") {
      this.setState({
        tasks: this.props.getTypeTasks(
          "project",
          "waiting-for-review",
          this.props.match.params.id
        )
      });
    } else if (value == "Completed") {
      this.setState({
        tasks: this.props.getTypeTasks(
          "project",
          "completed",
          this.props.match.params.id
        )
      });
    } else {
      this.setState({
        tasks: this.props.getTypeTasks(
          "project",
          "all",
          this.props.match.params.id
        )
      });
    }
  };
  render() {
    if (!this.props.project) {
      return <Skeleton active loading={true} paragraph={true} />;
    }
    const { project } = this.props;

    let project_list = [];
    let notask = false;
    if (!this.props.tasks) {
      for (let i = 0; i < 3; i++) {
        let proj_object = {
          "Task Title": <Skeleton active loading={true} paragraph={false} />,
          "Created On": <Skeleton active loading={true} paragraph={false} />,
          "Due Date": <Skeleton active loading={true} paragraph={false} />,
          "Assigned To": <Skeleton active loading={true} paragraph={false} />,
          Status: <Skeleton active loading={true} paragraph={false} />
        };
        project_list.push(proj_object);
      }
    } else {
      notask = this.props.tasks.length == 0;
      this.props.tasks.map(task => {
        let proj_object = {
          "Task Title": (
            <Link key={task.id} to={`/task-details/${task.id}`}>
              <span
                className="ant-table-row-indent indent-level-0"
                style={{ paddingLeft: "0px" }}
              />
              {task.name}
            </Link>
          ),
          "Created On": task.created_date,
          "Due Date": task.deadline,
          "Assigned To": (
            <Fragment>
              <Link to={`/profile/${task.assigned_to.id}`}>
                <ImageSmall
                  clsattr={"img-circle"}
                  width={"30"}
                  height={"30"}
                  altname={task.assigned_to.full_name}
                  srcfile={task.assigned_to.image}
                />
              </Link>

              <Link to={`/profile/${task.assigned_to.id}`}>
                {task.assigned_to.full_name}
              </Link>
            </Fragment>
          ),
          Status: <Fragment>{task.status}</Fragment>
        };
        project_list.push(proj_object);
      });
    }
    var tableData = {
      columns: [
        "Task Title",
        "Created On",
        "Due Date",
        "Assigned To",
        "Status"
      ],
      rows: project_list
    };

    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader
                    title={project ? project.details.name : null}
                    title_color={"#337ab7"}
                  />
                  <div className="col-sm-12 col-xs-12 col-md-12 col-lg-9">
                    <ProjectInfo project={project} />
                  </div>

                  <div className="col-sm-12 col-xs-12 col-md-12 col-lg-3">
                    {this.props.project ? (
                      project.details.completed == false ? (
                        this.props.user.is_teamleader ||
                          this.props.user.is_staff ||
                          this.props.user.id ==
                          this.props.project.details.supervisor ? (
                          <CardBodyOnly id="ProjDetailAllBtn">
                            <center className="wrapper">
                              <List
                                className="list-group-item"
                                style={{ display: "inline-table" }}
                              >
                                <AddTaskModal
                                  project={this.props.project.details}
                                  members={this.props.members}
                                />
                                <br />
                                <ProjectUpdateModal
                                  project={this.props.project.details}
                                  members={this.props.members}
                                />
                                <br />
                                <DeleteModal
                                  project={project.details.name}
                                  id={project.details.id}
                                />
                              </List>
                            </center>
                          </CardBodyOnly>
                        ) : (
                          this.props.project.details.members.map(mem =>
                            mem === this.props.user.id ? (
                              <CardBodyOnly id="ProjDetailAllBtn">
                                <center className="wrapper">
                                  <List
                                    className="list-group-item"
                                    style={{ display: "inline-table" }}
                                  >
                                    <AddTaskUserModal
                                      project={project.details}
                                      members={this.props.members}
                                    />
                                  </List>
                                </center>
                              </CardBodyOnly>
                            ) : null
                          )
                        )
                      ) : null
                    ) : (
                      <CardBodyOnly id="ProjDetailAllBtn">
                        <center
                          className="wrapper"
                          style={{ padding: "0px 20px" }}
                        >
                          <Skeleton active loading={true} paragraph={true} />
                        </center>
                      </CardBodyOnly>
                    )}
                    <ProjectMembers project={this.props.project} />
                  </div>

                  <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                    <AllCardBody
                      BodyId={"ProjectDetailCard"}
                      cardTitle={"Project Gantt Chart"}
                    >
                      <ProjectGanttChart project_chart={this.props.project_chart}/>
                    </AllCardBody>
                  </div>
                  <div className="row">
                    <div
                      className="col-sm-12"
                      style={{ padding: "0 2em 0 2em" }}
                    >
                      <AllCardBody
                        BodyId={"ProjectDetailCard"}
                        cardTitle={"Project Tasks"}
                      >
                        <div
                          className="taskDropDown"
                          style={{
                            position: "absolute",
                            top: "3em",
                            right: "0em"
                          }}
                        >
                          <Select
                            style={{
                              width: "200px",
                              float: "right",
                              paddingRight: "24px"
                            }}
                            defaultValue="All"
                            onChange={this.selectOption}
                          >
                            <Option value="All">All</Option>
                            <Option value="Ongoing">Ongoing</Option>
                            <Option value="Not Started Yet">
                              Not Started Yet
                            </Option>
                            <Option value="Paused">Paused</Option>
                            <Option value="Waiting For Review">
                              Waiting for Review
                            </Option>
                            <Option value="Completed">Completed</Option>
                          </Select>
                        </div>

                        {!notask ? (
                          <CommonTable
                            clsattr={"table ProjectDetails"}
                            data={tableData}
                            class_div={"GroupAllProj"}
                          />
                        ) : (
                          <Fragment>
                            <NoData />
                          </Fragment>
                        )}
                      </AllCardBody>
                    </div>
                  </div>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </Content>
        {/* <ActivityList id={this.props.match.params.id} type={"project"} /> */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  project: state.projects.project,
  members: state.member.members,
  user: state.auth.user,
  tasks: state.tasks.tasks,
  project_chart: state.projects.project_chart
});

export default connect(mapStateToProps, {
  getProjectDetails,
  getTypeMembers,
  getTypeTasks,
  getprojectchart
})(ProjectDetails);
