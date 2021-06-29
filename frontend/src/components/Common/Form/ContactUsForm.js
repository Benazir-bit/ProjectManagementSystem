import React, { Component, Fragment } from "react";
import { Input, Form, Button } from "antd";
import "./Form.css";

const { TextArea } = Input;

function validate(textFormField) {
  // true means invalid, so our conditions got reversed
  return {
    textFormField: textFormField.length === 0
  };
}

class ContactUsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textFormField: ""
    };
  }

  handletextFormFieldChange = evt => {
    this.setState({ textFormField: evt.target.value });
  };
  render() {
    const errors = validate(this.state.textFormField);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    let button;

    if (isDisabled) {
      button = (
        <Button
          type="primary"
          href="#"
          style={{ backgroundColor: "#eee" }}
          htmlType="submit"
          disabled
        >
          Send
        </Button>
      );
    } else {
      button = (
        <Button
          type="primary"
          href="#"
          style={{ backgroundColor: "#337ab7" }}
          htmlType="submit"
        >
          Send
        </Button>
      );
    }
    return (
      <Fragment>
        <Form.Item>
          <Input
            value={this.props.UserName}
            style={{
              resize: "hidden",
              overflow: "none"
            }}
            readOnly
          />
        </Form.Item>
        <Form.Item style={{ marginTop: "-18px" }}>
          <Input
            value={this.props.Email}
            style={{
              resize: "hidden",
              overflow: "none"
            }}
            readOnly
          />
        </Form.Item>
        <Form.Item style={{ marginTop: "-14px" }}>
          <TextArea
            rows="15"
            placeholder="Write your feedback or suggestions here.."
            required
            style={{
              overflow: "hidden",
              resize: "none"
            }}
            value={this.state.textFormField}
            onChange={evt => {
              this.handletextFormFieldChange(evt);
            }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 9 }}>{button}</Form.Item>
      </Fragment>
    );
  }
}
export default ContactUsForm;
