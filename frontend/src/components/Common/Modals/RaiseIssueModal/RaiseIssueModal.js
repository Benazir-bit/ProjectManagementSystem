import React, { Component, Fragment } from "react";
import { Form, Modal, Button, Input, Divider, Checkbox } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { raiseIssue } from "../../../../actions/issues";
import { updateTaskNew } from "../../../../actions/task";
import "./RaiseIssueModal.css";
import TextEditor from "../../TextEditor/TextEditor";

class RaiseIssueModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      check: false,
      loading: false,
      visible: false
    };
    this.onChange = this.onChange.bind(this);
    this.getTextEditor = React.createRef();
  }

  onCreate = () => {
    this.getTextEditor.current.getValues();
  };

  setValue = value => {
    this.setState({
      value: value
    });
  };
  onChange() {
    const { check } = this.state;
    this.setState({
      check: !check,
      loading: true
    });
  }
  formRef = React.createRef();

  handleSubmit = values => {
    var currentDate = new Date();
    this.props.raiseIssue(
      this.props.task.id,
      values.name,
      this.state.value,
      this.props.task.owner.id,
      this.state.check
    );
    if (this.state.check) {
      const body = {
        id: this.props.task.id,
        paused: this.state.check,
        resumed: false,
        paused_date: moment(currentDate).format("YYYY-MM-DD")
      };

      this.props.updateTaskNew(body);
    }
    this.formRef.current.resetFields();
    this.setState({ visible: false, check: false });

  };

  showModal = () => {
    this.setState({ visible: true });
  };

  onCancel = () => {
    this.setState({ visible: false });
  };
  render() {
    //    const { form } = this.props;
    // const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        <Button onClick={this.showModal} id="RaiseIssueButton">
          Raise Issue
        </Button>
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          width={647}
          title="Issue"
          onCancel={this.onCancel}
          destroyOnClose={true}
          className={"raiseIssueModal"}
          footer={[null, null]}
        >
          <h5 className="modal-title">
            <b>Task Name: {this.props.task.name}</b>
          </h5>
          <h5 className="modal-title">
            <b>Employee: {this.props.task.owner.full_name}</b>
          </h5>
          <br />

          <Form
            onFinish={this.handleSubmit}
            layout="vertical"
            id="IssueModalForm"
            ref={this.formRef}
          >
            <Form.Item label="Issue Name (Max Length : 50)" name="name" rules={[{ required: true, message: "Enter Issue Name!" }]}>
              <Input type="text" name="name" />
            </Form.Item>
            <Form.Item label="Details" name="details">
              {/* <textarea /> */}
              <TextEditor
                style={{ backgroundColor: "#ffffff" }}
                ref={this.getTextEditor}
                setParentState={this.setValue}
              />
            </Form.Item>
            <Form.Item name="paused"
              rules={[{ required: false }]}>
              <center>
                <Checkbox onChange={this.onChange}>Task Paused</Checkbox>
              </center>
            </Form.Item>
            <Divider />
            <Form.Item style={{ float: "right" }}>
              <Button key="cancel" onClick={this.onCancel}>
                Cancel
              </Button>
              &emsp;
              <Button
                key="submit"
                htmlType="submit"
                type="danger"
                onClick={this.onCreate}
              >
                Raise Issue
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

//export default RaiseIssueModal;
// const WrappedRaiseIssueModal = Form.create()(RaiseIssueModal);
// export default WrappedRaiseIssueModal;

const mapStateToProps = state => ({
  user: state.auth.user,
  task: state.tasks.task
});

export default connect(
  mapStateToProps,

  { raiseIssue, updateTaskNew }
)(RaiseIssueModal);
