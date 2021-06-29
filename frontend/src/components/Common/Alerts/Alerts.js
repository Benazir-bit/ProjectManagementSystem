import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import "./Alerts.css";
import { InIt } from "../../../actions/accounts";
import { message, Alert } from "antd";
import loading from "../../../reducers/loading";
import { Prompt } from "react-router-dom";
import { isAbsolute } from "path";

class Alerts extends Component {
  // static propTypes = {
  //   error: PropTypes.object.isRequired
  // };
  constructor(props) {
    super(props);
    message.config({
      top: 51,
      duration: 3,
      maxCount: 3
    });
  }

  componentDidUpdate(prevProps) {
    const { error, loading } = this.props;
    if (loading) {
      message.loading("Action in progress..", 0.3);
    }
    // else {
    //   message.destroy();
    // }
    if (error !== prevProps.error) {
      if (error) {
        if (error.type == "success") {
          message.success(error.msg).then(this.props.InIt());
        } else if (error.type == "error") {
          message.error(error.msg).then(this.props.InIt());
        }
      }
    }
  }
  render() {
    return (
      <Fragment />
      // <Prompt
      //   when={this.props.loading}
      //   message={location =>
      //     `Are you sure you want to go to ${location.pathname}`
      //   }
      // />
    );
  }
}

const mapStateToProps = state => ({
  error: state.alerts.error,
  loading: state.loading.loading
});

export default connect(mapStateToProps, { InIt })(withAlert()(Alerts));
