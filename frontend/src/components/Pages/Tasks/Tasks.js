import React, { Component, Fragment } from "react";
import "./Tasks.css";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import AllCardBody from "../../Common/AllCard/AllCardBody";
import TaskInfo from "./TaskInfo/TaskInfo";
import TaskPieChart from "./TaskPieChart/TaskPieChart";
import { getTypeTasks } from "../../../actions/task";
import { connect } from "react-redux";
import CommonTable from "../../Common/AllTables/CommonTable";
import { Link } from "react-router-dom";
import { Input, Select, Skeleton, Button, Badge } from "antd";
import { getTypeNews } from "../../../actions/news";
import NoData from "../../Common/NoData/NoData";
import ActivityList from "../../Layout/ActivityList/ActivityList";
import { getTypeTaskOverview } from "../../../actions/task";
import { Layout } from "antd";
const { Content } = Layout;

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true
    };
  }
  componentDidMount() {
    this.props.getTypeTasks("user", "current", this.props.match.params.id);
    this.props.getTypeTaskOverview("user", this.props.match.params.id);
    this.setState({ fetchingData: true });
  }
  componentWillReceiveProps() {
    this.setState({ fetchingData: false });
  }
  render() {
    // if (!this.props.tasks) {
    //   return null;
    // }
    let task_list = [];
    let notask = false;
    if (!this.props.tasks) {
      for (let i = 0; i < 3; i++) {
        let task_object = {
          "Task Title": <Skeleton active loading={true} paragraph={false} />,
          Project: <Skeleton active loading={true} paragraph={false} />,
          "Created On": <Skeleton active loading={true} paragraph={false} />,
          "Due Date": <Skeleton active loading={true} paragraph={false} />,
          Status: <Skeleton active loading={true} paragraph={false} />,
          Issues: <Skeleton active loading={true} paragraph={false} />
        };
        task_list.push(task_object);
      }
    } else {
      notask = this.props.tasks.length == 0;
      this.props.tasks.map(task => {
        let task_object = {
          "Task Title": (
            <Link to={`/task-details/${task.id}`}>{task.name}</Link>
          ),
          Project: (
            <Link to={`/project-details/${task.project}`}>
              {task.project_name}
            </Link>
          ),
          "Created On": task.created_date,
          "Due Date": task.deadline,
          Status: task.status,
          // /* {!task.started
          // 	? "Not Started"
          // 	: !task.paused && !task.submitted && !task.completed
          // 	? "Ongoing"
          // 	: task.paused
          // 	? "Paused"
          // 	: task.submitted && !task.completed
          // 	? "Waiting for Review"
          // 	: task.completed
          // 	? "Completed"
          // 	: null} */

          Issues: (
            <Badge
              count={task.issue_count}
              showZero
              style={{
                marginLeft: "12px",
                marginTop: "5px",
                WebkitBoxShadow: "none",
                backgroundColor: task.issue_count == 0 ? "#52c41a" : "#d9534f"
              }}
            />
          )
        };
        task_list.push(task_object);
      });
    }
    var tableData = {
      columns: [
        "Task Title",
        "Project",
        "Created On",
        "Due Date",
        "Status",
        "Issues"
      ],
      rows: task_list
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
                    title={"Current Tasks"}
                    title_color={"#337ab7"}
                  />
                  <br />
                  <div className="col-sm-5" id="kpi_page_col3">
                    <AllCardBody
                      BodyId="dashboard_mytask_table"
                      cardTitle={
                        this.props.overview
                          ? this.props.overview.full_name
                          : null
                      }
                      id="TaskInfoCard"
                    >
                      <TaskInfo />
                    </AllCardBody>
                  </div>
                  <div className="col-sm-7" id="kpi_page_col2">
                    <AllCardBody
                      BodyId="mytask_status_table"
                      cardTitle={"Overview"}
                    // id="TaskStatusCard"
                    >
                      <TaskPieChart />
                    </AllCardBody>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      <br />
                      <AllCardBody
                        BodyId={"userTaskTable"}
                        cardTitle={"Ongoing Tasks"}
                        addextra={
                          <Link
                            to={`/completedtasks/${this.props.match.params.id}`}
                            style={{
                              float: "right",
                              fontSize: "12px",
                              color: "#000e24"
                            }}
                          >
                            View All Tasks
                          </Link>
                        }
                      >
                        {!notask ? (
                          <CommonTable
                            clsattr={"table ProjectTable"}
                            data={tableData}
                            class_div={"GroupAllProj"}
                          />
                        ) : (
                          <Fragment>
                            <NoData />
                          </Fragment>
                        )}
                      </AllCardBody>
                      <br />
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Content>
        {/* <ActivityList id={this.props.match.params.id} type={"all"} /> */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks.tasks,
  user: state.auth.user,
  overview: state.taskoverview.overview
});

export default connect(mapStateToProps, { getTypeTasks, getTypeTaskOverview })(
  Tasks
);
