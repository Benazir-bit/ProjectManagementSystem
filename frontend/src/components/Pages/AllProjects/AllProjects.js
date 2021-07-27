import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { getTypeProjects } from "../../../actions/projects";
import CommonTable from "../../Common/AllTables/CommonTable";
import TableProgress from "../../Common/AllTables/TableProgress/TableProgress";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import CardBodyOnly from "../../Common/AllCard/CardBodyOnly";
import { Skeleton } from "antd";
import "./AllProjects.css";
import { getTypeNews } from "../../../actions/news";
// import ActivityList from "../../Layout/ActivityList/ActivityList";
import { Layout } from "antd";
const { Content } = Layout;

class AllProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      error: false,
      loading: false,
      projects: [],
      count: null,
      hasMore: true,
      offset: 0,
      limit: 30
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
    console.log("projectsssssss inside", this.props.match.params.type, this.props.match.params.filter)
    axios
      .get(
        `/uspl/api/${this.props.match.params.type}/projects/${this.props.match.params.filter}/${this.props.match.params.id}?offset=${offset}&limit=${limit}`,
        config
      )
      .then(res => {
        const newJournals = res.data.results;
        // console.log("fetching...");
        // console.log(res.data.count);
        // this.state.count = res.data.count;
        // this.state.projects = [...this.state.projects, ...newJournals];
        // this.state.offset = offset + limit;
        this.setState({
          loading: false,
          fetchingData: false,
          count: res.data.count,
          projects: [...this.state.projects, ...newJournals],
          offset: offset + limit
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
    let project_list = [];
    if (this.state.projects.length === 0) {
      if (this.state.loading && this.state.hasMore) {
        for (let i = 0; i < 5; i++) {
          let loadData_skeleton = {
            "Project Title": (
              <Skeleton active loading={true} paragraph={false}></Skeleton>
            ),
            "Started On": (
              <Skeleton active loading={true} paragraph={false}></Skeleton>
            ),
            "Due Date": (
              <Skeleton active loading={true} paragraph={false}></Skeleton>
            ),
            Status: (
              <Skeleton active loading={true} paragraph={false}></Skeleton>
            )
          };
          project_list.push(loadData_skeleton);
        }
      }
      var tableData = {
        columns: ["Project Title", "Started On", "Due Date", "Status"],
        rows: project_list
      };
    } else {
      {
        this.state.projects.map(project => {
          let proj_object = {
            "Project Title": (
              <Link to={`/project-details/${project.id}`}>{project.name}</Link>
            ),
            "Started On": project.started_date,
            "Due Date": project.due_date,
            Status: <TableProgress percent={project.proj_completeion_rate} />
          };
          project_list.push(proj_object);
        });
        if (this.state.loading && this.state.hasMore) {
          for (let i = 0; i < this.state.limit; i++) {
            let loadData_skeleton = {
              "Project Title": (
                <Fragment>
                  <Skeleton active loading={true} paragraph={false}></Skeleton>
                </Fragment>
              ),
              "Started On": (
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
            project_list.push(loadData_skeleton);
          }
        }
      }
      var tableData = {
        columns: ["Project Title", "Started On", "Due Date", "Status"],
        rows: project_list
      };
    }

    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader
                    title={
                      this.props.match.params.type === "group"
                        ? "Group Projects"
                        : this.props.match.params.type === "user"
                          ? "User Projects"
                          : null
                    }
                    title_color={"#337ab7"}
                  />

                  {/* <div
                    style={{ position: "absolute", top: "2.2em", right: "3em" }}
                  >
                    <Search
                      placeholder="input search text"
                      style={{ width: 170 }}
                    />
                  </div> */}

                  <CardBodyOnly BodyId={"my_proj_table"} id={"ProjectCard"}>
                    <CommonTable
                      clsattr={"table ProjectTable"}
                      data={tableData}
                      class_div={"allprojtab"}
                    />
                  </CardBodyOnly>
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
  projects: state.projects.projects
});
export default connect(mapStateToProps, { getTypeProjects, getTypeNews })(
  AllProjects
);
