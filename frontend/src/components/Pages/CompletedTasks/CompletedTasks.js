import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getTypeTasks } from "../../../actions/task";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import CardBodyOnly from "../../Common/AllCard/CardBodyOnly";
import { Skeleton, Badge } from "antd";
import CommonTable from "../../Common/AllTables/CommonTable";
import { Layout } from "antd";
// import ActivityList from "../../Layout/ActivityList/ActivityList";
import axios from "axios";

const { Content } = Layout;

class CompletedTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      error: false,
      loading: false,
      ctasks: [],
      count: null,
      hasMore: true,
      offset: 0,
      limit: 20
    };
    window.onscroll = () => {
      const {
        state: { error, loading, hasMore }
      } = this;

      this.state.hasMore =
        this.state.offset / this.state.limit + 1 <=
        Math.ceil(this.state.count / this.state.limit);
      if (error || loading || !hasMore) return;

      //divided by limit
      if (hasMore) {
        if (
          Math.ceil(
            document.documentElement.scrollHeight - window.pageYOffset
          ) === document.documentElement.clientHeight ||
          Math.ceil(
            document.documentElement.scrollHeight - window.pageYOffset
          ) +
          1 ===
          document.documentElement.clientHeight ||
          Math.ceil(
            document.documentElement.scrollHeight - window.pageYOffset
          ) -
          1 ===
          document.documentElement.clientHeight ||
          Math.round(
            document.documentElement.scrollHeight - window.pageYOffset
          ) === document.documentElement.clientHeight
        ) {
          this.loadData();
        }
      }
    };
  }

  loadData = () => {
    // console.log(localStorage.getItem("token"));
    //GET TOKEN FROM STATE
    const token = localStorage.getItem("token");

    //HEADERS
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // IF TOKEN AVAILABLE, ADD TO HEADER (AUTHORIZATION)
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    this.setState({ loading: true, fetchingData: true });
    const { offset, limit } = this.state;
    axios
      .get(
        `/uspl/api/user/tasks/all/${this.props.match.params.id}?offset=${offset}&limit=${limit}`,
        config
      )
      .then(res => {
        const newJournals = res.data.results;
        this.state.count = res.data.count;
        this.state.ctasks = [...this.state.ctasks, ...newJournals];
        this.state.offset = offset + limit;
        this.setState({
          loading: false,
          fetchingData: false
        });
      })
      .catch(err => {
        this.setState({
          error: true,
          loading: false
        });
      });
  };
  componentWillMount() {
    this.setState({
      fetchingData: true,
      loading: true
    });
    this.loadData();
  }
  render() {
    let completetask_list = [];

    if (this.state.ctasks.length === 0) {
      if (this.state.loading && this.state.hasMore) {
        for (let i = 0; i < this.state.limit; i++) {
          let loadData_skeleton = {
            "Task Title": (
              <Fragment>
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              </Fragment>
            ),
            Project: (
              <Fragment>
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              </Fragment>
            ),
            "Created On": (
              <Fragment>
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              </Fragment>
            ),
            "Due Date": (
              <Fragment>
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              </Fragment>
            ),
            Status: (
              <Fragment>
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              </Fragment>
            )
          };
          completetask_list.push(loadData_skeleton);
        }
      }
    } else {
      {
        this.state.ctasks.map(task => {
          let completetask_object = {
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
            Issues: (
              <Badge
                count={task.issue_count}
                showZero
                style={{
                  marginLeft: "12px",
                  marginTop: "5px",
                  WebkitBoxShadow: "none",
                  backgroundColor: task.issue_count === 0 ? "#52c41a" : "#d9534f"
                }}
              />
            )
          };
          completetask_list.push(completetask_object);
        });
        if (this.state.loading && this.state.hasMore) {
          for (let i = 0; i < this.state.limit; i++) {
            let loadData_skeleton = {
              "Task Title": (
                <Fragment>
                  <Skeleton active loading={true} paragraph={false}></Skeleton>
                </Fragment>
              ),
              Project: (
                <Fragment>
                  <Skeleton active loading={true} paragraph={false}></Skeleton>
                </Fragment>
              ),
              "Created On": (
                <Fragment>
                  <Skeleton active loading={true} paragraph={false}></Skeleton>
                </Fragment>
              ),
              "Due Date": (
                <Fragment>
                  <Skeleton active loading={true} paragraph={false}></Skeleton>
                </Fragment>
              ),
              Status: (
                <Fragment>
                  <Skeleton active loading={true} paragraph={false}></Skeleton>
                </Fragment>
              )
            };
            completetask_list.push(loadData_skeleton);
          }
        }
      }
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
      rows: completetask_list
    };
    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  {/* <TitleHeader
                  title={
                    this.props.match.params.type == "group"
                      ? "Group Projects"
                      : this.props.match.params.type == "user"
                      ? "User Projects"
                      : null
                  }
                  title_color={"#337ab7"}
                /> */}
                  <TitleHeader
                    title={
                      this.props.match.params.id === this.props.user.id
                        ? "My Tasks"
                        : "All Tasks"
                    }
                    title_color={"#337ab7"}
                  />
                  <CardBodyOnly BodyId={"complete_task_table"} id={"TaskCard"}>
                    {/* <div style={{ textAlign: "end", paddingRight: "2em" }}>
                      <Search
                        placeholder="input search text"
                        style={{ width: 200, padding: "10px" }}
                      />
                    </div> */}
                    <CommonTable
                      clsattr={"table issueTable"}
                      data={tableData}
                      class_div={"issuetab"}
                    />
                  </CardBodyOnly>
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

//export default CompletedTasks;

const mapStateToProps = state => ({
  tasks: state.tasks.tasks,
  user: state.auth.user
});
export default connect(mapStateToProps, { getTypeTasks })(CompletedTasks);
