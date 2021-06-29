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
import { newLoanRequest } from "../../../../actions/accounts";
import moment from "moment";
// import "./AddTaskModal.css";

const { TextArea } = Input;
const { Option } = Select;

const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  class extends Component {
    render() {
      let today = new Date();
      const {
        visible,
        onCancel,
        onOk,
        form,
        confirmLoading,
        wrappedComponentRef
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Fragment>
          <Modal
            title={"Add New Loan Request"}
            visible={visible}
            onOk={onOk}
            wrappedComponentRef={wrappedComponentRef}
            confirmLoading={confirmLoading}
            okText="Add Request"
            onCancel={onCancel}
            destroyOnClose={true}
            maskClosable={false}
          >
            <Form layout="vertical" id="AddTaskModalForm">
              <Form.Item label="Requested Amount (BDT)">
                {getFieldDecorator("amount", {
                  rules: [
                    {
                      required: true,
                      message: "Enter Requested Amount"
                    }
                  ]
                })(
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={value =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={value => value.replace(/\$\s?|(,*)/g, "")}
                    min={0}
                  />
                )}
              </Form.Item>

              <Form.Item label="Purpose">
                {getFieldDecorator("purpose", {
                  rules: [
                    {
                      required: true,
                      message: "Enter Purpose of The Loan"
                    }
                  ]
                })(
                  <TextArea
                    placeholder="Enter Purpose of The Loan"
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />
                )}
              </Form.Item>
              <Form.Item label="Expected Date">
                {getFieldDecorator("needed_by", {
                  rules: [
                    {
                      required: true,
                      message: "Enter Date of Loan Needed Expected"
                    }
                  ]
                })(
                  <DatePicker
                    placeholder="Enter the expected date of Loan"
                    disabledDate={d => !d || d.isBefore(today)}
                  />
                )}
              </Form.Item>

              <Form.Item label="EMI (in Month)">
                {getFieldDecorator("emi_month", {
                  rules: [{ required: true, message: "Enter EMI in Month" }]
                })(
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={value =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={value => value.replace(/\$\s?|(,*)/g, "")}
                    min={1}
                    max={36}
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

class NewLoanModal extends React.Component {
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

      const { amount, purpose, needed_by, emi_month } = form.getFieldsValue();
      this.props.newLoanRequest(
        amount,
        purpose,
        needed_by.format("YYYY-MM-DD"),
        emi_month
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
          Request for Loan
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onOk={this.handleCreate}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          onSubmit={this.onSubmit}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { newLoanRequest })(NewLoanModal);
