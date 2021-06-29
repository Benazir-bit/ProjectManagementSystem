import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Button, Modal, Form, Input, Radio, DatePicker } from "antd";

const UpdateAttendanceModalCreateForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends Component {
    render() {
      const { visible, onCancel, onCreate, form, attendanceData } = this.props;

      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form>
            <Form.Item style={{ marginBottom: 0 }}>
              <Form.Item
                label="In Time"
                style={{ display: "inline-block", width: "calc(50% - 12px)" }}
              >
                {getFieldDecorator("in_time", {
                  initialValue: attendanceData ? attendanceData.in_time : null
                })(<Input type="textarea" />)}
              </Form.Item>

              <Form.Item
                label="Out Time"
                style={{ display: "inline-block", width: "calc(50% - 12px)" }}
              >
                {getFieldDecorator("out_time", {
                  initialValue: attendanceData ? attendanceData.out_time : null
                })(<Input type="textarea" />)}
              </Form.Item>

              {/* <Form.Item
                label="In Time"
                style={{ display: "inline-block", width: "calc(50% - 12px)" }}
              >
                {getFieldDecorator("in_time", {
                  initialValue: attendanceData
                    ? this.attendanceData.map(item => {
                        item.in_time;
                      })
                    : null
                })(<Input type="textarea" />)}
              </Form.Item>

              <Form.Item
                label="Out Time"
                style={{ display: "inline-block", width: "calc(50% - 12px)" }}
              >
                {getFieldDecorator("out_time", {
                  initialValue: attendanceData
                    ? this.attendanceData.map(item => {
                        item.out_time;
                      })
                    : null
                })(<Input type="textarea" />)}
              </Form.Item> */}
            </Form.Item>
            <Form.Item label="Reason">
              {getFieldDecorator("reason", {
                rules: [
                  {
                    required: true,
                    message:
                      "Please input the reason of update attendance time!"
                  }
                ]
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class UpdateAttendanceModal extends Component {
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
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log("Received values of form: ", values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    console.log("DATA FROM TABLE ####### ", this.props.attendanceData);
    return (
      <div>
        <Button type="link" onClick={this.showModal}>
          Request for Time Update
        </Button>
        <UpdateAttendanceModalCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default UpdateAttendanceModal;
