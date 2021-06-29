import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateProfile } from "../../../../actions/profile";
import { Form, Modal, Button, Input, DatePicker, Select } from "antd";
import "./UpdateProfileModal.css";

const CollectionCreateForm = (
  class extends Component {
    render() {
      //   const { profile } = this.props.profile;
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const prefixSelector = getFieldDecorator("prefix", {
        initialValue: "88"
      })(
        <Select style={{ width: 70 }}>
          <Select.Option value="88">+88</Select.Option>
        </Select>
      );
      return (
        <Fragment>
          <Modal
            visible={visible}
            maskClosable={false}
            width={600}
            title="Update Profile"
            okText="Update"
            onCancel={onCancel}
            onOk={onCreate}
            okType={"primary"}
            destroyOnClose={true}
          >
            <br />
            <Form layout="vertical" id="UpdateProfileModal">
              <Form.Item label="Name">
                {getFieldDecorator("name", {
                  initialValue: this.props.profile.full_name
                })(<Input readOnly />)}
              </Form.Item>
              <Form.Item label="Employee ID:" className={"formLabel"}>
                {getFieldDecorator("EmployeeID", {
                  initialValue: this.props.profile.username
                })(<Input readOnly />)}
              </Form.Item>
              <Form.Item label="Designation:" className={"formLabel"}>
                {getFieldDecorator("Designation", {
                  initialValue: this.props.profile.dsg
                })(<Input readOnly />)}
              </Form.Item>
              <Form.Item label="Date of Birth:" className={"formLabel"}>
                {getFieldDecorator("DateofBirth", {
                  initialValue: this.props.profile.date_of_birth
                })(<Input readOnly />)}
              </Form.Item>
              <Form.Item label="Date of Joining:" className={"formLabel"}>
                {getFieldDecorator("DateofJoining", {
                  initialValue: this.props.profile.date_of_joining
                })(<Input readOnly />)}
              </Form.Item>
              <Form.Item label="Phone Number" className={"formLabel"}>
                {getFieldDecorator("phone_number", {
                  initialValue: this.props.profile.phone_number
                })(
                  <Input
                    addonBefore={prefixSelector}
                    style={{ width: "100%" }}
                    placeholder="Phone Number"
                    maxLength={11}
                  />
                )}
              </Form.Item>
              <Form.Item label="Present Address:" className={"formLabel"}>
                {getFieldDecorator("present_address", {
                  initialValue: this.props.profile.present_address
                })(<Input placeholder="Present Address" />)}
              </Form.Item>
              <Form.Item label="Highest Degree:" className={"formLabel"}>
                {getFieldDecorator("highest_degree", {
                  initialValue: this.props.profile.highest_degree
                })(<Input placeholder="Highest Degree" />)}
              </Form.Item>
              <Form.Item label="Blood Group:" className={"formLabel"}>
                {getFieldDecorator("BloodGroup", {
                  initialValue: this.props.profile.blood_group
                })(<Input readOnly />)}
              </Form.Item>

              <Form.Item label="Emergency Contact:" className={"formLabel"}>
                {getFieldDecorator("emergency_contact", {
                  initialValue: this.props.profile.emergency_contact
                })(
                  <Input
                    addonBefore={prefixSelector}
                    style={{ width: "100%" }}
                    maxLength={11}
                  />
                )}
              </Form.Item>
            </Form>
          </Modal>
        </Fragment>
      );
    }
  }
);

class UpdateProfileModal extends React.Component {
  state = {
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;

    form.validateFields(err => {
      if (err) {
        return;
      }
      const {
        phone_number,
        present_address,
        highest_degree,
        emergency_contact
      } = form.getFieldsValue();
      let user_id = this.props.profile.user;
      const body = {
        user_id,
        phone_number,
        present_address,
        highest_degree,
        emergency_contact
      };
      console.log(body);
      this.props.updateProfile(this.props.profile.user, body);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    if (!this.props.profile) {
      return null;
    }
    return (
      <Fragment>
        <Button onClick={this.showModal} type="primary">
          Update Profile
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          profile={this.props.profile}
        />
      </Fragment>
    );
  }
}

// export default UpdateProfileModal;

const mapStateToProps = state => ({
  profile: state.profile.profile
});
export default connect(
  mapStateToProps,
  { updateProfile }
)(UpdateProfileModal);
