import React, { Component, Fragment } from "react";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import AntTable from "../../Common/AllTables/AntTable";
import { Form, Layout } from "antd";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import "./WeeklyReportSummary.css";
import { report } from "../../../actions/weeklyReport";
import DetailsModal from "./DetailsModal";
const { Content } = Layout;

class WeeklyReportSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formLayout: "horizontal",
      data_completed: [],
      data_progress: [],
      data_next_week: [],
      data_issue: [],
      draftToVal: null
    };
  }
  componentDidMount() {
    this.props.report("report", this.props.match.params.id);
  }
  componentDidUpdate(prevProps) {
    console.log(prevProps.weekly_report, this.props.weekly_report);
    if (prevProps.weekly_report != this.props.weekly_report) {
      if (this.props.weekly_report) {
        console.log(
          this.props.weekly_report.workreport.recipient,
          "prevProps.weekly_report, this.props.weekly_report"
        );
        this.setState({
          draftToVal: this.props.weekly_report
        });
      }
    }
  }

  render() {
    console.log("aaaaaaaaaaaaaaaaaa", this.props.weekly_report);
    const { formLayout } = this.state;
    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader
                    title={"Report Summary"}
                    title_color={"#337ab7"}
                  />
                  <br />

                  <Form
                    className="descriptionTablework"
                    // title=""
                    layout={formLayout}
                    // onSubmit={this.handleSubmit}
                  >
                    <div className="col-sm">
                      <div className="col-sm-6" style={{ float: "left" }}>
                        <ImageSmall
                          clsattr={"img-circle"}
                          altname={
                            this.state.draftToVal
                              ? this.state.draftToVal.workreport.sender
                                  .full_name
                              : undefined
                          }
                          srcfile={
                            this.state.draftToVal
                              ? this.state.draftToVal.workreport.sender.image
                              : undefined
                          }
                        />
                        &emsp;
                        <Link to="#">
                          {this.state.draftToVal
                            ? this.state.draftToVal.workreport.sender.full_name
                            : undefined}
                        </Link>
                        <br />
                        <div>
                          <span style={{ color: "black" }}>
                            <i>
                              {this.state.draftToVal
                                ? this.state.draftToVal.workreport.sender.dsg
                                : undefined}
                            </i>
                            {", "}
                            <i>
                              {this.state.draftToVal
                                ? this.state.draftToVal.workreport.sender.groups
                                    .map(item => item.name)
                                    .join(", ")
                                : undefined}
                            </i>
                          </span>
                        </div>
                        <div className="">
                          <div
                            className="email-col"
                            style={{ color: "black", float: "left" }}
                          >
                            {this.state.draftToVal
                              ? this.state.draftToVal.workreport.recipent
                                  .length > 0
                                ? "To: " +
                                  this.state.draftToVal.workreport.recipent
                                    .map(item => item.full_name)
                                    .join(", ")
                                : null
                              : null}

                            {this.state.draftToVal
                              ? this.state.draftToVal.workreport.cc_list
                                  .length > 0
                                ? this.state.draftToVal.workreport.recipent !==
                                    null &&
                                  this.state.draftToVal.workreport.recipent !==
                                    undefined
                                  ? this.state.draftToVal.workreport.recipent
                                      .length > 0
                                    ? ", " +
                                      this.state.draftToVal.workreport.cc_list
                                        .map(item => item.full_name)
                                        .join(", ")
                                    : "To: " +
                                      this.state.draftToVal.workreport.cc_list
                                        .map(item => item.full_name)
                                        .join(", ")
                                  : "To: " +
                                    this.state.draftToVal.workreport.cc_list
                                      .map(item => item.full_name)
                                      .join(", ")
                                : null
                              : null}
                          </div>
                          <div
                            id={"btnDetails"}
                            // style={{ float: "left", marginLeft: 10 }}
                            // style={{ paddingLeft: "5px" }}
                          >
                            <DetailsModal
                              data={{
                                from: this.state.draftToVal
                                  ? [
                                      this.state.draftToVal.workreport.sender
                                        .full_name
                                    ]
                                  : undefined,
                                to: this.state.draftToVal
                                  ? this.state.draftToVal.workreport.recipent.map(
                                      item => item.full_name
                                    )
                                  : undefined,
                                cc: this.state.draftToVal
                                  ? this.state.draftToVal.workreport.cc_list.map(
                                      item => item.full_name
                                    )
                                  : undefined
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="">
                          <span style={{ color: "black", fontWeight: 500 }}>
                            {"Group : "}
                          </span>
                          <span style={{ color: "black" }}>
                            {this.state.draftToVal
                              ? this.state.draftToVal.workreport.sender.groups
                                  .map(item => item.name)
                                  .join(", ")
                              : undefined}
                          </span>
                        </div>
                        <div className="email-col">
                          <span style={{ color: "black", fontWeight: 500 }}>
                            {this.state.draftToVal
                              ? this.state.draftToVal.workreport.report_type ===
                                "weekly"
                                ? "Week : "
                                : this.state.draftToVal.workreport
                                    .report_type === "monthly"
                                ? "Month : "
                                : "Date : "
                              : undefined}
                          </span>
                          <span style={{ color: "black" }}>
                            {this.state.draftToVal
                              ? this.state.draftToVal.workreport.report_type ===
                                "weekly"
                                ? this.state.draftToVal.workreport.week
                                : this.state.draftToVal.workreport
                                    .report_type === "monthly"
                                ? this.state.draftToVal.workreport.month
                                : this.state.draftToVal.workreport
                                    .report_type === "range"
                                ? this.state.draftToVal.workreport.from_date +
                                  " to " +
                                  this.state.draftToVal.workreport.to_date
                                : undefined
                              : undefined}
                          </span>
                        </div>
                        <div className="">
                          <span style={{ color: "black", fontWeight: 500 }}>
                            {"Created On : "}
                          </span>
                          <span style={{ color: "black" }}>
                            {this.state.draftToVal
                              ? moment(
                                  this.state.draftToVal.workreport.timestamp
                                ).format("MMM DD, YYYY")
                              : undefined}
                          </span>
                        </div>
                      </div>
                    </div>

                    <br></br>
                    <div style={{ marginTop: "75px" }}>
                      <br />
                      <Form.Item>
                        <p className="TableHeader">
                          ACTIVITIES COMPLETED THIS WEEK
                        </p>
                        <AntTable
                          tabType={1}
                          dataField="data_completed"
                          //   onChange={this.handleChangeData.bind(this)}
                          form={this.props.form}
                          dataSource={
                            this.state.data_completed.length > 0
                              ? this.state.data_completed
                              : this.props.weekly_report
                              ? this.props.weekly_report.activity_completed.map(
                                  (item, i) => ({
                                    key: i,
                                    sl: i + 1,
                                    task: item.task,
                                    description_of_effort: item.description
                                  })
                                )
                              : []
                          }
                        />
                      </Form.Item>
                      <br />
                      <Form.Item>
                        <p className="TableHeader">ACTIVITIES IN PROGRESS</p>
                        <AntTable
                          tabType={2}
                          dataField="data_progress"
                          //   onChange={this.handleChangeData.bind(this)}
                          form={this.props.form}
                          dataSource={
                            this.state.data_progress.length > 0
                              ? this.state.data_progress
                              : this.props.weekly_report
                              ? this.props.weekly_report.activity_progress.map(
                                  (item, i) => ({
                                    key: i,
                                    sl: i + 1,
                                    activities_in_progress: item.current,
                                    next_action: item.next,
                                    due_date: moment(item.due_date).format(
                                      "DD-MMM-YYYY"
                                    )
                                  })
                                )
                              : []
                          }
                        />
                      </Form.Item>
                      <br />
                      <Form.Item>
                        <p className="TableHeader">
                          ACTIVITIES TO BE STARTED NEXT WEEK
                        </p>
                        <AntTable
                          tabType={3}
                          dataField="data_next_week"
                          //   onChange={this.handleChangeData.bind(this)}
                          form={this.props.form}
                          dataSource={
                            this.state.data_next_week.length > 0
                              ? this.state.data_next_week
                              : this.props.weekly_report
                              ? this.props.weekly_report.activity_nextWeek.map(
                                  (item, i) => ({
                                    key: i,
                                    sl: i + 1,
                                    task3: item.task,
                                    description_of_effort3: item.description
                                  })
                                )
                              : []
                          }
                        />
                      </Form.Item>
                      <br />
                      <Form.Item>
                        <p className="TableHeader">
                          ISSUES FOR IMMEDIATE ATTENTION
                        </p>
                        <AntTable
                          tabType={4}
                          dataField="data_issue"
                          //   onChange={this.handleChangeData.bind(this)}
                          form={this.props.form}
                          dataSource={
                            this.state.data_issue.length > 0
                              ? this.state.data_issue
                              : this.props.weekly_report
                              ? this.props.weekly_report.issue.map(
                                  (item, i) => ({
                                    key: i,
                                    sl: i + 1,
                                    issue_name: item.name,
                                    description_of_issue: item.description
                                  })
                                )
                              : []
                          }
                        />
                      </Form.Item>
                    </div>
                    <br />
                    <br />
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Fragment>
    );
  }
}
const WeeklyReportSummaryCheckForm = Form.create()(WeeklyReportSummary);

const mapStateToProps = state => ({
  weekly_report: state.weeklyReport.weekly_report
});
export default connect(mapStateToProps, {
  report
})(WeeklyReportSummaryCheckForm);
