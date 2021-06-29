import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Input, Button, InputNumber, Modal, Divider } from "antd";
import { searchData } from "../../../../actions/search";
import moment from "moment";
import "./ServiceForm.css";
import { Select, Spin } from "antd";
import {
  getEmpId,
  getAnnualYearType,
  assignSalary
} from "../../../../actions/accounts";
import ImageSmall from "../../ImageSmall/ImageSmall";
const { Option } = Select;
class GrossServiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year_start: "",
      year_end: "",
      data: [],
      value: [],
      fetching: false,
      visible: false,
      dept: "",
      dsg: "",
      name: ""
    };
  }

  onSearch = value => {
    if (value.length > 1) {
      this.props.searchData(value, "accounts", "user", "all");
    }
  };

  componentDidMount() {
    let current_datetime = new Date();
    this.setState({
      year_start: moment(current_datetime.getFullYear() + "-04-01"),
      year_end: moment(current_datetime.getFullYear() + 1 + "-03-31")
    });

    this.props.getAnnualYearType("all");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userlist !== this.props.userlist) {
      const data = this.props.userlist.map(user => ({
        value: user.username,
        username: user.full_name,
        image: user.image,
        full_name: user.full_name,
        id: user.id
      }));
      this.setState({ data, fetching: false });
    }

    if (prevProps.user_info !== this.props.user_info) {
      let user_group = "";
      {
        this.props.user_info.info.groups.map(
          (grp, i) =>
            (user_group =
              user_group +
              grp.name +
              (i == this.props.user_info.info.groups.length - 1 ? "" : ", "))
        );
      }
      this.setState({
        name: this.props.user_info.info.full_name,
        dsg: this.props.user_info.info.dsg,
        dept: user_group
      });
    }
  }

  handleChange = value => {
    this.setState({
      value,
      data: [],
      fetching: false
    });
    console.log(value);
    this.props.getEmpId(value.key);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(this.props.form.getFieldsValue());
      }

      this.props.assignSalary(values.year, values.username.key, values.amount);

      this.props.form.resetFields();
      this.setState({
        dept: "",
        dsg: "",
        name: "",
        visible: false
      });
    });
  };

  showModal = () => {
    this.setState({ visible: true });
  };
  onCancel = () => {
    this.setState({ visible: false });
  };
  onChange = (dates, dateStrings) => {
    this.setState({
      year_start: dateStrings[0].format("YYYY-MM-DD"),
      year_end: dateStrings[1].format("YYYY-MM-DD")
    });
  };

  render() {
    if (!this.state.year_start || !this.state.year_end) {
      return null;
    }
    const { fetching, value, data } = this.state;
    // const { form } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;

    return (
      <Fragment>
        <Button onClick={this.showModal} id="GrossAddBtn">
          Add User Gross
        </Button>
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          width={647}
          title="Add User Gross"
          onCancel={this.onCancel}
          destroyOnClose={true}
          className={"GrossAddModal"}
          footer={[null, null]}
        >
          <Form onSubmit={this.handleSubmit} id="ServiceAddForm">
            <Form.Item label="Employee ID:" className={"formLabel"}>
              {getFieldDecorator("username", {
                rules: [{ required: true, message: "Please input Username!" }]
              })(
                // <Fragment>
                <Select
                  showSearch
                  labelInValue
                  placeholder="Select users"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.onSearch}
                  onChange={this.handleChange}
                  style={{ width: "100%" }}
                  size="large"
                  showArrow={false}
                  // value={value}
                >
                  {data.map(d => (
                    <Option key={d.value} value={d.value}>
                      <ImageSmall
                        clsattr={"img-circle"}
                        altname={d.username}
                        srcfile={d.image}
                      />
                      &emsp;{d.username}
                      <Input value={d.id} hidden />
                    </Option>
                  ))}
                </Select>
                // </Fragment>
              )}
            </Form.Item>
            <Form.Item label="Employee Info:" className={"formLabel"}>
              {getFieldDecorator(
                "employeename",
                {}
              )(
                <Fragment>
                  <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-sm-12">
                      <Input
                        placeholder="Employee Name"
                        value={this.state.name}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-sm-12">
                      <Input
                        placeholder="Employee Designation"
                        value={this.state.dsg}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-sm-12">
                      <Input
                        placeholder="Employee Department"
                        value={this.state.dept}
                        readOnly
                      />
                    </div>
                  </div>
                </Fragment>
              )}
            </Form.Item>

            <Form.Item label="Annual Period (MM-DD-YYYY)">
              {getFieldDecorator("year", {
                rules: [
                  { required: true, message: "Please Select Annual Period" }
                ]
              })(
                <Select
                  style={{ width: "100%" }}
                  placeholder="Please Select Annual Period"
                  onChange={this.handleSelectChange}
                >
                  {this.props.year_period.map(year => (
                    <Option key={year.id}>
                      {moment(year.from_month).format("MM-DD-YYYY")} to{" "}
                      {moment(year.to_month).format("MM-DD-YYYY")}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Gross Salary">
              {getFieldDecorator("amount", {
                rules: [{ required: true, message: "Please Enter Amount" }]
              })(
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={value =>
                    `Tk. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={value => value.replace(/\Tk.\s?|(,*)/g, "")}
                />
              )}
            </Form.Item>
            <Divider />
            <Form.Item style={{ float: "right" }}>
              <Button key="cancel" onClick={this.onCancel}>
                Cancel
              </Button>
              &emsp;
              <Button htmlType="submit" type="primary">
                Create
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

const GrossAddForm = Form.create()(GrossServiceForm);

const mapStateToProps = state => ({
  userlist: state.search.searchList,
  user_info: state.accounts.user_info,
  year_period: state.accounts.year_period
});

const mapActionsToProps = {
  searchData: searchData,
  getEmpId: getEmpId,
  getAnnualYearType: getAnnualYearType,
  assignSalary: assignSalary
};
export default connect(mapStateToProps, mapActionsToProps)(GrossAddForm);
