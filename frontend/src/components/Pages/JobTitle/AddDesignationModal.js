import React, { Component, Fragment } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { connect } from "react-redux";
// import { getGroupDetails, UpdateGroup } from '../../../actions/group'
import { getGroupListAll } from "../../../actions/group";
import { AddDesignation, UpdateDesignation } from "../../../actions/HR";

const { Option } = Select;

class AddDesignationModal extends Component {
  state = {
    group: [],
    title: "",
    id: "",
    designation: "",
    visible: false
  };

  componentDidMount() {
    this.props.onRef(this);
  }
  showModal(value) {
    this.props.getGroupListAll();
    if (value == "post") {
      this.setState({
        visible: true,
        title: "",
        group: "",
        designation: value
      });
    } else {
      this.setState({
        visible: true,
        title: value.title_name,
        group: value.group,
        designation: value
      });
    }
  }
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  changeTitleName = e => {
    this.setState({
      title: e.target.value
    });
  };

  // componentWillReceiveProps(nextProps) {
  //     this.state.group = nextProps.group.name
  //     console.log(nextProps.group.teamleader.id)
  //     this.setState({
  //         teamleader_id: nextProps.group.teamleader.id
  //     })
  //     if (nextProps.group.teamleader) {
  //         nextProps.group.teamleader.teamleaders.map((teamleader, i) => {
  //             this.state.value.push(teamleader.profile.user)
  //         })
  //     }
  // }

  handleChange = value => {
    //console.log(`Selected: ${value}`);
    this.setState({
      group: value
    });
  };

  handleSubmit = () => {
    if (this.state.title && this.state.group.length != 0) {
      //console.log("Received values of form: ", this.props.group_id, this.state.group, this.state.value);
      const body = {
        title_name: this.state.title,
        group: this.state.group
      };
      const body_update = {
        id: this.state.designation.id,
        title_name: this.state.title,
        group: this.state.group
      };
      if (this.state.designation == "post") {
        this.props.AddDesignation(body);
      } else {
        this.props.UpdateDesignation(body_update);
      }

      this.setState({
        visible: false
      });
    }
  };

  render() {
    if (!this.props.groups) {
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
    if (this.props.groups) {
      this.props.groups.map((group, i) => {
        children.push(
          <Option key={i} value={group.id}>
            {group.name}
          </Option>
        );
      });
    }
    const designation_select =
      this.state.designation == "post" ? (
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          onChange={this.handleChange}
          getPopupContainer={trigger => trigger.parentNode}
        >
          {children}
        </Select>
      ) : (
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={this.state.group}
          onChange={this.handleChange}
          getPopupContainer={trigger => trigger.parentNode}
        >
          {children}
        </Select>
      );

    return (
      <Fragment>
        <Modal
          title="Add Designation"
          destroyOnClose={true}
          maskClosable={false}
          onCancel={this.handleCancel}
          visible={this.state.visible}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button type="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            <Form.Item label={<span>Title</span>}>
              {this.state.designation == "post" ? (
                <Input
                  type="text"
                  value={this.state.title}
                  onChange={this.changeTitleName}
                />
              ) : (
                <Input
                  type="text"
                  value={this.state.title}
                  onChange={this.changeTitleName}
                />
              )}
            </Form.Item>
            <Form.Item label={<span>Selected Group</span>}>
              {designation_select}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  groups: state.group.allgroup
});

const WrappedGroupForm = Form.create()(AddDesignationModal);
//export default WrappedGroupForm
export default connect(mapStateToProps, {
  getGroupListAll,
  AddDesignation,
  UpdateDesignation
})(WrappedGroupForm);
