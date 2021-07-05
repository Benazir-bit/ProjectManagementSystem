import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getTypeMembers } from "../../../../actions/member";
import { updateProject } from "../../../../actions/projects";
import moment from "moment";
import { Form, Modal, Button, Input, Select, DatePicker } from "antd";
import ImageSmall from "../../ImageSmall/ImageSmall";
import "./ProjectUpdateModal.css";

const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;

const CollectionCreateForm = (
  class extends Component {
    render() {
      const { project } = this.props;
      let today = new Date();
      const { visible, onCancel, onCreate, form } = this.props;

      // const projMembers = this.props.members.map(member => {
      //   if (project.members.includes(member.id)) {
      //     return member
      //   }
      // });
      return (
        <Fragment>
          <Modal
            visible={visible}
            title="Update Project"
            okText="Update"
            onCancel={onCancel}
            onOk={onCreate}
            maskClosable={false}
            destroyOnClose={true}
          >
            <Form layout="vertical" id="ProjectModalForm" ref={this.props.formRef}
              initialValues={{
                name: project.name,
                details: project.details,
                due_date: moment(project.due_date, "YYYY-MM-DD"),
                supervisor: project.supervisor,
                projMembers: project.members,
                notes: project.note
              }}>
              <Form.Item label="Project Name" name="name" rules={[{ required: true, message: "Enter Project Name!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Details" name="details">
                <TextArea
                  placeholder="Details About the Project"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              </Form.Item>
              <Form.Item label="Due Date" name="due_date" rules={[{ required: true, message: "Enter Due Date!" }]}>
                <DatePicker disabledDate={d => !d || d.isBefore(today)} />
              </Form.Item>

              <Form.Item label="Supervisor" name="supervisor" rules={[
                { required: true, message: "Select Project Supervisor!" }
              ]}>
                <Select
                  style={{ width: "100%", height: "36px" }}
                  placeholder="Select Supervisor"
                >
                  {this.props.members.map(member => (
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


              <Form.Item label="Members" name="projMembers" rules={[
                { required: true, message: "Select Project Members!" }
              ]}>
                <Select
                  style={{ width: "100%", height: "36px" }}
                  mode="multiple"
                  size="default"
                  placeholder="Select Supervisor"
                // removeIcon
                >
                  {this.props.members.map(member => (
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

class ProjectUpdateModal extends React.Component {
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
      due_date,
      supervisor,
      projMembers,
      notes
    } = this.formRef.current.getFieldsValue();
    let projMem = [];
    projMem.push(supervisor);
    projMem.push(...projMembers);
    this.props.updateProject(
      this.props.project.id,
      name,
      details,
      due_date.format("YYYY-MM-DD"),
      supervisor,
      projMem,
      notes
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
        <Button type="primary" onClick={this.showModal} id="UpdateProjectBtn">
          Update Project
        </Button>
        <CollectionCreateForm
          formRef={this.formRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          project={this.props.project}
          members={this.props.members}
        />
      </Fragment>
    );
  }
}

export default connect(null, { updateProject })(ProjectUpdateModal);
