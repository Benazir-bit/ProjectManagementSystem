import React, { Component, Fragment } from "react";
import { Alert } from "antd";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./Alerts.css";
import { InIt } from "../../../actions/accounts";
class Alerts extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired
  };
  OnClose = () => {
    console.log("closeeeeeeeeeeeeeeee");
    this.props.InIt();
  };
  close = () => {
    console.log("hooooooooooooo");
  };
  componentDidUpdate(prevProps) {
    console.log("Alertttttttttttt");
    const { error, alert } = this.props;
    if (error !== prevProps.error) {
      // if (error.msg.non_field_errors) {
      //   this.props.setAlertPosition(error.position);
      //   alert.show(
      //     <div className="emsAlertContainer emsAlertRight  emsAlertAnimate">
      //       <Alert
      //         message={error.msg.non_field_errors[0]}
      //         type={error.type}
      //         showIcon
      //         closable
      //         style={{
      //           fontWeight: 700
      //         }}
      //       />
      //     </div>
      //   );
      // }
      if (error.msg) {
        this.props.setAlertPosition(error.position);
        alert.show(
          <div className="emsAlertContainer emsAlertRight  emsAlertAnimate">
            <Alert
              afterClose={this.OnClose}
              onClose={this.close}
              message={error.msg}
              type={error.type}
              showIcon
              closable
              style={{
                fontWeight: 700
              }}
            />
          </div>
        );
      }
    }
    // if (this.props.message !== prevProps.message) {
    //   if (this.props.message) {
    //     console.log(this.props.message);
    //     this.props.setAlertPosition(this.props.position);
    //     alert.show(
    //       <div className="emsAlertContainer emsAlertRight  emsAlertAnimate">
    //         <Alert
    //           afterClose={() => this.OnClose}
    //           message={this.props.message}
    //           type={this.props.type}
    //           showIcon
    //           closable
    //           style={{
    //             fontWeight: 700
    //           }}
    //         />
    //       </div>
    //     );
    //   }
    // }
  }

  render() {
    return <Fragment />;
  }
}

const mapStateToProps = state => ({
  error: state.alerts.error,
  message: state.alerts.message,
  type: state.alerts.type,
  position: state.alerts.position
});

export default connect(mapStateToProps, { InIt })(withAlert()(Alerts));
