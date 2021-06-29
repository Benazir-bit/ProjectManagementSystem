import React, { Component, Fragment } from "react";
import { Select, Input, Divider } from "antd";
import ImageSmall from "../../../Common/ImageSmall/ImageSmall";
import { connect } from "react-redux";
// action
// import {
//   FetchAttendanceUserID,
//   FetchAttendanceData
// } from "../../../actions/FetchAttendanceData";
import {
  getUserName,
  getUserAttendance,
  getSelfAttendance
} from "../../../../actions/attendance";
import { Layout, DatePicker, Form, Button, Icon, Tag, Spin } from "antd";
import "./UserAttendanceTable.css";
import AttendanceTable from "../AttendentTable";
import moment from "moment-timezone";

const { Content } = Layout;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;

class UserAttendanceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userTableShow: false,
      timeChange: false,
      userID: "",
      fetching: false,
      timeValue: "",
      user_attendance_data: null,
      qmonth: moment()
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleMonthPicker = this.handleMonthPicker.bind(this);
  }

  handleChange = value => {
    this.setState({
      userID: value,
      fetching: false
    });
  };

  handleSearch = value => {
    if (value.length > 1) {
      this.setState({ fetching: true });
      this.props.getUserName(value, "user", "all");
      this.setState({ fetching: false });
    }
  };

  handleDisabledMonth(current) {
    // Can not select month after this month
    return current && current > moment().endOf("day");
  }

  handleMonthPicker(value, date) {
    this.setState({
      qmonth: date
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    // error handling on submit
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let values;
        if (this.props.self) {
          values = {
            username: this.props.auth_user.username,
            monthPicker: fieldsValue["month-picker"].format("YYYY-MM")
          };
        } else {
          values = {
            username: fieldsValue["select-user"],
            monthPicker: fieldsValue["month-picker"].format("YYYY-MM")
          };
        }

        this.props.getUserAttendance(
          "user",
          values.username,
          values.monthPicker
        );
      }
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.users != this.props.users) {
      const data = this.props.users.map(user => ({
        value: user.username,
        username: user.full_name,
        image: user.image,
        full_name: user.full_name,
        id: user.id
      }));
      this.setState({ data });
    }

    if (prevProps.user_attendance != this.props.user_attendance) {
      this.setState({ user_attendance_data: this.props.user_attendance });
    }
    if (this.props.self !== prevProps.self) {
      if (this.props.self) {
        this.props.getSelfAttendance(this.state.qmonth.format("YYYY-MM"));
      }
    }
  }
  componentDidMount() {
    if (this.props.self) {
      this.props.getSelfAttendance(this.state.qmonth.format("YYYY-MM"));
    }
  }

  render() {
    console.log(this.props.user_attendance);
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
    const { getFieldDecorator } = this.props.form;
    const config_search = {
      setFieldsValue: this.state.userID ? this.state.userID : undefined,
      rules: [
        {
          required: true,
          message: "Please select User!"
        }
      ]
    };
    const config_month = {
      initialValue: moment(this.state.qmonth, "MM-YYYY"),
      rules: [
        {
          required: true,
          message: "Please select Month!"
        }
      ]
    };
    return (
      <Fragment>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Fragment>
            {!this.props.self ? (
              <Fragment>
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
                &emsp; &emsp;
                <Form.Item>
                  {getFieldDecorator(
                    "month-picker",
                    config_month
                  )(
                    <MonthPicker
                      disabledDate={this.handleDisabledMonth}
                      placeholder="Select Month"
                      style={{ width: 200 }}
                      onChange={this.handleMonthPicker}
                    />
                  )}
                </Form.Item>
                &emsp; &emsp;
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={this.props.isLoading}
                  >
                    Submit
                  </Button>
                </Form.Item>{" "}
              </Fragment>
            ) : (
              <Fragment>
                <Form.Item>
                  {getFieldDecorator(
                    "month-picker",
                    config_month
                  )(
                    <MonthPicker
                      disabledDate={this.handleDisabledMonth}
                      placeholder="Select Month"
                      style={{ width: 200 }}
                      onChange={this.handleMonthPicker}
                    />
                  )}
                </Form.Item>
                &emsp; &emsp;
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={this.props.isLoading}
                  >
                    Submit
                  </Button>
                </Form.Item>{" "}
              </Fragment>
            )}

            <br></br>
            <div className="start-table">
              <Fragment>
                <Content>
                  {this.props.user_attendance ? (
                    <AttendanceTable
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
      </Fragment>
    );
  }
}
const UserAttendanceCheckForm = Form.create()(UserAttendanceTable);

const mapStateToProps = state => ({
  user_attendance: state.attendance.user_attendance,
  users: state.attendance.users,
  auth_user: state.auth.user,
  isLoading: state.attendance.isLoading
});
export default connect(mapStateToProps, {
  getSelfAttendance,
  getUserAttendance,
  getUserName
})(UserAttendanceCheckForm);
