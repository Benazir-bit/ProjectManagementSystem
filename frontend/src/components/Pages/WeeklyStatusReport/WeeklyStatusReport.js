import React, { Component, Fragment } from "react";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import AntEditableTable from "../../Common/AllTables/AntEditableTable";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Layout,
  Select,
  Spin,
  Popconfirm
} from "antd";
import { Redirect } from "react-router-dom";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import "./WeeklyStatusReport.css";
// import { getUserName } from "../../../actions/attendance";
import {
  sendReport,
  draftReport,
  searchDraft
} from "../../../actions/weeklyReport";
const { Content } = Layout;

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { TextArea } = Input;

class WeeklyStatusReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formLayout: "horizontal",
      pickerType: "1",
      showCc: false,
      allUser: [],
      selectedUsersTo: [],
      selectedUsersCc: [],
      fetchingTo: false,
      fetchingCc: false,
      data_completed: [],
      data_progress: [],
      data_next_week: [],
      data_issue: [],
      draftToVal: null
    };
    this.handleChangeTo = this.handleChangeTo.bind(this);
    this.handleChangeCc = this.handleChangeCc.bind(this);
  }
  componentDidMount() {
    this.props.searchDraft("draft");
  }
  componentDidUpdate(prevProps) {
    if (prevProps.users != this.props.users) {
      const allUser = this.props.users.map(user => ({
        value: user.username,
        username: user.full_name,
        image: user.image,
        full_name: user.full_name,
        id: user.id
      }));
      this.setState({ allUser });
    }

    if (prevProps.weekly_report != this.props.weekly_report) {
      if (this.props.weekly_report) {
        this.setState({
          draftToVal: this.props.weekly_report,
          showCc:
            this.props.weekly_report.workreport.cc_list.length > 0
              ? true
              : false,
          pickerType: this.props.weekly_report
            ? this.props.weekly_report.workreport.report_type === "weekly"
              ? "1"
              : this.props.weekly_report.workreport.report_type === "monthly"
                ? "2"
                : "3"
            : "1"
        });
      }
    }
  }
  handleCc = () => {
    this.setState({
      showCc: true
    });
  };
  handleCcField = value => {
    if (value.length < 1) {
      this.setState({
        showCc: false
      });
    }
  };

  handleChangeTo(value) {
    this.setState({
      selectedUsersTo: value,
      fetchingTo: false
    });
  }
  handleChangeCc(value) {
    this.setState({
      selectedUsersCc: value,
      fetchingCc: false
    });
  }

  handleSearch = (value, Option) => {
    if (value.length > 1) {
      this.setState({ fetchingCc: true, fetchingTo: true });
      // this.props.getUserName(value, "user", "all");
      this.setState({ fetchingCc: false, fetchingTo: false });
    }
  };

  handleChangeType = value => {
    this.setState({
      pickerType: value
    });
  };

  handleDisabledDate = current => {
    // Can not select month or week after this month or week
    return current && current > moment().endOf("day");
  };

  handleChangeData(field, value) {
    this.setState({ [field]: value });
  }

  handleSubmitSend = fieldsValue => {
    // e.preventDefault();

    // this.props.form.validateFields((err, fieldsValue) => {
    // if (!err) {
    const { pickerType } = this.state;
    let body;

    if (pickerType === "1") {
      body = {
        weekly: true,
        monthly: false,
        isRange: false,
        to: fieldsValue["select-users-to"],
        cc: fieldsValue["select-users-cc"],
        date: fieldsValue["select-weekly-picker"].format("YYYY-wo"),
        data_completed: this.state.data_completed,
        data_progress: this.state.data_progress,
        data_next_week: this.state.data_next_week,
        data_issue: this.state.data_issue
      };
    } else if (pickerType === "2") {
      body = {
        weekly: false,
        monthly: true,
        isRange: false,
        to: fieldsValue["select-users-to"],
        cc: fieldsValue["select-users-cc"],
        date: fieldsValue["select-monthly-picker"].format("YYYY-MM-DD"),
        data_completed: this.state.data_completed,
        data_progress: this.state.data_progress,
        data_next_week: this.state.data_next_week,
        data_issue: this.state.data_issue
      };
    } else if (pickerType === "3") {
      body = {
        weekly: false,
        monthly: false,
        isRange: true,
        to: fieldsValue["select-users-to"],
        cc: fieldsValue["select-users-cc"],
        date: [
          fieldsValue["select-range-picker"][0].format("YYYY-MM-DD"),
          fieldsValue["select-range-picker"][1].format("YYYY-MM-DD")
        ],
        data_completed: this.state.data_completed,
        data_progress: this.state.data_progress,
        data_next_week: this.state.data_next_week,
        data_issue: this.state.data_issue
      };
    }

    console.log(body, "body..............");
    this.props.sendReport(body);

    this.setState = {
      formLayout: "horizontal",
      pickerType: "1",
      showCc: false,
      allUser: [],
      selectedUsersTo: [],
      selectedUsersCc: [],
      fetchingTo: false,
      fetchingCc: false,
      data_completed: [],
      data_progress: [],
      data_next_week: [],
      data_issue: []
    };
    // }
    // });
  };

  handleSubmitDraft = fieldsValue => {
    // e.preventDefault();

    // this.props.form.validateFields((err, fieldsValue) => {
    // if (!err) {
    const { pickerType } = this.state;
    let body;

    if (pickerType === "1") {
      body = {
        weekly: true,
        monthly: false,
        isRange: false,
        to: fieldsValue["select-users-to"],
        cc: fieldsValue["select-users-cc"],
        date: fieldsValue["select-weekly-picker"].format("YYYY-wo"),
        data_completed: this.state.data_completed,
        data_progress: this.state.data_progress,
        data_next_week: this.state.data_next_week,
        data_issue: this.state.data_issue
      };
    } else if (pickerType === "2") {
      body = {
        weekly: false,
        monthly: true,
        isRange: false,
        to: fieldsValue["select-users-to"],
        cc: fieldsValue["select-users-cc"],
        date: fieldsValue["select-monthly-picker"].format("YYYY-MM-DD"),
        data_completed: this.state.data_completed,
        data_progress: this.state.data_progress,
        data_next_week: this.state.data_next_week,
        data_issue: this.state.data_issue
      };
    } else if (pickerType === "3") {
      body = {
        weekly: false,
        monthly: false,
        isRange: true,
        to: fieldsValue["select-users-to"],
        cc: fieldsValue["select-users-cc"],
        date: [
          fieldsValue["select-range-picker"][0].format("YYYY-MM-DD"),
          fieldsValue["select-range-picker"][1].format("YYYY-MM-DD")
        ],
        data_completed: this.state.data_completed,
        data_progress: this.state.data_progress,
        data_next_week: this.state.data_next_week,
        data_issue: this.state.data_issue
      };
    }
    this.props.draftReport(body);
    console.log(body, "body..............");
    // }
    // });
  };

  render() {
    if (this.props.submitted) {
      return <Redirect to="/weeklyreportlist/sent" />;
    }
    const { formLayout } = this.state;
    const formItemLayout =
      formLayout === "horizontal"
        ? {
          labelCol: { span: 3 },
          wrapperCol: { span: 14 }
        }
        : null;

    const { RangePicker } = DatePicker;

    const filteredOptionsTo = this.state.allUser.filter(
      o => !this.state.selectedUsersTo.includes(o.value)
    );
    const filteredOptionsCc = this.state.allUser.filter(
      o => !this.state.selectedUsersCc.includes(o.value)
    );

    let inVal = {
      'select-weekly-picker': this.props.weekly_report
        ? this.props.weekly_report.workreport.week
          ? moment()
            .year(this.props.weekly_report.workreport.week.split("-")[0])
            .week(
              this.props.weekly_report.workreport.week
                .split("-")[1]
                .match(/[a-z]+|[^a-z]+/gi)[0]
            )
          : undefined
        : undefined,
      'select-monthly-picker': this.props.weekly_report
        ? this.props.weekly_report.workreport.month
          ? moment(this.props.weekly_report.workreport.month)
          : undefined
        : undefined,
      'select-range-picker': this.props.weekly_report
        ? this.props.weekly_report.workreport.from_date &&
          this.props.weekly_report.workreport.to_date
          ? [
            moment(this.props.weekly_report.workreport.from_date),
            moment(this.props.weekly_report.workreport.to_date)
          ]
          : undefined
        : undefined,
      'select-users-to': this.state.draftToVal
        ? this.state.draftToVal.workreport.recipent.map(item => item.username)
        : undefined,
      'select-users-cc': this.state.draftToVal
        ? this.state.draftToVal.workreport.cc_list.map(item => item.username)
        : undefined,
      'select-type': this.props.weekly_report
        ? this.props.weekly_report.workreport.report_type === "weekly"
          ? "1"
          : this.props.weekly_report.workreport.report_type === "monthly"
            ? "2"
            : "3"
        : "1",
    }

    let fVal = {
      'select-users-to': this.state.selectedUsersTo.length > 0
        ? this.state.selectedUsersTo
        : null,
      'select-users-cc': this.state.selectedUsersCc.length > 0
        ? this.state.selectedUsersCc
        : null,
    }
    // const { getFieldDecorator } = this.props.form;
    // const config_To = {
    //   initialValue: this.state.draftToVal
    //     ? this.state.draftToVal.workreport.recipent.map(item => item.username)
    //     : undefined,
    //   setFieldsValue:
    //     this.state.selectedUsersTo.length > 0
    //       ? this.state.selectedUsersTo
    //       : null,
    //   rules: [
    //     {
    //       required: false,
    //       message: "Please select Users!"
    //     }
    //   ]
    // };

    // const config_Cc = {
    //   initialValue: this.state.draftToVal
    //     ? this.state.draftToVal.workreport.cc_list.map(item => item.username)
    //     : undefined,
    //   setFieldsValue:
    //     this.state.selectedUsersCc.length > 0
    //       ? this.state.selectedUsersCc
    //       : null,
    //   rules: [
    //     {
    //       required: false,
    //       message: "Please select Users!"
    //     }
    //   ]
    // };

    // const config_type = {
    //   initialValue: this.props.weekly_report
    //     ? this.props.weekly_report.workreport.report_type === "weekly"
    //       ? "1"
    //       : this.props.weekly_report.workreport.report_type === "monthly"
    //         ? "2"
    //         : "3"
    //     : "1",
    //   rules: [
    //     {
    //       required: true,
    //       message: "Please Select Report Type!"
    //     }
    //   ]
    // };

    // const config_weekly_picker = {
    //   initialValue: this.props.weekly_report
    //     ? this.props.weekly_report.workreport.week
    //       ? moment()
    //         .year(this.props.weekly_report.workreport.week.split("-")[0])
    //         .week(
    //           this.props.weekly_report.workreport.week
    //             .split("-")[1]
    //             .match(/[a-z]+|[^a-z]+/gi)[0]
    //         )
    //       : undefined
    //     : undefined,

    //   rules: [
    //     {
    //       required: true,
    //       message: "Please Select A Week!"
    //     }
    //   ]
    // };

    // const config_monthly_picker = {
    //   initialValue: this.props.weekly_report
    //     ? this.props.weekly_report.workreport.month
    //       ? moment(this.props.weekly_report.workreport.month)
    //       : undefined
    //     : undefined,

    //   rules: [
    //     {
    //       required: true,
    //       message: "Please Select A Month!"
    //     }
    //   ]
    // };

    // const config_range_picker = {
    //   initialValue: this.props.weekly_report
    //     ? this.props.weekly_report.workreport.from_date &&
    //       this.props.weekly_report.workreport.to_date
    //       ? [
    //         moment(this.props.weekly_report.workreport.from_date),
    //         moment(this.props.weekly_report.workreport.to_date)
    //       ]
    //       : undefined
    //     : undefined,

    //   rules: [
    //     {
    //       required: true,
    //       message: "Please Select A Date Range!"
    //     }
    //   ]
    // };

    let pickerComponent;
    if (this.state.pickerType == "1") {
      pickerComponent = (
        <Form.Item label="Week" name="select-weekly-picker"
          rules={[{ required: true, message: "Please Select A Week!" }]}
        >
          <WeekPicker
            className=""
            placeholder="Select week"
            disabledDate={this.handleDisabledDate}
            style={{ width: "400px" }}
          />
        </Form.Item>
      );
    } else if (this.state.pickerType == "2") {
      pickerComponent = (
        <Form.Item label="Month" name="select-monthly-picker"
          rules={[{ required: true, message: "Please Select A Month!" }]}
        >
          <MonthPicker
            className=""
            placeholder="Select Month"
            disabledDate={this.handleDisabledDate}
            style={{ width: "400px" }}
          />
        </Form.Item>
      );
    } else if (this.state.pickerType == "3") {
      pickerComponent = (
        <Form.Item label="Date Range" name="select-range-picker"
          rules={[{ required: true, message: "Please Select A Date Range!" }]}
        >
          <RangePicker
            className=""
            placeholder="Select Date Range"
            disabledDate={this.handleDisabledDate}
            style={{ width: "400px" }}
          />
        </Form.Item>
      );
    } else {
      pickerComponent = null;
    }
    // console.log(
    //   this.props.weekly_report
    //     ? this.props.weekly_report.activity_completed
    //     : "string",
    //   "testing"
    // );
    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader
                    title={"Weekly Status Report"}
                    title_color={"#337ab7"}
                  />
                  <br />
                  {/* <Fragment> */}

                  <Form
                    className="descriptionTablework"
                    // title=""
                    layout={formLayout}
                    initialValues={inVal}
                    setFieldsValue={fVal}
                  // onSubmit={this.handleSubmit}
                  >
                    <Form.Item label="To" name="select-users-to"
                      rules={[{ required: false, message: "Please select Users!" }]}
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        // labelInValue
                        defaultActiveFirstOption={true}
                        // value={this.state.selectedUsersTo}
                        placeholder="Select Users"
                        notFoundContent={
                          this.state.fetchingTo ? <Spin size="small" /> : null
                        }
                        filterOption={true}
                        onSearch={this.handleSearch}
                        onChange={this.handleChangeTo}
                        style={{ width: "400px" }}
                      >
                        {filteredOptionsTo.map(item => (
                          <Select.Option key={item.value} value={item.value}>
                            <ImageSmall
                              clsattr={"img-circle"}
                              altname={item.username}
                              srcfile={item.image}
                            />
                            &emsp;{item.username}
                          </Select.Option>
                        ))}
                      </Select>

                      {this.state.selectedUsersCc.length < 1 &&
                        this.state.showCc == false ? (
                        <Link
                          style={{ paddingLeft: 10 }}
                          onClick={this.handleCc}
                        >
                          Cc
                        </Link>
                      ) : null}
                    </Form.Item>
                    {this.state.showCc ? (
                      <Form.Item label="Cc" name="select-users-cc"
                        rules={[{ required: false, message: "Please select Users!" }]}
                      >
                        <Select
                          allowClear
                          defaultActiveFirstOption={true}
                          mode="multiple"
                          filterOption={true}
                          placeholder="Select Users"
                          // value={this.state.selectedUsersCc}
                          onSearch={this.handleSearch}
                          onChange={this.handleChangeCc}
                          onBlur={this.handleCcField}
                          style={{ width: "400px" }}
                        >
                          {filteredOptionsCc.map(item => (
                            <Select.Option
                              key={item.value}
                              value={item.value}
                            >
                              <ImageSmall
                                clsattr={"img-circle"}
                                altname={item.username}
                                srcfile={item.image}
                              />
                              &emsp;{item.username}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    ) : null}

                    <Form.Item label="Report Type" name="select-type"
                      rules={[{ required: true, message: "Please Select Report Type!" }]}
                    >
                      <Select
                        style={{ width: "400px" }}
                        allowClear
                        placeholder="Slecet Date Type"
                        onChange={this.handleChangeType}
                      // disabled={modifyData ? true : false}
                      >
                        <Option value="1">Weekly Report</Option>
                        <Option value="2">Monthly Report</Option>
                        <Option value="3">Date Range Report</Option>
                      </Select>
                    </Form.Item>
                    {pickerComponent}
                    <br />
                    <Form.Item>
                      <p className="TableHeader">
                        ACTIVITIES COMPLETED THIS WEEK
                      </p>
                      <AntEditableTable
                        tabType={1}
                        dataField="data_completed"
                        onChange={this.handleChangeData.bind(this)}
                        form={this.props.form}
                        dataSource={
                          this.state.data_completed.length > 0
                            ? this.state.data_completed
                            : this.props.weekly_report
                              ? this.props.weekly_report.activity_completed.map(
                                (item, i) =>
                                // console.log(
                                //   item.task,
                                //   item.description,
                                //   "item check test"
                                // ),
                                ({
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
                      <AntEditableTable
                        tabType={2}
                        dataField="data_progress"
                        onChange={this.handleChangeData.bind(this)}
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
                                  due_date: item.due_date
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
                      <AntEditableTable
                        tabType={3}
                        dataField="data_next_week"
                        onChange={this.handleChangeData.bind(this)}
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
                      <AntEditableTable
                        tabType={4}
                        dataField="data_issue"
                        onChange={this.handleChangeData.bind(this)}
                        form={this.props.form}
                        dataSource={
                          this.state.data_issue.length > 0
                            ? this.state.data_issue
                            : this.props.weekly_report
                              ? this.props.weekly_report.issue.map((item, i) => ({
                                key: i,
                                sl: i + 1,
                                issue_name: item.name,
                                description_of_issue: item.description
                              }))
                              : []
                        }
                      />
                    </Form.Item>
                    <br />
                    <br />

                    <Form.Item>
                      <div style={{ textAlign: "center" }}>
                        <Button
                          size="large"
                          htmlType="submit"
                          style={{
                            background: "#337ab7",
                            margin: 10,
                            color: "white"
                          }}
                          onClick={this.handleSubmitDraft}
                        >
                          Save as Draft
                        </Button>
                        <Button
                          size="large"
                          htmlType="submit"
                          style={{
                            background: "#337ab7",
                            margin: 10,
                            color: "white"
                          }}
                          onClick={this.handleSubmitSend}
                        >
                          Send
                        </Button>
                        {/* <Button
                        type="primary"
                        htmlType="submit"
                        // loading={this.props.isLoading}
                      >
                        Submit
                      </Button> */}
                      </div>
                    </Form.Item>
                  </Form>
                  {/* <div style={{ textAlign: "center" }}>
                    <Button
                      size="large"
                      style={{
                        background: "#337ab7",
                        margin: 10,
                        color: "white"
                      }}
                    >
                      Save as Draft
                    </Button>
                    </Form.Item>
                    <Form.Item>
                    <Button
                      size="large"
                      style={{
                        background: "#337ab7",
                        margin: 10,
                        color: "white"
                      }}
                    >
                      Send
                    </Button>
                  </div> */}
                  {/* </Form.Item> */}
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Fragment >
    );
  }
}
// const WeeklyStatusReportCheckForm = Form.create()(WeeklyStatusReport);

const mapStateToProps = state => ({
  users: state.attendance.users,
  submitted: state.weeklyReport.submit,
  weekly_report: state.weeklyReport.weekly_report
});
export default connect(mapStateToProps, {
  // getUserName,
  sendReport,
  draftReport,
  searchDraft
})(WeeklyStatusReport);
