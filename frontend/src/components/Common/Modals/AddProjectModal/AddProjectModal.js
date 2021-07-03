import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, Modal, Button, Input, Select, DatePicker, Spin } from "antd";
import ImageSmall from "../../ImageSmall/ImageSmall";
import { addNewProject } from "../../../../actions/projects";
import "./AddProjectModal.css";

const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;

const CollectionCreateForm = (
  class extends Component {
    render() {
      const SelectOption = Select.Option;
      let today = new Date();
      const {
        visible,
        onCancel,
        onCreate,
        form,
        supervisorChange,
        supervisor
      } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Fragment>
          <Modal
            visible={visible}
            title="Add New Project"
            okText="Create"
            onCancel={onCancel}
            onOk={onCreate}
            destroyOnClose={true}
            maskClosable={false}
          >
            {/* <h5 className="modal-title">
              <b>Group Name:&nbsp;{this.props.group.name}</b>
            </h5> */}

            <Form layout="vertical" id="ProjectModalForm">
              <Form.Item label="Project Name" name="projectName" rules={[{ required: true, message: "Enter Project Name!" }]}>
                <Input placeholder="Enter Project Name" />
              </Form.Item>

              <Form.Item label="Details" name="details" rules={[{ required: true, message: "Enter Project Detail!" }]}>
                <TextArea
                  placeholder="Details About the Project"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              </Form.Item>
              <Form.Item label="Due Date" name="date_picker" rules={[{ required: true, message: "Enter Due Date!" }]}>
                <DatePicker disabledDate={d => !d || d.isBefore(today)} />
              </Form.Item>
              <Form.Item label="Supervisor" name="supervisor" rules={[
                { required: true, message: "Select Project Supervisor!" }
              ]}>
                <Select
                  style={{ width: "100%", height: "36px" }}
                  placeholder="Select Supervisor"
                  onChange={supervisorChange}
                  notFoundContent={
                    !this.props.group ? <Spin size="small" /> : null
                  }
                >
                  {this.props.group && this.props.group.user_set
                    ? this.props.group.user_set.map(member => (
                      <Option key={member.id} value={member.id}>
                        <ImageSmall
                          clsattr={"img-circle"}
                          altname={member.full_name}
                          srcfile={member.image}
                        />
                        &emsp;{member.full_name}
                      </Option>
                    ))
                    : null}
                </Select>
              </Form.Item>

              <Form.Item label="Add Members" name="projMembers" rules={[
                { required: true, message: "Select Project Members!" }
              ]}>
                <Select
                  mode="multiple"
                  size="default"
                  style={{ width: "100%", height: "36px" }}
                  placeholder="Select Members"
                  id="multiSelect"
                >
                  {supervisor && this.props.group && this.props.group.user_set
                    ? this.props.group.user_set.map(member =>
                      member.id == supervisor ? null : (
                        <Option key={member.id} value={member.id}>
                          <ImageSmall
                            clsattr={"img-circle"}
                            altname={member.full_name}
                            srcfile={member.image}
                          />
                          &emsp;{member.full_name}
                        </Option>
                      )
                    )
                    : null}
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

class AddProjectModal extends React.Component {
  state = {
    visible: false,
    supervisor: null
  };

  supervisorChange = value => {
    const { form } = this.formRef.props;

    form.setFieldsValue({
      projMembers: undefined
    });

    this.setState({
      supervisor: value
    });
  };

  showModal = () => {
    this.setState({ visible: true, supervisor: null });
  };

  handleCancel = () => {
    this.setState({ visible: false, supervisor: null });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields(err => {
      if (err) {
        return;
      }

      const {
        projectName,
        details,
        date_picker,
        supervisor,
        projMembers,
        notes
      } = form.getFieldsValue();
      let projMem = [];
      projMem.push(supervisor);
      projMem.push(...projMembers);
      this.props.addNewProject(
        this.props.user,
        this.props.group.id,
        projectName,
        details,
        date_picker.format("YYYY-MM-DD"),
        supervisor,
        projMem,
        notes
      );
      form.resetFields();
      this.setState({ visible: false, supervisor: null });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <Fragment>
        <Button type="primary" onClick={this.showModal} id={"addProjectBtn"}>
          Add New Project
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          supervisorChange={this.supervisorChange}
          supervisor={this.state.supervisor}
          //members={this.props.members}
          // groupDetail={this.props.group}
          group={this.props.group}
          onSubmit={this.onSubmit}
        />
      </Fragment>
    );
  }
}

export default connect(null, { addNewProject })(AddProjectModal);
