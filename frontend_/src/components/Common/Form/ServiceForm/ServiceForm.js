import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import AllCardBody from "../../AllCard/AllCardBody";
import {
  Form,
  Input,
  Checkbox,
  Button,
  InputNumber,
  Row,
  Col,
  Modal,
  Icon
} from "antd";
import { addNewService } from "../../../../actions/accounts";
import "./ServiceForm.css";
import { Layout } from "antd";
const { Content } = Layout;

class ServiceForm extends Component {
  state = {
    free: true,
    showMonthDailyField: false,
    showMonthAmountField: false,
    showDailyAmountField: false,
    monthly: false,
    daily: false,
    visible: false,
    fetching: false
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        const { percentage } = this.state;
        const {
          title,
          details,
          free,
          monthly,
          monthly_amount,
          daily,
          daily_amount,
          max_subscriber
        } = values;
        if (monthly_amount == 0 && daily_amount == 0) {
          (free = true), (monthly_amount = null), (daily_amount = null);
        }

        const body = {
          title,
          details,
          free,
          monthly,
          monthly_amount,
          daily,
          daily_amount,
          max_subscriber
        };
        this.props.addNewService(body);
      }
      this.setState({
        free: true,
        showMonthDailyField: false,
        showMonthAmountField: false,
        showDailyAmountField: false,
        monthly: false,
        daily: false,
        visible: false
      });
      this.props.form.resetFields();
    });
    // const { form } = this.ServiceAddForm;
  };
  showModal = () => {
    this.setState({ visible: true });
  };
  onCancel = () => {
    this.setState({ visible: false });
  };
  constructor(props) {
    super(props);
    this.onMonthlyChange = this.onMonthlyChange.bind(this);
    this.onDailyChange = this.onDailyChange.bind(this);
    this.onFreeChange = this.onFreeChange.bind(this);
  }

  onFreeChange(e) {
    this.setState({
      free: e.target.checked,
      monthly: false,
      showMonthDailyField: !e.target.checked
    });
    this.props.form.setFieldsValue({
      daily_amount: null,
      monthly_amount: null,
      monthly: false,
      daily: false
    });
    if (e.target.checked) {
      this.setState({
        showMonthAmountField: false,
        showDailyAmountField: false
      });
    }
  }
  onMonthlyChange(e) {
    this.setState({
      monthly: e.target.checked
    });
    this.props.form.setFieldsValue({
      monthly_amount: null
    });
    this.setState({ showMonthAmountField: e.target.checked });
  }
  onDailyChange(e) {
    this.props.form.setFieldsValue({
      daily_amount: null
    });
    this.setState({ showDailyAmountField: e.target.checked });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    return (
      <Fragment>
        <Button onClick={this.showModal} id="GrossAddBtn">
          {/* <Icon type="plus" /> */}
          New Service
        </Button>
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          width={647}
          title="Add New Service"
          onCancel={this.onCancel}
          destroyOnClose={true}
          className={"AddServiceModal"}
          footer={[null, null]}
        >
          <Form onSubmit={this.handleSubmit} id="ServiceAddForm">
            <Form.Item label="Name:" className={"formLabel"}>
              {getFieldDecorator("title", {
                rules: [
                  {
                    required: true,
                    message: "Please input service name!"
                  }
                ]
              })(<Input placeholder="Enter Service Name" />)}
            </Form.Item>
            <Form.Item label="Details">
              {getFieldDecorator("details", {
                rules: [
                  { required: true, message: "Please input service details!" }
                ]
              })(
                <TextArea
                  placeholder="Details About the Service"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("free", {
                initialValue: this.state.free,
                valuePropName: "checked"
              })(
                <Checkbox onChange={this.onFreeChange}>Free Service?</Checkbox>
              )}
            </Form.Item>

            <Row gutter={8}>
              <Col span={10}>
                <Form.Item
                  style={{
                    display: this.state.showMonthDailyField ? "block" : "none"
                  }}
                >
                  {getFieldDecorator("monthly", { valuePropName: "checked" })(
                    <Checkbox onChange={this.onMonthlyChange}>
                      Monthly Subscription?
                    </Checkbox>
                  )}
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item
                  label="Monthly Amount (Tk)"
                  style={{
                    display: this.state.showMonthAmountField ? "block" : "none"
                  }}
                >
                  {getFieldDecorator("monthly_amount", {
                    rules: [
                      {
                        required: this.state.monthly ? true : false,
                        message: "Enter Monthly Amount for Subscription"
                      }
                    ]
                  })(<InputNumber style={{ width: "100%" }} />)}
                </Form.Item>
              </Col>
            </Row>

            {/* <Row gutter={8}>
              <Col span={10}>
                <Form.Item
                  style={{
                    display: this.state.showMonthDailyField ? "block" : "none"
                  }}
                >
                  {getFieldDecorator("daily", { valuePropName: "checked" })(
                    <Checkbox onChange={this.onDailyChange}>
                      Daily Subscription?
                    </Checkbox>
                  )}
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item
                  label="Daily Amount (Tk)"
                  style={{
                    display: this.state.showDailyAmountField ? "block" : "none"
                  }}
                >
                  {getFieldDecorator("daily_amount", {
                    rules: [
                      {
                        required: this.state.daily,
                        message: "Enter Daily Amount for Subscription"
                      }
                    ]
                  })(<InputNumber style={{ width: "100%" }} />)}
                </Form.Item>
              </Col>
            </Row> */}

            <Form.Item
              label="Max Subscriber (Optional)"
            // style={{ display: this.state.daily ? "block" : "none" }}
            >
              {getFieldDecorator(
                "max_subscriber",
                {}
              )(
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Maximum Subscriber [***Keep Blank for Unlimited Subscriber]"
                />
              )}
            </Form.Item>
            <br />
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
      </Fragment>
    );
  }
}

const ServiceAddForm = Form.create()(ServiceForm);

export default connect(null, { addNewService })(ServiceAddForm);
