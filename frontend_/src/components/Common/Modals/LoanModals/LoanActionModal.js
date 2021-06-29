import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Form,
  Modal,
  Button,
  Input,
  InputNumber,
  Select,
  DatePicker
} from "antd";
import ImageSmall from "../../ImageSmall/ImageSmall";
import { updateLoanRequest } from "../../../../actions/accounts";
import moment from "moment";
// import "./AddTaskModal.css";

const { TextArea } = Input;
const { Option } = Select;

const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  class extends Component {
    render() {
      const {
        visible,
        onCancel,
        onOk,
        form,
        confirmLoading,
        wrappedComponentRef
      } = this.props;
      const { getFieldDecorator } = form;
      console.log(this.props.for, this.props.type);
      return (
        <Fragment>
          <Modal
            title={
              this.props.for == "loan_request"
                ? `${this.props.type} Loan Request?`
                : `${this.props.type} Loan Adjustment Request`
            }
            visible={visible}
            onOk={onOk}
            wrappedComponentRef={wrappedComponentRef}
            confirmLoading={confirmLoading}
            okText={
              this.props.type === "Accept" ? "Forward to F&A" : "Reject Request"
            }
            okButtonProps={
              this.props.type === "Accept"
                ? { type: "primary" }
                : { type: "danger" }
            }
            onCancel={onCancel}
            destroyOnClose={true}
            maskClosable={false}
          >
            {this.props.for === "loan_request" ? (
              <Form layout="vertical" id="AddTaskModalForm">
                <Form.Item
                  label={`Remarks for ${
                    this.props.type === "Accept"
                      ? "Finace & Accounts"
                      : "Employee"
                  }`}
                >
                  {getFieldDecorator("remarks", {
                    rules: [
                      {
                        required: true,
                        message: "Please Enter Your Action Remarks"
                      }
                    ]
                  })(
                    <TextArea
                      placeholder="Enter Your Remarks Here"
                      autosize={{ minRows: 2, maxRows: 6 }}
                    />
                  )}
                </Form.Item>
              </Form>
            ) : (
              <p>
                Are you sure you want to <b>{this.props.type}</b> this loan
                adjustment request?
              </p>
            )}
          </Modal>
        </Fragment>
      );
    }
  }
);

class LoanActionModal extends React.Component {
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

      const { remarks } = form.getFieldsValue();
      let body;
      if (this.props.type == "Accept" && this.props.for == "loan_request") {
        body = JSON.stringify({
          id: this.props.id,
          hr_approval_remarks: remarks,
          hr_approved: true
        });
      } else if (
        this.props.type == "Reject" &&
        this.props.for == "loan_request"
      ) {
        body = JSON.stringify({
          id: this.props.id,
          hr_rejection_remarks: remarks,
          rejected: true
        });
      } else if (
        this.props.type == "Accept" &&
        this.props.for == "loan_adjustment"
      ) {
        body = JSON.stringify({
          id: this.props.id,
          adjustment_hr_approved: true
        });
      } else if (
        this.props.type == "Reject" &&
        this.props.for === "loan_adjustment"
      ) {
        body = JSON.stringify({
          id: this.props.id,
          adjustment_rejected: true
        });
      }
      this.props.updateLoanRequest(body);
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    let btntype;
    if (this.props.type === "Accept") {
      btntype = "primary";
    } else {
      btntype = "danger";
    }
    return (
      <Fragment>
        <Button type={btntype} onClick={this.showModal}>
          {this.props.type}
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onOk={this.handleCreate}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          onSubmit={this.onSubmit}
          type={this.props.type}
          for={this.props.for}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { updateLoanRequest })(LoanActionModal);
