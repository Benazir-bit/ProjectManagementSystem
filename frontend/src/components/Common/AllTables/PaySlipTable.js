import React, { Component } from "react";
import { List } from "antd";
import "./PaySlipTable.css";

class PaySlipTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
  }
  componentDidMount() {
    this.setState({
      data: this.props.data
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props != prevProps) {
      this.setState({
        data: this.props.data
      });
    }
  }
  render() {
    return (
      <div>
        <List
          size="large"
          header={<div>{this.props.header}</div>}
          className="list_header"
          footer={
            <List.Item className="list_item">
              <List.Item.Meta title={this.props.footer} />
              <div>Tk. {this.props.amount}</div>
            </List.Item>
          }
          bordered
          dataSource={this.state.data}
          renderItem={item => (
            <List.Item className="list_item">
              <List.Item.Meta title={item.title} />
              <div>Tk. {item.amount}</div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export default PaySlipTable;
