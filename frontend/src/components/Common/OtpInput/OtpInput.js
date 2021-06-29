import React, { Component, Fragment } from "react";
import { Form, InputNumber, Button, Input, DatePicker, Select } from "antd";
import {
  genOtpCode,
  validateOtpCode,
  validateOtpCheck
} from "../../../actions/otp";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import "./OtpInput.css";
import { loadUser } from "../../../actions/auth";

const { MonthPicker } = DatePicker;
class OtpInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: "",
      payslip_type: ""
    };
  }
  componentWillMount() {
    this.props.validateOtpCheck();
    if (!this.props.otp.access) {
      this.props.genOtpCode(this.props.user.username);
    }
  }

  //   componentWillUnmount() {}
  onChange = (date, dateString) => {
    this.setState({
      month: dateString + "-01"
    });
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var body;
        if (this.state.payslip_type == "salary-pay") {
          body = {
            username: values.username,
            otp: values.code,
            month: this.state.month,
            payslip_type: this.state.payslip_type,
            payslip_id: values.payslip_id
          };
        } else {
          body = {
            username: values.username,
            otp: values.code,
            payslip_type: this.state.payslip_type,
            payslip_id: values.payslip_id
          };
        }

        this.props.validateOtpCode(body);
      }
    });
  };
  selectChangeType = value => {
    this.setState({
      payslip_type: value
    });
  };

  render() {
    console.log("otp", this.props.otp);
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 }
    };

    const { getFieldDecorator } = this.props.form;
    if (this.props.otp.access) {
      return (
        <Redirect
          to={`/payslip/?id=${this.props.otp.payslip_id}&type=${this.props.otp.payslip_type}`}
        />
      );
    }
    // else if (
    //   this.props.otp.ERROR_401 ||
    //   this.props.otp.ERROR_408 ||
    //   this.props.otp.ERROR_400
    // ) {
    //   return <Redirect to="/invalid" />;
    // }
    return (
      <Fragment>
        <div className="col-sm-8" id="base-main-body">
          <div className="row">
            <div className="col-sm-12">
              <div id="main-body-div">
                <br />
                <br />
                <br />
                <br />
                <p style={{ color: "red", fontSize: "23px" }}>
                  Please Check Your Email And Enter Your 6 Digit Verification
                  Code.
                </p>

                <div
                  className="form"
                  style={{
                    margin: "0 auto",
                    textAlign: "center",
                    verticalAlign: "middle",
                    background: "aliceblue",
                    border: "1px solid #e8e8e8",
                    padding: "23px"
                  }}
                >
                  <Form onSubmit={this.onSubmit} {...formItemLayout}>
                    <Form.Item label="User ID :">
                      {getFieldDecorator("username", {
                        rules: [
                          {
                            required: true,
                            message: "Please input your username!"
                          }
                        ]
                      })(
                        <Input
                          id="id_username"
                          type="text"
                          name="username"
                          placeholder="User ID"
                        />
                      )}
                    </Form.Item>

                    <Form.Item label="Select Payslip Type :">
                      {getFieldDecorator("payslip_type", {
                        rules: [
                          {
                            required: true,
                            message: "Please Select Payslip Type!"
                          }
                        ]
                      })(
                        <Select
                          style={{ width: "100%" }}
                          required
                          onChange={this.selectChangeType}
                          placeholder="Select Payslip Type"
                        >
                          <Select.Option value={"salary-pay"}>
                            Salary
                          </Select.Option>
                          <Select.Option value={"festival-bonus"}>
                            Festival Bonus
                          </Select.Option>
                          <Select.Option value={"loan-pay"}>Loan</Select.Option>
                          <Select.Option value={"others-pay"}>
                            Others
                          </Select.Option>
                        </Select>
                      )}
                    </Form.Item>
                    {this.state.payslip_type == "salary-pay" ? (
                      <Form.Item label="Select Month :">
                        {getFieldDecorator("month", {
                          rules: [
                            { required: true, message: "Please select month!" }
                          ]
                        })(
                          <MonthPicker
                            className="monthpickerOTP"
                            onChange={this.onChange}
                            placeholder="Select month"
                          />
                        )}
                      </Form.Item>
                    ) : this.state.payslip_type == "" ? null : (
                      <Form.Item label="Enter Payslip ID :">
                        {getFieldDecorator("payslip_id", {
                          rules: [
                            {
                              required:
                                this.state.payslip_type != "salary-pay"
                                  ? true
                                  : false,
                              message: "Please Payslip ID!"
                            }
                          ]
                        })(
                          <Input
                            // className="codeval"
                            name="payslip_id"
                            placeholder="Payslip ID"
                          />
                        )}
                      </Form.Item>
                    )}

                    <Form.Item label="Enter 6 Digit Code :">
                      {getFieldDecorator("code", {
                        rules: [
                          {
                            required: true,
                            message: "Please input your 6 digit code!"
                          }
                        ]
                      })(
                        <InputNumber
                          className="codeval"
                          name="code"
                          placeholder="code"
                        />
                      )}
                    </Form.Item>

                    <Button
                      htmlType="submit"
                      type="primary"
                      style={{ marginLeft: "14px" }}
                    >
                      Submit
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  otp: state.otp,
  payrollNotFound: state.accounts.payrollNotFound
});

const WrappedCode = Form.create()(OtpInput);
export default connect(mapStateToProps, {
  genOtpCode,
  validateOtpCode,
  loadUser,
  validateOtpCheck
})(WrappedCode);
