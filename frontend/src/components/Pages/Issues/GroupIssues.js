import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getTypeIssues } from "../../../actions/issues";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import CardBodyOnly from "../../Common/AllCard/CardBodyOnly";
import CommonTable from "../../Common/AllTables/CommonTable";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import { Input, Icon, Skeleton } from "antd";
import "./Issues.css";
import axios from "axios";
import { tokenConfig } from "../../../actions/auth";
import ActivityList from "../../Layout/ActivityList/ActivityList";
import { Layout } from "antd";
const { Content } = Layout;
const { Search } = Input;

class GroupIssues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      error: false,
      loading: false,
      issues: [],
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
    //GET TOKEN FROM STATE
    const token = localStorage.getItem("token");
    var qtype;
    var qfilter;
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

    if (this.props.match.params.type == "group") {
      qtype = "group";
      qfilter = "all";
    } else if (this.props.match.params.type == "user") {
      qtype = "user";
      qfilter = "group";
    }
    axios
      .get(
        `/uspl/api/${qtype}/issues/${qfilter}/${this.props.match.params.id}?offset=${offset}&limit=${limit}`,
        config
      )
      .then(res => {
        const newJournals = res.data.results;
        this.state.count = res.data.count;
        this.state.issues = [...this.state.issues, ...newJournals];
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
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.state.offset = 0;
      this.setState({
        //offset: 0,
        fetchingData: true,
        loading: true,
        error: false,
        issues: [],
        count: null,
        hasMore: true,
        limit: 20
      });
      this.loadData();
    }
  }

  render() {
    if (!this.state.issues) {
      return null;
    }
    const fetchingData = this.state.fetchingData;

    let issue_list = [];

    if (this.state.issues.length == 0) {
      if (this.state.loading && this.state.hasMore) {
        for (let i = 0; i < this.state.limit; i++) {
          let loadData_skeleton = {
            "Issue Name": (
              <Fragment>
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              </Fragment>
            ),
            "Task Name": (
              <Fragment>
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              </Fragment>
            ),
            "Raised By": (
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
          issue_list.push(loadData_skeleton);
        }
      }
    } else {
      {
        this.state.issues.map((issue, i) => {
          let issue_object = {
            "Issue Name": (
              <Skeleton active loading={false} paragraph={false}>
                <span
                  className="ant-table-row-indent indent-level-0"
                  style={{ paddingLeft: "0px" }}
                />
                <Link to={`/issue-details/${issue.id}`}>{issue.name}</Link>
              </Skeleton>
            ),
            "Task Name": (
              <Skeleton active loading={false} paragraph={false}>
                <Link to={`/task-details/${issue.task}`}>
                  {issue.task_name}
                </Link>
              </Skeleton>
            ),
            "Raised By": (
              <Skeleton active loading={false} paragraph={false}>
                {this.props.type === "raised" ? (
                  issue.raised_date
                ) : (
                  <Fragment>
                    <div style={{ display: "inline-block" }}>
                      <ImageSmall
                        clsattr="img-circle"
                        id="SolvedImg"
                        srcfile={issue.raised_by.image}
                      />{" "}
                    </div>

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
                )}
              </Skeleton>
            ),
            Status: (
              <Skeleton active loading={false} paragraph={false}>
                {issue.solved ? (
                  <Fragment>
                    <div style={{ display: "inline-block" }}>
                      {/* <Icon
                        type="check-circle"
                        theme="twoTone"
                        twoToneColor="#52c41a"
                        id="SolvedIcon"
                      /> */}
                      &nbsp;
                      <ImageSmall
                        clsattr="img-circle"
                        id="SolvedImg"
                        srcfile={issue.solved_by.image}
                      />{" "}
                    </div>

                    <div style={{ display: "inline-table" }}>
                      <Link
                        to={`/profile/${issue.solved_by.id}`}
                        className="SolvedName"
                      >
                        {issue.solved_by.full_name}
                      </Link>
                      <br />

                      <small className="text-muted" id="SolvedOn">
                        On {issue.solved_date}
                      </small>
                    </div>
                  </Fragment>
                ) : (
                  <div>
                    {/* <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#f81d22"
                    /> */}
                    &emsp;Pending
                  </div>
                )}
              </Skeleton>
            )
          };

          issue_list.push(issue_object);
        });
        if (this.state.loading) {
          for (let i = 0; i < this.state.limit; i++) {
            let loadData_skeleton = {
              "Issue Name": (
                <Fragment>
                  <Skeleton active loading={true} paragraph={false}></Skeleton>
                </Fragment>
              ),
              "Task Name": (
                <Fragment>
                  <Skeleton active loading={true} paragraph={false}></Skeleton>
                </Fragment>
              ),
              "Raised By": (
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
            issue_list.push(loadData_skeleton);
          }
        }
      }
    }
    var tableData = {
      columns: ["Issue Name", "Task Name", "Raised By", "Status"],
      rows: issue_list
    };
    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />

                  <TitleHeader title={"Group Issues"} title_color={"#337ab7"} />
                  <CardBodyOnly
                    BodyId={"GroupIssueTable"}
                    id={"GroupIssueCard"}
                  >
                    {/* <div
                      style={{
                        textAlign: "end",
                        paddingRight: "2em",
                        marginBottom: "9px"
                      }}
                    >
                      <Search
                        placeholder="input search text"
                        style={{ width: 200 }}
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
        {/* <ActivityList id={this.props.match.params.id} type={"all"} /> */}
      </Fragment>
    );
  }
}

export default GroupIssues;
