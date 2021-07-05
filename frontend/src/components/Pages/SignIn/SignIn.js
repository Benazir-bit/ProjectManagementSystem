import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { login } from "../../../actions/auth";
import "./Fonts.css";
import "./SignIn.css";
import "antd/dist/antd.css";
import WelcomeSplash from "../../Common/Spinner/WelcomeSplash";
import { Form, Input, Button, Checkbox } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import logoUlka from './ulkasemi_logo.png'
class SignIn extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  onChange = e => {
    // this.props.form.setFieldsValue({
    //   [e.target.name]: e.target.value
    // });
  };

  onSubmit = e => {
    console.log("ooo")
    this.props.login(e.userid, e.password);
  };

  render() {
    // const { getFieldDecorator } = this.props.form;
    if (this.props.isSplash) {
      return <WelcomeSplash />;
    }
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <div id="content-container" className="container p-none">
        <div className="lgn-container col-lg-16">
          <br />
          <br />
          <br />
          <div>
            <div style={{ textAlign: "center" }}>
              <img
                id="login-logo"
                style={{
                  height: "300px",
                  marginTop: "70px"
                }}
                src={logoUlka}
              />
            </div>
            <div id="signup">
              <p id="Sup">SIGN IN</p>
            </div>
            <div
              className="form"
              style={{
                margin: "0 auto",
                textAlign: "center",
                verticalAlign: "middle",
                maxWidth: "350px",
                padding: "15px"
              }}
            >
              <Form
                // initialValues={{
                //   name:
                // }}
                onFinish={this.onSubmit} className="login-form">
                <Form.Item name="userid" rules={[
                  { required: true, message: "Please input your username!" }
                ]}>

                  <Input
                    id="id_username"
                    type="text"
                    name="username"
                    placeholder="User ID"
                    onChange={this.onChange}
                    prefix={
                      <InboxOutlined
                        type="user"
                        style={{ color: "rgba(0,0,0,.25)" }}
                      />
                    }
                  />

                </Form.Item>

                <Form.Item name="password" rules={[
                  { required: true, message: "Please input your Password!" }
                ]}>
                  <Input
                    type="password"
                    name="password"
                    onChange={this.onChange}
                    placeholder="Password"
                  // prefix={
                  //   <Icon
                  //     type="lock"
                  //     style={{ color: "rgba(0,0,0,.25)" }}
                  //   />
                  // }
                  />

                </Form.Item>
                <Form.Item name="remember" initialValue="true">

                  <Checkbox style={{ float: "left", fontWeight: "normal" }}>
                    Remember me
                  </Checkbox>

                  <Link className="login-form-forgot" to="/">
                    Forgot password
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Log in
                  </Button>
                  Or <Link to="/">register now!</Link>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isSplash: state.auth.isSplash,
  error: state.alerts.error
});
// const WrappedLogin = Form.create()(SignIn);
export default connect(mapStateToProps, { login })(SignIn);
