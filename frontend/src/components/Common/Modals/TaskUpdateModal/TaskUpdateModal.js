import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { updateTask } from "../../../../actions/task";
import { getTypeMembers } from "../../../../actions/member";
import moment from "moment";
import { Form, Modal, Button, Input, Select, DatePicker } from "antd";
import ImageSmall from "../../ImageSmall/ImageSmall";
import "./TaskUpdateModal.css";

const { TextArea } = Input;
const { Option } = Select;

const CollectionCreateForm = (
  class extends Component {
    render() {
      const { task } = this.props;
      let today = new Date();
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Fragment>
          <Modal
            visible={visible}
            title="Update Task"
            okText="Update"
            onCancel={onCancel}
            onOk={onCreate}
            maskClosable={false}
            destroyOnClose={true}
          >
            <Form layout="vertical" id="TaskUpdateForm">
              <Form.Item label="Task Name">
                {getFieldDecorator("name", {
                  initialValue: task.name,

                  rules: [{ required: true, message: "Enter Task Name!" }]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Details">
                {getFieldDecorator("details", {
                  initialValue: task.details
                })(
                  <TextArea
                    placeholder="Details About the Task"
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />
                )}
              </Form.Item>

              <Form.Item label="Due Date">
                {getFieldDecorator("deadline", {
                  initialValue: moment(task.deadline, "YYYY-MM-DD"),
                  rules: [{ required: true, message: "Enter Due Date!" }]
                })(<DatePicker disabledDate={d => !d || d.isBefore(today)} />)}
              </Form.Item>

              <Form.Item label="Task Owner">
                {getFieldDecorator("assigned_to", {
                  initialValue: task.owner.id,
                  rules: [{ required: true, message: "Select Task Owner!" }]
                })(
                  <Select
                    style={{ width: "100%", height: "36px" }}
                    placeholder="Select Owner"
                  >
                    {this.props.members.map(owner => (
                      <Option key={owner.id} value={owner.id}>
                        <ImageSmall
                          clsattr={"img-circle"}
                          altname={owner.full_name}
                          srcfile={owner.image}
                        />
                        &emsp;{owner.full_name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="Notes">
                {getFieldDecorator("note", { initialValue: task.note })(
                  <TextArea
                    placeholder="Notes"
                    autosize={{ minRows: 2, maxRows: 6 }}
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

class TaskUpdateModal extends React.Component {
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
      console.log(form.getFieldsValue());
      const {
        name,
        details,
        deadline,
        assigned_to,
        note
      } = form.getFieldsValue();
      this.props.updateTask(
        this.props.task.id,
        name,
        details,
        deadline.format("YYYY-MM-DD"),
        assigned_to,
        note
      );
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    if (!this.props.members) {
      return null;
    }
    return (
      <Fragment>
        <Button type="primary" onClick={this.showModal} id="UpdateTaskBtn">
          Update Task
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          //project={this.props.project}
          task={this.props.task}
          members={this.props.members}
        />
      </Fragment>
    );
  }
}

// export default TaskUpdateModal;

export default connect(
  null,
  { updateTask }
)(TaskUpdateModal);
