import React, { Component, Fragment } from "react";
import { List, Avatar, Skeleton } from "antd";
import moment from "moment-timezone";

class Threads extends Component {
  handleThreadSelect(thread) {
    this.props.handleThreadSelect(thread);
  }
  render() {
    if (!this.props.threads) {
      return (
        <Fragment>
          <List itemLayout="horizontal" className="contactList">
            <List.Item>
              <Skeleton avatar title paragraph={{ rows: 1 }} active />
            </List.Item>
            <List.Item>
              <Skeleton avatar title paragraph={{ rows: 1 }} active />
            </List.Item>
            <List.Item>
              <Skeleton avatar title paragraph={{ rows: 2 }} active />
            </List.Item>
          </List>
        </Fragment>
      );
    } else {
      let threads = this.props.threads
        .sort((a, b) =>
          moment(a.last_updated).isBefore(b.last_updated) ? 1 : -1
        )
        .map((thread, index) => (
          <Fragment key={thread.id}>
            <a onClick={() => this.handleThreadSelect(thread)}>
              <List.Item key={thread.id}>
                <List.Item.Meta
                  avatar={<Avatar src={thread.other_user.image} />}
                  title={thread.other_user.full_name}
                />
              </List.Item>
            </a>
          </Fragment>
        ));
      return (
        <Fragment>
          <List itemLayout="horizontal" className="contactList">
            {threads}
          </List>
        </Fragment>
      );
    }
  }
}

export default Threads;
