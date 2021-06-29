import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { List, Avatar, Skeleton } from "antd";
import { getAllContacts } from "../../../../actions/chat";
import "../Chat.css";
class Contacts extends Component {
  componentDidMount() {
    this.props.getAllContacts();
  }
  handleContactSelect = user => {
    this.props.handleContactSelect(user);
  };
  render() {
    if (this.props.isContactLoading) {
      return (
        <Fragment>
          <List itemLayout="horizontal">
            <List.Item>
              <Skeleton avatar title paragraph={false} active />
            </List.Item>
            <List.Item>
              <Skeleton avatar title paragraph={false} active />
            </List.Item>
            <List.Item>
              <Skeleton avatar title paragraph={false} active />
            </List.Item>
          </List>
        </Fragment>
      );
    } else {
      let contacts = this.props.contacts.map(user => (
        <Fragment key={user.id}>
          <a onClick={() => this.handleContactSelect(user)}>
            <List.Item key={user.id}>
              <List.Item.Meta
                avatar={<Avatar src={user.image} />}
                title={user.full_name}
              />
            </List.Item>
          </a>
        </Fragment>
      ));
      return (
        <Fragment>
          <List itemLayout="horizontal" className="contactList">
            {contacts}
          </List>
        </Fragment>
      );
    }
  }
}

const mapStateToProps = state => ({
  isContactLoading: state.chat.isContactLoading,
  contacts: state.chat.contacts
});

export default connect(mapStateToProps, { getAllContacts })(Contacts);
