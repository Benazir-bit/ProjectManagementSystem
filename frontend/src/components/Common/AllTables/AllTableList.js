import React from "react";
import ReactDOM from "react-dom";
import { List, Descriptions } from "antd";
import { Link } from "react-router-dom";

class AllTableList extends React.Component {
  render() {
    // const data = this.props.data;
    return (
      // const listItems = data.map(data => (

      <Descriptions
        title={
          <Link to={this.props.link} column={this.props.col}>
            {this.props.title}
          </Link>
        }
      >
        <Descriptions.Item label={this.props.supervisor}>
          <Link to={this.props.supervisorLink}>
            {this.props.supervisorName}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label={this.props.duedate}>
          {this.props.date}
        </Descriptions.Item>
        <Descriptions.Item label={this.props.completedDate}>
          {this.props.completed}
        </Descriptions.Item>
        <Descriptions.Item label={this.props.task}>
          <Link to={this.props.taskPath}>{this.props.totalTask}</Link>
        </Descriptions.Item>
      </Descriptions>
    );
  }
}

export default AllTableList;
