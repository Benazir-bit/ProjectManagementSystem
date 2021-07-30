import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, Modal, Button, Input, Select, DatePicker, InputNumber } from "antd";
import ImageSmall from "../../ImageSmall/ImageSmall";
import { addNewTask } from "../../../../actions/task";
import { InfoCircleOutlined } from '@ant-design/icons';
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
        confirmLoading,
        wrappedComponentRef,
        project_id
      } = this.props;

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

            <Form layout="vertical" id="AddTaskModalForm" ref={this.props.formRef}>
              <Form.Item label="Task Name" name="name" rules={[{ required: true, message: "Enter Task Name!" }]}>
                <Input placeholder="Enter Task Name" />
              </Form.Item>
              <Form.Item label="WBS Number" name="wbs_number" rules={[{ required: true, message: "Enter WBS Number!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Prerequisitte WBS Number" name="prerequisite" rules={[{ required: false, message: "Enter Prerequisitte WBS Number!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Optimistic Time"
                tooltip={{
                  title: 'Represents the shortest estimated time period within which a task is likely to be completed',
                  icon: <InfoCircleOutlined />,
                }}
                name="optimistic_time" rules={[{ required: true, message: "Enter Optimistic Time!" }]}>
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item label="Most Likely Time"
                tooltip={{
                  title: 'The best or most reasonable estimate of how long it should take to complete a task',
                  icon: <InfoCircleOutlined />,
                }}
                name="most_likely_time" rules={[{ required: true, message: "Enter Most Likely Time!" }]}>
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item label="Pessimistic Time" tooltip={{
                title: 'Represents the longest estimated time period within which a task is likely to be completed',
                icon: <InfoCircleOutlined />,
              }}
                name="pessimistic_time" rules={[{ required: true, message: "Enter Pessimistic Time!" }]}>
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item label="Details" name="details">
                <TextArea
                  placeholder="Details About the Task"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              </Form.Item>

              {/* <Form.Item label="Due Date" name="due_date" rules={[{ required: false, message: "Enter Due Date!" }]}>
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
              </Form.Item> */}


              <Form.Item label="Assigned To" name="assigned_to" rules={[
                { required: true, message: "Select Owner of the Task" }
              ]}>
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
              </Form.Item>

              <Form.Item label="Notes" name="notes">
                <TextArea
                  placeholder="Notes"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
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
  formRef = React.createRef();
  handleCreate = () => {
    const {
      name,
      details,
      // due_date,
      assigned_to,
      notes,
      prerequisite,
      wbs_number,
      optimistic_time,
      most_likely_time,
      pessimistic_time
    } = this.formRef.current.getFieldsValue();

    this.props.addNewTask(
      this.props.project.id,
      name,
      details,
      // due_date ? due_date.format("YYYY-MM-DD") : due_date,
      assigned_to,
      notes,
      prerequisite,
      wbs_number,
      optimistic_time,
      most_likely_time,
      pessimistic_time
    );
    this.formRef.current.resetFields();
    this.setState({ visible: false });

  };

  // saveFormRef = formRef => {
  //   this.formRef = formRef;
  // };
  render() {
    return (
      <Fragment>
        <Button type="primary" onClick={this.showModal} id="ModalToggleButton">
          Add New Task
        </Button>
        <CollectionCreateForm
          formRef={this.formRef}
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
