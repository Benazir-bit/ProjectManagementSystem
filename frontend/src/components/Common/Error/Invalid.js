import React, { Component } from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import { validateOtpCheck } from "../../../actions/otp";

class Invalid extends Component {
  componentWillMount() {
    this.props.validateOtpCheck();
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row content">
          <br />
          <br />
          <br />

          <Result
            status="error"
            title="Validation Failed"
            //subTitle={this.props.location.state.error == 'OTP INCORRECT' ? 'You have given incorrect OTP. Please check and Try again!' : 'You Session has been expired. Please regenerate your code!'}
            extra={[
              <Button>
                <Link to="/otpinput">Try Again</Link>
              </Button>
            ]}
          ></Result>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  otp: state.otp
});
export default connect(mapStateToProps, { validateOtpCheck })(Invalid);
