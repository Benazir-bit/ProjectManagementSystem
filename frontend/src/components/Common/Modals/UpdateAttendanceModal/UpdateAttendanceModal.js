import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Button, Modal, Form, Input, TimePicker } from "antd";
import moment from "moment-timezone";
const Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class UpdateAttendanceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkWork: false
    };
  }
  handleChange = e => {
    this.setState(
      {
        checkWork: e.target.checked
      }
      // () => {
      //   this.props.form.validateFields(["nickname"], { force: true });
      // }
    );
  };

  componentDidMount() {
    console.log(this.props.attendanceData);
  }
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
          {attendanceData && attendanceData.in_time ? null : (
            <p>
              <b>Did you work on this day?</b>
            </p>
          )}
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              label="In Time"
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              {getFieldDecorator("in_time", {
                initialValue: attendanceData
                  ? attendanceData.in_time
                    ? moment(attendanceData.in_time)
                    : // .tz(Timezone)
                      // .format("HH:mm")
                      null
                  : null
              })(<TimePicker />)}
            </Form.Item>

            <Form.Item
              label="Out Time"
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              {getFieldDecorator("out_time", {
                initialValue: attendanceData
                  ? attendanceData.out_time
                    ? moment(attendanceData.out_time)
                    : // .tz(Timezone)
                      // .format("HH:mm")
                      null
                  : null
              })(<TimePicker />)}
            </Form.Item>
          </Form.Item>

          <Form.Item label="Remarks for your supervisor">
            {getFieldDecorator("reason", {
              rules: [
                {
                  required: true,
                  message: "Please input the reason of update attendance time!"
                }
              ]
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
const UpdateAttendanceModalCreateForm = Form.create()(UpdateAttendanceModal);
export default connect(null, {})(UpdateAttendanceModalCreateForm);
