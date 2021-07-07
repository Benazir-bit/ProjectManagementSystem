import React, { Component, Fragment } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateProfile } from "../../../../actions/profile";
import { Form, Modal, Button, Input } from "antd";
import "./UpdateProfileModal.css";

const CollectionCreateForm = (
  class extends Component {
    render() {
      //   const { profile } = this.props.profile;
      const { visible, onCancel, onCreate } = this.props;
      // const { getFieldDecorator } = form;
      // const prefixSelector = getFieldDecorator("prefix", {
      //   initialValue: "88"
      // })(
      //   <Select style={{ width: 70 }}>
      //     <Select.Option value="88">+88</Select.Option>
      //   </Select>
      // );
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
            <Form layout="vertical" id="UpdateProfileModal" initialValues={{
              'name': this.props.profile.full_name,
              'EmployeeID': this.props.profile.username,
              'Designation': this.props.profile.dsg,
              'DateofBirth': this.props.profile.date_of_birth,
              'DateofJoining': this.props.profile.date_of_joining,
              'phone_number': this.props.profile.phone_number,
              'highest_degree': this.props.profile.highest_degree,
              'BloodGroup': this.props.profile.blood_group,
              'emergency_contact': this.props.profile.emergency_contact,
            }}>
              <Form.Item label="Name" name="name">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Employee ID:" name="EmployeeID" className={"formLabel"}>
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Designation:" name="Designation" className={"formLabel"}>
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Date of Birth:" name="DateofBirth" className={"formLabel"}>
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Date of Joining:" name="DateofJoining" className={"formLabel"}>
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Phone Number" name="phone_number" className={"formLabel"}>
                <Input
                  // addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  placeholder="Phone Number"
                  maxLength={11}
                />
              </Form.Item>
              <Form.Item label="Present Address:" name="present_address" className={"formLabel"}>
                <Input placeholder="Present Address" />
              </Form.Item>
              <Form.Item label="Highest Degree:" name="highest_degree" className={"formLabel"}>
                <Input placeholder="Highest Degree" />
              </Form.Item>
              <Form.Item label="Blood Group:" name="BloodGroup" className={"formLabel"}>
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Emergency Contact:" name="emergency_contact" className={"formLabel"}>
                <Input
                  // addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  maxLength={11}
                />
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
