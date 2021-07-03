import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getTaskDetails } from "../../../actions/task";
import { getProjectDetails } from "../../../actions/projects";
import { getTypeMembers } from "../../../actions/member";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import IssueCardBody from "../../Common/AllCard/IssueCardBody";
import TaskAssign from "../../Common/DetailCard/TaskAssign";
import DetailCard from "../../Common/DetailCard/DetailCard";
import SupervisorFeedBack from "./SupervisorFeedBack/SupervisorFeedBack";
import CommonTable from "../../Common/AllTables/CommonTable";
import { Skeleton, Button, Icon } from "antd";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import { Link } from "react-router-dom";
import ActivityList from "../../Layout/ActivityList/ActivityList";
import { Layout } from "antd";
import NoData from "../../Common/NoData/NoData";
import "./TaskDetails.css";
const { Content } = Layout;

class TaskDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true
    };
  }

  componentDidMount() {
    this.props.getTaskDetails(this.props.match.params.id);
    this.props.getTypeMembers("member-group", this.props.match.params.id);
    this.setState({
      fetchingData: true
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ fetchingData: false });
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.props.getTaskDetails(nextProps.match.params.id);
      this.setState({
        fetchingData: true
      });
    }
  }

  render() {
    const { task, project } = this.props;

    let taskissue_list = [];
    let notask = false;
    if (!this.props.task) {
      for (let i = 0; i < 3; i++) {
        let taskissue_object = {
          "Issue Name": <Skeleton active loading={true} paragraph={false} />,
          "Raised By": <Skeleton active loading={true} paragraph={false} />,
          Solved: <Skeleton active loading={true} paragraph={false} />,
          "Solved By": <Skeleton active loading={true} paragraph={false} />
        };
        taskissue_list.push(taskissue_object);
      }
    } else {
      notask = this.props.task.issue_set.length == 0;
      this.props.task.issue_set.map(issue => {
        let taskissue_object = {
          "Issue Name": (
            <Link to={`/issue-details/${issue.id}`}>{issue.name}</Link>
          ),
          "Raised By": (
            <Fragment>
              <div style={{ display: "inline-block" }}>
                <ImageSmall
                  clsattr="img-circle"
                  id="SolvedImg"
                  srcfile={issue.raised_by.image}
                />{" "}
              </div>
              &emsp;
              <div style={{ display: "inline-table" }}>
                <Link
                  to={`/profile/${issue.raised_by.id}`}
                  className="SolvedName"
                >
                  {issue.raised_by.full_name}
                </Link>
                <br />
                <small className="text-muted" id="SolvedOn">
                  On {issue.raised_date}
                </small>
              </div>
            </Fragment>
          ),
          // Solved: issue.solved ? <Icon type="check" /> : <Icon type="close" />,
          "Solved By": (
            <Fragment>
              {issue.solved ? (
                <Link to={`/profile/${issue.solved_by.id}`}>
                  <ImageSmall
                    clsattr="img-circle"
                    altname="Rashik"
                    srcfile={issue.solved_by.image}
                  />
                </Link>
              ) : (
                "None"
              )}
            </Fragment>
          )
        };
        taskissue_list.push(taskissue_object);
      });
    }
    var tableData = {
      columns: ["Issue Name", "Raised By", "Solved", "Solved By"],
      rows: taskissue_list
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
                    title={task ? task.name : null}
                    title_color={"#337ab7"}
                  />
                  <br />
                  <div className="row">
                    <div className="col-sm-12 col-xs-12 col-md-7">
                      <DetailCard
                        detailHead={"Details"}
                        detailTag={"Notes"}
                        task={task}
                        id="card_details"
                      />
                    </div>
                    <div className="col-sm-12 col-xs-12 col-md-5">
                      <TaskAssign
                        task={task}
                        user={this.props.user}
                        id="taskAssignCard"
                      />
                    </div>
                  </div>
                  <br />

                  <div>
                    <IssueCardBody
                      BodyId={"my_issue_table"}
                      id={"TaskIssueCard"}
                      cardTitle="Issues"
                    >
                      {!notask ? (
                        <CommonTable
                          clsattr={"table taskissueTable"}
                          data={tableData}
                          class_div={"taskissuetab"}
                        />
                      ) : (
                        <Fragment>
                          <NoData />
                        </Fragment>
                      )}
                    </IssueCardBody>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      <SupervisorFeedBack
                        task={task}
                        title="Supervisor's Feedbacks"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Content>
        {/* <ActivityList id={this.props.match.params.id} type={"task"} /> */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  task: state.tasks.task,
  user: state.auth.user
});

export default connect(mapStateToProps, {
  getTaskDetails,
  getProjectDetails,
  getTypeMembers
})(TaskDetails);
