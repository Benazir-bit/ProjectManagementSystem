import React, { Component } from "react";
// import ReactDOM from "react-dom";
import { connect } from "react-redux";
// import moment from "moment";
import { getTaskDetails, startTask } from "../../../../actions/task";
import { Button } from "antd";

class StartTaskBtn extends Component {
  state = {
    loading: false
  };

  onClick = e => {
    this.setState({ loading: true });
    // var currentDate = new Date();
    // var start_date = moment(currentDate).format("YYYY-MM-DD");
    this.props.startTask(this.props.task.id, true);
    const onClick = this.props.onClick;
    if (onClick) {
      onClick(e);
    }
  };

  render() {
    return (
      <div>
        <Button
          type="primary"
          id="TaskStartBtn"
          loading={this.state.loading}
          onClick={this.onClick}
        >
          Start Task
        </Button>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  task: state.tasks.task
});

const mapActionsToProps = {
  getTaskDetails: getTaskDetails,
  startTask: startTask
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(StartTaskBtn);
