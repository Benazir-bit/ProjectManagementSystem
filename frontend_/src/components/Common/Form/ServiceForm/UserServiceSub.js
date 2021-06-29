import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Input, Button, Modal, Select, Spin } from "antd";
import axios from "axios";
import { tokenConfig } from "../../../../actions/auth";
import { searchData } from "../../../../actions/search";
import ImageSmall from "../../ImageSmall/ImageSmall";
import {
  getEmpId,
  getServiceType,
  userSubscribe
} from "../../../../actions/accounts";
// import { userSubscribe } from "@actions/accounts";
const { Option } = Select;

import "./ServiceForm.css";

class UserServiceSub extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.state = {
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
    this.props.getServiceType("all", "all");
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
          user: values.id.key,
          service: parseInt(values.services, 10)
        };
        this.props.userSubscribe(body);
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    const { fetching, data, value } = this.state;
    return (
      <Fragment>
        {/* <div className="col-sm-12 col-md-12">
          <AllCardBody
            BodyId="ServiceForm"
            cardTitle={"User Service Subscription"}
          > */}
        <Button
          onClick={this.showModal}
          disable={!this.props.services ? true : false}
          id="GrossAddBtn"
        >
          Service Subscription
        </Button>
        {!this.props.services ? null : (
          <Modal
            visible={this.state.visible}
            maskClosable={false}
            width={647}
            title="User Service Subscription"
            onCancel={this.onCancel}
            destroyOnClose={true}
            className={"GrossAddModal"}
            footer={[null, null]}
          >
            <Form onSubmit={this.handleSubmit} id="ServiceAddForm">
              <Form.Item label="Employee ID:" className={"formLabel"}>
                {getFieldDecorator("id", {
                  rules: [{ required: true, message: "Id is required!" }]
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
              <Form.Item label="Services">
                {getFieldDecorator("services", {
                  rules: [
                    { required: true, message: "Please select Services!" }
                  ]
                })(
                  <Select
                    placeholder="Select a Service"
                    onChange={this.handleSelectChange}
                  >
                    {this.props.services.map(service => (
                      <Option key={service.id}>
                        {service.title} - {service.details} - {service.amount}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item style={{ float: "right" }}>
                <Button key="cancel" onClick={this.onCancel}>
                  Cancel
                </Button>
                &emsp;
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}
        {/* </AllCardBody>
        </div> */}
      </Fragment>
    );
  }
}

const UserSubForm = Form.create()(UserServiceSub);

const mapStateToProps = state => ({
  userlist: state.search.searchList,
  user_info: state.accounts.user_info,
  services: state.accounts.services
});

const mapActionsToProps = {
  searchData: searchData,
  getEmpId: getEmpId,
  getServiceType: getServiceType,
  userSubscribe: userSubscribe
};

export default connect(mapStateToProps, mapActionsToProps)(UserSubForm);
