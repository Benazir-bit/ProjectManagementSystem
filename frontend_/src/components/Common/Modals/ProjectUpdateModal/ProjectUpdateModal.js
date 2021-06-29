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

const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  class extends Component {
    render() {
      const { project } = this.props;
      let today = new Date();
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

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
            <Form layout="vertical" id="ProjectModalForm">
              <Form.Item label="Project Name">
                {getFieldDecorator("name", {
                  initialValue: project.name,
                  rules: [{ required: true, message: "Enter Project Name!" }]
                })(<Input />)}
              </Form.Item>

              <Form.Item label="Details">
                {getFieldDecorator("details", {
                  initialValue: project.details
                })(
                  <TextArea
                    placeholder="Details About the Project"
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />
                )}
              </Form.Item>

              <Form.Item label="Due Date">
                {getFieldDecorator("due_date", {
                  initialValue: moment(project.due_date, "YYYY-MM-DD"),
                  rules: [{ required: true, message: "Enter Due Date!" }]
                })(<DatePicker disabledDate={d => !d || d.isBefore(today)} />)}
              </Form.Item>

              <Form.Item label="Supervisor">
                {getFieldDecorator("supervisor", {
                  initialValue: project.supervisor,
                  rules: [
                    { required: true, message: "Select Project Supervisor!" }
                  ]
                })(
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
                )}
              </Form.Item>

              <Form.Item label="Members">
                {getFieldDecorator("projMembers", {
                  initialValue: project.members,
                  rules: [
                    { required: true, message: "Select Project Members!" }
                  ]
                })(
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
                )}
              </Form.Item>

              <Form.Item label="Notes">
                {getFieldDecorator("notes", { initialValue: project.note })(
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
        due_date,
        supervisor,
        projMembers,
        notes
      } = form.getFieldsValue();
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
        <Button type="primary" onClick={this.showModal} id="UpdateProjectBtn">
          Update Project
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
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
