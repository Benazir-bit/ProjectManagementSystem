import React, { Component, Fragment } from "react";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import { Input, Select, DatePicker, Button, Layout, Form, Spin } from "antd";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import "./Summary.css";
import AttendentTable from "../../Common//AttendanceTable/AttendentTable";
import CommonTable from "../../Common/AllTables/CommonTable";
import { getGroupListAll } from "../../../actions/groupSelect";
import { getUserName } from "../../../actions/attendance";
import { Link } from "react-router-dom";
import { getSummaryList } from "../../../actions/projectSummary";
import { connect } from "react-redux";
const InputGroup = Input.Group;
const { Option } = Select;
const { Content } = Layout;

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: null,
      data: [],
      userID: "",
      fetching: false,
      qtype: null,
      groupId: null
    };
  }

  componentDidMount() {
    if (this.props.auth_user.is_hr || this.props.auth_user.is_staff) {
      this.setState({
        isAdmin: true,
        qtype: "all",
        group_id: null
      });
      this.props.getGroupListAll();
    } else {
      this.setState({
        groupId: this.props.auth_user.groups[0].id
      });
    }
  }
  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate", this.props.users);
    if (prevProps.users != this.props.users) {
      console.log(";hereeeeeeeee");
      const data = this.props.users.map(user => ({
        value: user.username,
        username: user.full_name,
        image: user.image,
        full_name: user.full_name,
        id: user.id
      }));
      this.setState({ data });
    }
  }
  handleGroupChange = value => {
    if (value == "all") {
      this.setState({
        qtype: "all",
        groupId: null
      });
    } else {
      this.setState({
        qtype: "group",
        groupId: value
      });
    }
  };

  onChange = (value, dateString) => {
    this.setState({
      dateRange: dateString
    });
  };
  // search = () => {
  //   // this.props.getSummaryList("group_id", "from_date", "to_date");
  //   // this.props.getSummaryList("1", "2020-01-01", "2020-05-02");

  // };
  handleSubmit = e => {
    e.preventDefault();
    // error handling on submit
    this.props.form.validateFields((err, fieldsValue) => {
      console.log(
        "jjjjjjjj",
        this.state.groupId,
        fieldsValue["select-user"],
        this.state.dateRange
      );
      if (!err) {
        console.log(
          this.state.groupId,
          fieldsValue["select-user"],
          this.state.dateRange
        );
        this.props.getSummaryList(
          this.state.groupId,
          this.state.dateRange[0],
          this.state.dateRange[1],
          fieldsValue["select-user"]
        );
        // const values = {
        //   username: fieldsValue["select-user"],
        //   monthPicker: fieldsValue["month-picker"].format("YYYY-MM")
        // };
        // if (this.props.self) {
        //   this.props.getSelfAttendance(values.monthPicker);
        // } else {
        //   this.props.getUserAttendance(
        //     "user",
        //     values.username,
        //     values.monthPicker
        //   );
        // }
      }
    });
  };
  handleChange = value => {
    this.setState({
      userID: value,
      fetching: false
    });
    console.log("handlechange", value);
  };

  handleSearch = value => {
    if (value.length > 1) {
      this.setState({ fetching: true });
      this.props.getUserName(value, "user", "all");
      this.setState({ fetching: false });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let options = this.state.data.map(d => (
      <Option key={d.value} value={d.value}>
        <ImageSmall
          clsattr={"img-circle"}
          altname={d.username}
          srcfile={d.image}
        />
        &emsp;{d.username}
        <Input value={d.id} hidden />
      </Option>
    ));
    console.log("options", options);

    const config_search = {
      setFieldsValue: this.state.userID ? this.state.userID : undefined,
      rules: [
        {
          required: false
        }
      ]
    };
    let groups = [];
    if (this.state.isAdmin) {
      if (this.props.groups) {
        this.props.groups.map((group, i) => {
          groups.push(
            <Option key={i} value={group.id}>
              {group.name}
            </Option>
          );
        });
      }
    } else {
      this.props.auth_user.groups.map((group, i) => {
        groups.push(
          <Option key={i} value={group.id}>
            {group.name}
          </Option>
        );
      });
    }

    console.log(this.props.summarylist, "kkkkkkkkkkkkkkkkkkkkkkk");
    const { RangePicker } = DatePicker;
    var tableData = {
      columns: ["SL", "Task Title", "Project", "Start Date", "Completed On"],
      rows: [
        {
          SL: "1",
          "Task Title": <Link>Task 1</Link>,
          Project: <Link>Project 1</Link>,
          "Start Date": "20-01-2019",
          "Completed On": "20-01-2019"
        },
        {
          SL: "1",
          "Task Title": <Link>Task 1</Link>,
          Project: <Link>Project 1</Link>,
          "Start Date": "20-01-2019",
          "Completed On": "20-01-2019"
        }
      ]
    };
    var tableData1 = {
      columns: ["SL", "Task Title", "Project", "Created Date", "Completed On"],
      rows: [
        {
          SL: "1",
          "Task Title": <Link>Task 1</Link>,
          Project: <Link>Project 1</Link>,
          "Created Date": "20-01-2019",
          "Completed On": "20-01-2019"
        },
        {
          SL: "1",
          "Task Title": <Link>Task 1</Link>,
          Project: <Link>Project 1</Link>,
          "Created Date": "20-01-2019",
          "Completed On": "20-01-2019"
        },
        {
          SL: "1",
          "Task Title": <Link>Task 1</Link>,
          Project: <Link>Project 1</Link>,
          "Created Date": "20-01-2019",
          "Completed On": "20-01-2019"
        }
      ]
    };

    var tableData2 = {
      columns: ["SL", "Issue Name", "Raised On", "Task Name", "Project"],
      rows: [
        {
          SL: "1",
          "Issue Name": <Link>Issue 1</Link>,
          "Raised On": "20-01-2019",
          "Task Name": <Link>Project 1</Link>,
          Project: "Project 1"
        },
        {
          SL: "1",
          "Issue Name": <Link>Issue 1</Link>,
          "Raised On": "20-01-2019",
          "Task Name": <Link>Project 1</Link>,
          Project: "Project 1"
        },
        {
          SL: "1",
          "Issue Name": <Link>Issue 1</Link>,
          "Raised On": "20-01-2019",
          "Task Name": <Link>Project 1</Link>,
          Project: "Project 1"
        }
      ]
    };

    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader title={"Summary"} title_color={"#337ab7"} />
                  <br />
                  <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Fragment>
                      <Fragment>
                        <Form.Item>
                          <Select
                            placeholder="Select Group"
                            style={{ width: "300%" }}
                            onChange={this.handleGroupChange}
                            defaultValue={
                              this.state.isAdmin
                                ? "all"
                                : this.props.auth_user.groups[0].id
                            }
                          >
                            {this.state.isAdmin ? (
                              <Option value="all">All Groups</Option>
                            ) : null}

                            {groups}
                          </Select>
                        </Form.Item>
                        <Form.Item>
                          {getFieldDecorator(
                            "select-user",
                            config_search
                          )(
                            <Select
                              showSearch
                              allowClear
                              placeholder="Search User"
                              style={{ width: 200 }}
                              defaultActiveFirstOption={true}
                              showArrow={true}
                              filterOption={true}
                              notFoundContent={
                                this.state.fetching ? (
                                  <Spin size="small" />
                                ) : null
                              }
                              onSearch={this.handleSearch}
                              onChange={this.handleChange}
                            // onSelect={this.handleChange}
                            >
                              {options}
                            </Select>
                          )}
                        </Form.Item>
                        <Form.Item>
                          <span style={{ left: "39%", position: "absolute" }}>
                            <RangePicker
                              placeholder={["From", "To"]}
                              onChange={this.onChange}
                            />
                          </span>
                        </Form.Item>
                        &emsp; &emsp;
                      </Fragment>
                      &emsp; &emsp;
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                      <br></br>
                      <div className="start-table">
                        <Fragment>
                          <Content>
                            {this.props.user_attendance ? (
                              <AttendentTable
                                attendance={this.props.user_attendance}
                                selectionType="user"
                                loading={this.props.isLoading}
                              />
                            ) : null}
                          </Content>
                        </Fragment>
                      </div>
                    </Fragment>
                  </Form>
                  {/* <div className="row TitleColor">
                    <div
                      style={{
                        position: "absolute",
                        width: "5%"
                      }}
                    >
                      <Select
                        placeholder="Select Group"
                        style={{ width: "300%" }}
                        onChange={this.handleGroupChange}
                        defaultValue={
                          this.state.isAdmin
                            ? "all"
                            : this.props.auth_user.groups[0].id
                        }
                      >
                        {this.state.isAdmin ? (
                          <Option value="all">All Groups</Option>
                        ) : null}

                        {groups}
                      </Select>
                     
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        width: "5%",
                        left: "20%"
                      }}
                    >
                      <Form.Item>
                        {getFieldDecorator(
                          "select-user",
                          config_search
                        )(
                          <Select
                            showSearch
                            allowClear
                            placeholder="Search User"
                            style={{ width: 200 }}
                            defaultActiveFirstOption={true}
                            showArrow={true}
                            filterOption={true}
                            notFoundContent={
                              this.state.fetching ? <Spin size="small" /> : null
                            }
                            onSearch={this.handleSearch}
                            onChange={this.handleChange}
                          // onSelect={this.handleChange}
                          >
                            {options}
                          </Select>
                        )}
                      </Form.Item>
                    </div>
                    <span style={{ left: "39%", position: "absolute" }}>
                      <RangePicker
                        placeholder={["From", "To"]}
                        onChange={this.onChange}
                      />
                    </span>
                    <Button
                      size="large"
                      className="btnSearch"
                      style={{ float: "right" }}
                      onClick={this.search}
                    >
                      Search
                    </Button>
                  </div> */}
                  <br />
                  <div style={{ fontSize: "medium" }}>
                    <span>AMS Verification</span>
                    {this.state.dateRange ? (
                      <span style={{ float: "right" }}>
                        Duration: {this.state.dateRange[0]} -{" "}
                        {this.state.dateRange[1]}
                      </span>
                    ) : null}
                    <br />
                    <span>Manager: </span>
                    <span style={{ float: "right" }}>
                      N.B.: Following datas are for the above duration
                    </span>
                  </div>

                  <br />
                  <p className="TableHeaderblue">TASKS COMPLETED</p>
                  <CommonTable
                    data={tableData}
                    clsattr={"table table-bordered table-hover borderedtab"}
                  />
                  <br />
                  <p className="TableHeaderblue">TASKS IN PROGRESS</p>
                  <CommonTable
                    data={tableData}
                    clsattr={"table table-bordered table-hover borderedtab"}
                  />
                  <br />
                  <p className="TableHeaderblue">TASKS NOT STARTED</p>
                  <CommonTable
                    data={tableData1}
                    clsattr={"table table-bordered table-hover borderedtab"}
                  />
                  <br />
                  <p className="TableHeaderblue">ISSUES</p>
                  <CommonTable
                    data={tableData2}
                    clsattr={"table table-bordered table-hover borderedtab"}
                  />
                </div>
                <br />
                <br />
              </div>
            </div>
          </div>
        </Content>
      </Fragment>
    );
  }
}
// const SummaryForm = Form.create()(Summary);
const mapStateToProps = state => ({
  auth_user: state.auth.user,
  users: state.attendance.users,
  groups: state.groupSelect.groups,
  summarylist: state.projectSummary.summarylist
});
export default connect(mapStateToProps, {
  getSummaryList,
  getUserName,
  getGroupListAll
})(Summary);
