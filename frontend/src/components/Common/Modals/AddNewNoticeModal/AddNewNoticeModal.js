import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, Modal, Button, Input, DatePicker, Checkbox } from "antd";
import { addNewNotice } from "../../../../actions/notice";
import moment from "moment";

const { TextArea } = Input;
const CollectionCreateForm = (
  class extends Component {
    render() {
      let today = new Date();
      const {
        visible,
        onCancel,
        onCreate,
        wrappedComponentRef
      } = this.props;

      return (
        <Fragment>
          <Modal
            visible={visible}
            wrappedComponentRef={wrappedComponentRef}
            title="Add New Notice"
            okText="Create"
            onCancel={onCancel}
            onOk={onCreate}
            width={647}
            destroyOnClose={true}
            maskClosable={false}
          >
            <Form layout="vertical" id="ProjectModalForm" ref={this.props.formRef}>
              <Form.Item name="title" label="Notice Title" rules={[{ required: true, message: "Enter Notice Title!" }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Details" name="body" rules={[{ required: true, message: "Enter Details!" }]}>
                <TextArea
                  placeholder="Details About the Notice"
                  autosize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>

              <Form.Item label="Expires On" name="expires_on" rules={[{ required: true, message: "Enter Expiry Date!" }]}>
                <DatePicker
                  disabledDate={d => !d || d.isBefore(today)}
                  format="DD MMM, YYYY, hh:mm a"
                  showTime={{ defaultValue: moment("11:59 PM", "hh:mm A") }}
                />
              </Form.Item>

              <Form.Item name="important" rules={[{ required: false }]}>
                <center>
                  <Checkbox onChange={this.onChange}>Important</Checkbox>
                </center>
              </Form.Item>
            </Form>
          </Modal>
        </Fragment>
      );
    }
  }
);

class AddNewNoticeModal extends React.Component {
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

  showModal = () => {
    this.setState({ visible: true });
  };
  onChange() {
    const { check } = this.state;
    this.setState({
      check: !check,
      loading: true
    });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  };
  formRef = React.createRef();
  handleCreate = () => {

    const { title, body, expires_on, check } = this.formRef.current.getFieldsValue();
    const { important } = (this.state.check === check);

    this.props.addNewNotice(title, body, expires_on.format(), important);
    this.formRef.current.resetFields();
    this.setState({
      visible: false,
      check: false
    });

  };


  render() {
    return (
      <Fragment>
        <Button type="primary" onClick={this.showModal} id={"addProjectBtn"}>
          Add New Notice
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.formRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          notice={this.props.notice}
          onSubmit={this.onSubmit}
        />
      </Fragment>
    );
  }
}

export default connect(null, { addNewNotice })(AddNewNoticeModal);
