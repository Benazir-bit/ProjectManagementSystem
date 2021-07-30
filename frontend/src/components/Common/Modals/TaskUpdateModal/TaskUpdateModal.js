import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { updateTask } from "../../../../actions/task";
import moment from "moment";
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Modal, Button, Input, Select, DatePicker, InputNumber } from "antd";
import ImageSmall from "../../ImageSmall/ImageSmall";
import "./TaskUpdateModal.css";

const { TextArea } = Input;
const { Option } = Select;

const CollectionCreateForm = (
  class extends Component {
    render() {
      const { task } = this.props;
      let today = new Date();
      const { visible, onCancel, onCreate } = this.props;


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
            <Form layout="vertical" id="TaskUpdateForm" ref={this.props.formRef}
              initialValues={{
                name: task.name,
                details: task.details,
                deadline: moment(task.deadline, "YYYY-MM-DD"),
                assigned_to: task.owner.id,
                note: task.note,
                wbs_number: task.wbs_number,
                prerequisite: task.prerequisite,
                optimistic_time: task.optimistic_time,
                most_likely_time: task.most_likely_time,
                pessimistic_time: task.pessimistic_time

              }}>
              <Form.Item label="Task Name" name="name" rules={[{ required: true, message: "Enter Task Name!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="WBS Number" name="wbs_number" rules={[{ required: true, message: "Enter WBS Number!" }]}>
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

              {/* <Form.Item label="Due Date" name="deadline" rules={[{ required: false, message: "Enter Due Date!" }]}>

                <DatePicker disabledDate={d => !d || d.isBefore(today)} />
              </Form.Item> */}
              <Form.Item label="Task Owner" name="assigned_to" rules={[{ required: true, message: "Select Task Owner!" }]}>
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
              </Form.Item>
              <Form.Item label="Notes" name="note">
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
  formRef = React.createRef();
  handleCreate = () => {

    const {
      name,
      details,
      // deadline,
      assigned_to,
      note,
      prerequisite,
      wbs_number,
      optimistic_time,
      most_likely_time,
      pessimistic_time
    } = this.formRef.current.getFieldsValue();

    this.props.updateTask(
      this.props.task.id,
      name,
      details,
      // deadline ? deadline.format("YYYY-MM-DD") : deadline,
      assigned_to,
      note,
      prerequisite,
      wbs_number,
      optimistic_time,
      most_likely_time,
      pessimistic_time
    );
    this.formRef.current.resetFields();
    this.setState({ visible: false });
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
          formRef={this.formRef}
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
