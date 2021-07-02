import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, Modal, Button, Input, Select, DatePicker } from "antd";
import ImageSmall from "../../ImageSmall/ImageSmall";
import { addNewTask } from "../../../../actions/task";
import moment from "moment";
import "./AddTaskModal.css";

const { TextArea } = Input;
const { Option } = Select;

const CollectionCreateForm = (
  class extends Component {
    render() {
      let today = new Date();
      const {
        visible,
        onCancel,
        onOk,
        form,
        confirmLoading,
        wrappedComponentRef,
        user_id,
        project_id
      } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Fragment>
          <Modal
            title={`Add New Task to ${this.props.project_id.name}`}
            visible={visible}
            onOk={onOk}
            wrappedComponentRef={wrappedComponentRef}
            confirmLoading={confirmLoading}
            okText="Add Task"
            onCancel={onCancel}
            destroyOnClose={true}
            maskClosable={false}
          >
            <h5 className="modal-title">
              Project Name: <b>{this.props.project_id.name}</b>
            </h5>

            <Form layout="vertical" id="AddTaskModalForm">
              <Form.Item label="Task Name">
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "Enter Task Name!" }]
                })(<Input placeholder="Enter Task Name" />)}
              </Form.Item>

              <Form.Item label="Details">
                {getFieldDecorator("details")(
                  <TextArea
                    placeholder="Details About the Task"
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />
                )}
              </Form.Item>

              <Form.Item label="Due Date">
                {getFieldDecorator("due_date", {
                  rules: [{ required: true, message: "Enter Due Date!" }]
                })(
                  <DatePicker
                    disabledDate={d =>
                      !d ||
                      d.isBefore(today) ||
                      d.isAfter(
                        moment(
                          this.props.project_id.due_date,
                          "YYYY-MM-DD"
                        ).add(1, "days")
                      )
                    }
                  />
                )}
              </Form.Item>

              <Form.Item label="Assigned To">
                {getFieldDecorator("assigned_to", {
                  rules: [
                    { required: true, message: "Select Owner of the Task" }
                  ]
                })(
                  <Select
                    style={{ width: "100%", height: "36px" }}
                    placeholder="Select Task Owner"
                  >
                    {project_id.project_members.map(member => (
                      <Option key={member.id} value={member.id}>
                        <ImageSmall
                          clsattr={"img-circle"}
                          altname={member.full_name}
                          srcfile={member.image}
                        />
                        &emsp;{member.full_name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="Notes">
                {getFieldDecorator("notes")(
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

class AddTaskModal extends React.Component {
  state = {
    visible: false,
    confirmLoading: false
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
        name,
        details,
        due_date,
        assigned_to,
        notes
      } = form.getFieldsValue();

      this.props.addNewTask(
        this.props.project.id,
        name,
        details,
        due_date.format("YYYY-MM-DD"),
        assigned_to,
        notes
      );
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  render() {
    return (
      <Fragment>
        <Button type="primary" onClick={this.showModal} id="ModalToggleButton">
          Add New Task
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onOk={this.handleCreate}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          members={this.props.members}
          project_id={this.props.project}
          user_id={this.props.user}
          onSubmit={this.onSubmit}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { addNewTask })(AddTaskModal);
