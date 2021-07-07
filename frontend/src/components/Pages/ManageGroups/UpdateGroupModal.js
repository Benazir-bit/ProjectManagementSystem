import React, { Component, Fragment } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { connect } from "react-redux";
import { getGroupDetails, UpdateGroup } from "../../../actions/group";
const { Option } = Select;

class UpdateGroupModal extends Component {
  state = {
    value: [],
    group: "",
    teamleader_id: ""
  };

  componentDidMount() {
    this.props.onRef(this);
    this.props.getGroupDetails(this.props.group_id);
  }

  changeGroupName = e => {
    this.setState({
      group: e.target.value
    });
  };

  componentWillReceiveProps(nextProps) {
    this.state.group = nextProps.group.name;
    console.log(nextProps.group.teamleader.id);
    this.setState({
      teamleader_id: nextProps.group.teamleader.id
    });
    if (nextProps.group.teamleader) {
      nextProps.group.teamleader.teamleaders.map((teamleader, i) => {
        this.state.value.push(teamleader.profile.user);
      });
    }
  }

  handleChange = value => {
    //console.log(`Selected: ${value}`);
    this.setState({
      value: value
    });
  };

  handleSubmit = () => {
    //e.preventDefault();
    if (this.state.group && this.state.value.length !== 0) {
      //console.log("Received values of form: ", this.props.group_id, this.state.group, this.state.value);
      const body = {
        id: this.props.group_id,
        name: this.state.group,
        employees: this.state.value,
        teamleader_id: this.state.teamleader_id
      };
      console.log(body);
      this.props.UpdateGroup(body);
    }
  };

  render() {
    if (!this.props.group) {
      return null;
    }
    //this.props.values(this.state.value, this.state.group)
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    const children = [];
    if (this.props.group.user_set) {
      this.props.group.user_set.map((user, i) => {
        children.push(
          <Option key={i} value={user.id}>
            {user.full_name}
          </Option>
        );
      });
    }

    const teamleader_select = (
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        defaultValue={this.state.value}
        onChange={this.handleChange}
        getPopupContainer={trigger => trigger.parentNode}
      >
        {children}
      </Select>
    );

    return (
      <Fragment>
        <Form {...formItemLayout}>
          <Form.Item label={<span>Group Name</span>}>
            <Input
              type="text"
              value={this.state.group}
              onChange={this.changeGroupName}
            />
          </Form.Item>
          <Form.Item label={<span>Select Teamleader</span>}>
            {teamleader_select}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  group: state.group.group
});

// const WrappedGroupForm = Form.create()(UpdateGroupModal);
export default connect(mapStateToProps, { getGroupDetails, UpdateGroup })(
  UpdateGroupModal
);
