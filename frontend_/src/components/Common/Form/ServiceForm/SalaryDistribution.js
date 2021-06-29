import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, InputNumber, Button, DatePicker } from "antd";
import "./ServiceForm.css";
import { getDistribution, updateSalDist } from "../../../../actions/accounts";
import { createMessage } from "../../../../actions/alerts";

class SalaryDistributionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basic: 0.0,
      house_rent_allowance: 0.0,
      conveyance: 0.0,
      medical_allowance: 0.0,
      entertainment_expense: 0.0,
      special_allowance: 0.0,
      other_earnings: 0.0,
      loading: false,
      iconLoading: false
    };
  }

  componentDidMount() {
    this.props.getDistribution();
  }

  componentDidUpdate(prevProps) {
    if (this.props.distribution !== prevProps.distribution) {
      this.setState({
        basic: this.props.distribution.basic,
        conveyance: this.props.distribution.conveyance,
        house_rent_allowance: this.props.distribution.house_rent_allowance
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      const total =
        values.basic +
        values.conveyance +
        values.house_rent_allowance +
        values.medical_allowance +
        values.entertainment_expense +
        values.special_allowance +
        values.other_earnings;
      if (total != 100) {
        this.props.createMessage(
          "Total Distribution Must Be 100%",
          "error",
          "top center"
        );
      } else {
        this.setState({
          basic,
          conveyance,
          house_rent_allowance,
          medical_allowance,
          entertainment_expense,
          special_allowance,
          other_earnings
        });
        if (!err) {
          const basic = values.basic / 100;
          const conveyance = values.conveyance / 100;
          const house_rent_allowance = values.house_rent_allowance / 100;
          const medical_allowance = values.medical_allowance / 100;
          const entertainment_expense = values.entertainment_expense / 100;
          const special_allowance = values.special_allowance / 100;
          const other_earnings = values.other_earnings
            ? values.other_earnings / 100
            : 0;
          const body = {
            basic,
            conveyance,
            house_rent_allowance,
            medical_allowance,
            entertainment_expense,
            special_allowance,
            other_earnings
          };
          this.props.updateSalDist(body);
          this.setState({
            loading: true,
            iconLoading: true
          });
          setTimeout(() => {
            this.setState({ loading: false, iconLoading: false });
          }, 800);
        } else {
          callback(err);
        }
      }
    });
  };

  render() {
    if (!this.props.distribution) {
      return null;
    }

    const { fetching, value, data } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} id="ServiceAddForm">
        <Form.Item label="Basic (%)">
          {getFieldDecorator("basic", {
            initialValue: this.props.distribution.basic * 100,
            rules: [
              {
                type: "number",
                required: true,
                message: "Please Enter Amount"
              }
            ]
          })(
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="Enter Percentage"
            />
          )}
        </Form.Item>
        <Form.Item label="House Rent Allowance (%)">
          {getFieldDecorator("house_rent_allowance", {
            initialValue: this.props.distribution.house_rent_allowance * 100,
            rules: [
              {
                type: "number",
                required: true,
                message: "Please Enter Amount"
              }
            ]
          })(
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="Enter Percentage"
            />
          )}
        </Form.Item>
        <Form.Item label="Conveyance (%)">
          {getFieldDecorator("conveyance", {
            initialValue: this.props.distribution.conveyance * 100,
            rules: [
              {
                type: "number",
                required: true,
                message: "Please Enter Amount"
              }
            ]
          })(
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="Enter Percentage"
            />
          )}
        </Form.Item>

        <Form.Item label="Medical Allowance (%)">
          {getFieldDecorator("medical_allowance", {
            initialValue: this.props.distribution.medical_allowance * 100,
            rules: [
              {
                type: "number",
                required: true,
                message: "Please Enter Amount"
              }
            ]
          })(
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="Enter Percentage"
            />
          )}
        </Form.Item>
        <Form.Item label="Entertainment (%)">
          {getFieldDecorator("entertainment_expense", {
            initialValue: this.props.distribution.entertainment_expense * 100,
            rules: [
              {
                type: "number",
                required: true,
                message: "Please Enter Amount"
              }
            ]
          })(
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="Enter Percentage"
            />
          )}
        </Form.Item>

        <Form.Item label="Special Allowance (%)">
          {getFieldDecorator("special_allowance", {
            initialValue: this.props.distribution.special_allowance * 100,
            rules: [
              {
                type: "number",
                required: true,
                message: "Please Enter Amount",
                min: "0",
                max: "100"
              }
            ]
          })(
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="Enter Percentage"
            />
          )}
        </Form.Item>
        <Form.Item label="Others (%)">
          {getFieldDecorator("other_earnings", {
            initialValue: this.props.distribution.other_earnings * 100,
            rules: [
              {
                type: "number",
                required: true,
                message: "Please Enter Amount"
              }
            ]
          })(
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="Enter Percentage"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: 130 }}
            loading={this.state.loading}
            onClick={this.enterLoading}
          >
            Set
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const DistributionSettingsForm = Form.create()(SalaryDistributionForm);

const mapStateToProps = state => ({
  distribution: state.accounts.distribution
});

const mapActionsToProps = {
  getDistribution: getDistribution,
  updateSalDist: updateSalDist,
  createMessage: createMessage
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(DistributionSettingsForm);
