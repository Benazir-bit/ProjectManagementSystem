import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, Modal, Button, Input } from "antd";
import { updatePassword } from "../../../../actions/profile";

import "./ResetPasswordModal.css";

const CollectionCreateForm = (
  class extends Component {
    validatePassword = (rule, value, callback) => {
      if (value && value.length < 8) {
        callback("Password must be atleast 8 characters");
      } else {
        callback();
      }
    };
    compareToFirstPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue("new_password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    };

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Fragment>
          <Modal
            title="Reset Password"
            visible={visible}
            okText="Reset"
            onCancel={onCancel}
            onOk={onCreate}
            maskClosable={false}
            okType={"danger"}
            destroyOnClose={true}
            compareToFirstPassword={this.compareToFirstPassword}
            validateToNextPassword={this.validateToNextPassword}
          >
            <Form layout="vertical" id="ProjectModalForm">
              <Form.Item label="Enter Old Password">
                {getFieldDecorator("old_password", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your old password!"
                    }
                  ]
                })(<Input.Password />)}
              </Form.Item>

              <Form.Item label="Password">
                {getFieldDecorator("new_password", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your new password!"
                    },
                    {
                      validator: this.validatePassword
                    }
                  ]
                })(<Input.Password />)}
              </Form.Item>
              <Form.Item label="Confirm Password">
                {getFieldDecorator("new_password1", {
                  rules: [
                    {
                      required: true,
                      message: "Please confirm your new password!"
                    },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(<Input.Password />)}
              </Form.Item>
            </Form>
          </Modal>
        </Fragment>
      );
    }
  }
);

class ResetPasswordModal extends React.Component {
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

      // console.log(form.getFieldsValue());
      const { old_password, new_password } = form.getFieldsValue();
      const body = {
        old_password,
        new_password
      };
      this.props.updatePassword(body);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  state = {
    confirmDirty: false
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    // consol;
  };

  render() {
    return (
      <Fragment>
        <Button type="danger" onClick={this.showModal} id="ResetButton">
          Reset Password
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          compareToFirstPassword={this.compareToFirstPassword}
          validateToNextPassword={this.validateToNextPassword}
          hasFeedback={true}
        />
      </Fragment>
    );
  }
}

export default connect(
  null,
  { updatePassword }
)(ResetPasswordModal);
