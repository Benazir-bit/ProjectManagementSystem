import React, { Component, Fragment } from "react";
import { Select } from "antd";
import { connect } from "react-redux";
import { getGroupListAll } from "../../../../actions/groupSelect";
import {
  getGroupOnScroll,
  resetInfinityScroll
} from "../../../../actions/inifinityScroll";
import { Layout, Form, Button, Icon } from "antd";
import "./GroupAttendanceTable.css";
import moment from "moment-timezone";
import AttendenceTable from "../AttendentTable";
import { DatePicker } from "antd";

const { Content } = Layout;
const { Option } = Select;

class GroupAttendanceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      grouptableshow: false,
      dailytableshow: false,
      timeChange: false,
      groupId: this.props.isAdmin ? null : this.props.auth_user.groups[0].id,
      loading: false,
      qtype: this.props.isAdmin ? "all" : "group",
      qdate: moment(),
      attendance: []
    };

    window.onscroll = () => {
      let hasMore =
        this.props.offset / this.props.limit + 1 <=
        Math.ceil(this.props.count / this.props.limit);
      if (!hasMore || this.props.isLoading) return;

      //divided by limit
      if (hasMore) {
        if (
          Math.ceil(
            document.documentElement.scrollHeight - window.pageYOffset
          ) === document.documentElement.clientHeight ||
          Math.ceil(
            document.documentElement.scrollHeight - window.pageYOffset
          ) +
          2 ===
          document.documentElement.clientHeight ||
          Math.ceil(
            document.documentElement.scrollHeight - window.pageYOffset
          ) -
          2 ===
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

  pageScrollCheck = () => {
    let hasMore =
      this.props.offset / this.props.limit + 1 <=
      Math.ceil(this.props.count / this.props.limit);
    if (!hasMore || this.props.isLoading) return;
    if (
      !(window.innerWidth - window.document.documentElement.clientWidth > 0)
    ) {
      if (hasMore) {
        this.loadData();
      }
    }
  };
  loadData = () => {
    const { qtype, groupId, qdate } = this.state;
    this.props.getGroupOnScroll(
      qtype,
      groupId,
      qdate.format("YYYY-MM-DD"),
      this.props.offset,
      this.props.limit
    );
  };
  componentDidUpdate(prevProps) {
    if (prevProps.data != this.props.data) {
      this.pageScrollCheck();
    }
    window.addEventListener("resize", this.pageScrollCheck.bind(this));
  }
  UNSAFE_componentWillMount() {
    if (this.props.isAdmin) {
      this.props.getGroupListAll();
      this.loadData();
    } else {
      this.loadData();
    }
  }

  handleDateChange = (value, dateString) => {
    this.setState({
      qdate: value
    });
  };
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

  handleDisabledDate = current => {
    return current && current > moment().endOf("day");
  };

  handleOnClikeNextday = async () => {
    await this.props.resetInfinityScroll();
    const { qtype, groupId, qdate } = this.state;
    let nextday = moment(qdate).add(1, "days");
    this.setState({
      qdate: nextday
    });
    this.props.getGroupOnScroll(
      qtype,
      groupId,
      nextday.format("YYYY-MM-DD"),
      this.props.offset,
      this.props.limit
    );
  };

  handleOnClikePrvday = async () => {
    await this.props.resetInfinityScroll();
    const { qtype, groupId, qdate } = this.state;
    let preday = moment(qdate).subtract(1, "days");
    this.setState({
      qdate: preday
    });
    this.props.getGroupOnScroll(
      qtype,
      groupId,
      preday.format("YYYY-MM-DD"),
      this.props.offset,
      this.props.limit
    );
  };

  handleSubmit = async e => {
    e.preventDefault();
    await this.props.resetInfinityScroll();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        const { qtype, groupId, qdate } = this.state;
        this.props.getGroupListAll();
        this.props.getGroupOnScroll(
          qtype,
          groupId,
          qdate.format("YYYY-MM-DD"),
          this.props.offset,
          this.props.limit
        );
      }
    });
  };

  render() {
    let groups = [];
    if (this.props.isAdmin) {
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

    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Fragment>
            <Form.Item>
              <Select
                placeholder="Select Group"
                style={{ width: 200 }}
                onChange={this.handleGroupChange}
                defaultValue={
                  this.props.isAdmin ? "all" : this.props.auth_user.groups[0].id
                }
              >
                {this.props.isAdmin ? (
                  <Option value="all">All Groups</Option>
                ) : null}

                {groups}
              </Select>
            </Form.Item>
            <Form.Item>
              <DatePicker
                style={{ width: 200 }}
                onChange={this.handleDateChange}
                value={this.state.qdate}
                disabledDate={this.handleDisabledDate}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.props.isLoadingAttendance}
              >
                Submit
              </Button>
            </Form.Item>
          </Fragment>
        </Form>
        <div className="start-table">
          <Button
            type="link"
            className="prev-page"
            onClick={this.handleOnClikePrvday}
          >
            {/* <Icon type="left" /> */}
            <span>Previous Day</span>
          </Button>
          <Button
            type="link"
            className="next-page"
            onClick={this.handleOnClikeNextday}
            disabled={
              this.state.qdate.format("YYYY-MM-DD") ===
                moment().format("YYYY-MM-DD")
                ? true
                : false
            }
          >
            <span>Next Day</span>
            {/* <Icon type="right" /> */}
          </Button>
        </div>

        <Content>
          <AttendenceTable
            attendance={this.props.data}
            selectionType="group"
            loading={this.props.isLoadingAttendance}
            limit={this.props.limit}
          />
        </Content>
      </Fragment>
    );
  }
}
const GroupAttendanceCheckForm = Form.create()(GroupAttendanceTable);

const mapStateToProps = state => ({
  auth_user: state.auth.user,
  attendance: state.attendance.attendance,
  groups: state.groupSelect.groups,
  isLoadingAttendance: state.attendance.isLoading,
  isLoading: state.infinityScroll.isLoading,
  data: state.infinityScroll.data,
  count: state.infinityScroll.count,
  offset: state.infinityScroll.offset,
  limit: state.infinityScroll.limit
});
export default connect(mapStateToProps, {
  // getGroupAttendance,
  getGroupListAll,
  getGroupOnScroll,
  resetInfinityScroll
})(GroupAttendanceCheckForm);
