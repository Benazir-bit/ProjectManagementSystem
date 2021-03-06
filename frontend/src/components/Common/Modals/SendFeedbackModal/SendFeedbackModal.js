import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { sendfeedback, submitCancelTask } from "../../../../actions/task";
import { Form, Modal, Button, Divider } from "antd";
import "./SendFeedbackModal.css";
import TextEditor from "../../TextEditor/TextEditor";
import { Typography } from "antd";
const { Title } = Typography;

class SendFeedbackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      check: false,
      loading: false,
      visible: false
    };
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

  showModal = () => {
    this.setState({ visible: true });
  };

  onCancel = () => {
    this.setState({ visible: false });
  };
  formRef = React.createRef();
  handleSubmit = e => {
    this.props.sendfeedback(
      this.props.task.id,
      this.state.value,
      this.props.task.supervisor.id
    );
    const body = {
      id: this.props.task.id,
      submitted: false,
      paused: true
    };
    this.props.submitCancelTask(body);
    this.formRef.current.resetFields();
    this.setState({ visible: false });
  };



  render() {
    return (
      <Fragment>
        <Button onClick={this.showModal} id="FeedBackBtn">
          Send Feedback
        </Button>

        <Modal
          visible={this.state.visible}
          maskClosable={false}
          width={650}
          title="Feedback"
          onCancel={this.onCancel}
          destroyOnClose={true}
          className={"sendFeedbackModal"}
          footer={[null, null]}
        >
          <h5 className="modal-title">
            Task Name:&nbsp;<b>{this.props.task.name}</b>
          </h5>
          <h5 className="modal-title">
            Employee:&nbsp;<b>{this.props.task.owner.full_name}</b>
          </h5>
          <br />

          <Form
            onFinish={this.handleSubmit}
            layout="vertical"
            id="FeedBackModalForm"
            ref={this.formRef}
          >
            <Title level={4}>Give Feedback (Max Length : 150)</Title>
            <TextEditor
              style={{ backgroundColor: "#ffffff" }}
              ref={this.getTextEditor}
              setParentState={this.setValue}
            />
            <Divider />
            <Form.Item style={{ float: "right" }}>
              <Button key="cancel" onClick={this.onCancel}>
                Cancel
              </Button>
              &emsp;
              <Button
                style={{ marginBottom: 10 }}
                key="submit"
                htmlType="submit"
                type="primary"
                onClick={this.onCreate}
              >
                Send Feedback
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

// const WrappedRaiseIssueModal = Form.create()(SendFeedbackModal);
const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { sendfeedback, submitCancelTask }
)(SendFeedbackModal);
