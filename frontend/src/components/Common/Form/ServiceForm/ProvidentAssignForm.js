import React, { PureComponent, Fragment } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  DatePicker,
  Modal,
  Select,
  Spin,
  InputNumber,
  Divider
} from "antd";
import { searchData } from "../../../../actions/search";
import moment from "moment";
import "./ServiceForm.css";
import { assignUsrProvident } from "../../../../actions/accounts";
import { getEmpId } from "../../../../actions/accounts";
import ImageSmall from "../../ImageSmall/ImageSmall";
const { Option } = Select;

class ProvidentFundAssign extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.state = {
      start_date: "",
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
            // user_group = user_group + i == 0 || i == this.props.user_info.info.groups.length - 1 ? null : ',' + grp.name
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
        //dept: this.props.user_info.info.groups
      });
    }
  }

  handleChange = value => {
    this.setState({
      value,
      data: [],
      fetching: false
    });
    this.props.getEmpId(value.key);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const body = {
          username: values.username.key,
          percentage: values.amount,
          start_date: moment(values.start_date).format("YYYY-MM-DD")
        };
        this.props.assignUsrProvident("create", "filter", body);

        this.props.form.resetFields();
        this.setState({
          dept: "",
          dsg: "",
          name: "",
          visible: false
        });
      }
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
      start_date: dateStrings
    });
  };

  render() {
    const { fetching, value, data } = this.state;

    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        <Button onClick={this.showModal} id="GrossAddBtn">
          Providant Fund Assign
        </Button>
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          width={647}
          title="Assign Providant Fund"
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
                    // <Option key={d.value}>{d.username}</Option>
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
            <Form.Item label="Starting Date">
              {getFieldDecorator("start_date", {
                rules: [
                  { required: true, message: "Please Select Annual Period" }
                ]
              })(
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={this.onChange}
                />
              )}
            </Form.Item>
            <Form.Item label=" Percentage of Gross Salary (%)">
              {getFieldDecorator("amount", {
                rules: [
                  {
                    required: true,
                    message: "Please Enter Percentage"
                  }
                ]
              })(
                <InputNumber
                  placeholder="Enter Percentage"
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                />
              )}
            </Form.Item>
            <Divider />
            <Form.Item style={{ float: "right" }}>
              <Button key="cancel" onClick={this.onCancel}>
                Cancel
              </Button>
              &emsp;
              <Button key="submit" type="primary" htmlType="submit">
                Assign
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

const ProvidentFundAssignForm = Form.create()(ProvidentFundAssign);

const mapStateToProps = state => ({
  userlist: state.search.searchList,
  user_info: state.accounts.user_info
});

const mapActionsToProps = {
  searchData: searchData,
  getEmpId: getEmpId,
  assignUsrProvident: assignUsrProvident
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(ProvidentFundAssignForm);
