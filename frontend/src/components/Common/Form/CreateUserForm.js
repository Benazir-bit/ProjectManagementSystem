import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import "./Form.css";
import { createUser } from "../../../actions/profile";
import { getAllDesignations } from "../../../actions/HR";
import { getGroupListAll } from "../../../actions/group";
import { getTypeMembers } from "../../../actions/member";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  DatePicker
} from "antd";

const { Option } = Select;

class CreateUserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true
    };
  }
  // selectChangeReportsTo = value => {
  //   console.log(value);
  // };
  selectChange = value => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      reportsto: "",
      Designation: ""
    });
    this.props.getTypeMembers("group", value);
    this.props.getAllDesignations(value);
    this.setState({
      disabled: false
    });
  };

  componentDidMount() {
    this.props.getGroupListAll();
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const body = {
          username: values.EmployeeID,
          reports_to: values.reportsto,
          email: values.Email,
          first_name: values.FirstName,
          last_name: values.LastName,
          blood_group: values.BloodGroup,
          dsg: values.Designation,
          emergency_contact: values.EmergencyContact,
          group: values.Group,
          highest_degree: values.HighestDegree,
          present_address: values.PresentAddress,
          phone_number: values.phone,
          date_of_birth: values["DateofBirth"].format("YYYY-MM-DD"),
          date_of_joining: values["DateofJoining"].format("YYYY-MM-DD")
        };
        console.log(body, "usercreateeeeeeeeeeeeeeeeeeee");
        this.props.createUser(body);
        this.props.form.resetFields();
      }
    });
  };

  render() {
    if (!this.props.groups) {
      return null;
    }

    const { form, designations } = this.props;

    const group = [];
    this.props.groups.map((grp, i) => {
      group.push(
        <Option key={i} value={grp.id}>
          {grp.name}
        </Option>
      );
    });
    let designation = [];

    if (designations) {
      designations.map((title, i) => {
        designation.push(
          <Option key={i} value={title.id}>
            {title.title_name}
          </Option>
        );
      });
    }
    const reports_to = [];
    if (this.props.members) {
      this.props.members.map((mem, i) => {
        reports_to.push(
          <Option key={i} value={mem.profile.user}>
            <ImageSmall
              clsattr={"img-circle"}
              altname={mem.profile.full_name}
              srcfile={mem.profile.image}
            />
            &emsp;{mem.profile.full_name}
            {/* <Input value={d.id} hidden /> */}
          </Option>
        );
      });
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 20,
          offset: 10
        }
      }
    };
    // const prefixSelector = getFieldDecorator('prefix', {
    //   initialValue: '88',
    // })(
    //   <Select style={{ width: 70 }}>
    //     <Option value="88">+88</Option>
    //   </Select>,
    // );

    const config = {
      rules: [
        { type: "object", required: true, message: "Please select Date!" }
      ]
    };
    return (
      <Fragment>
        <br />
        <Form
          initialValues={{

          }}
          {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item name="EmployeeID" label="Employee ID:" className={"formLabel"} rules={[{ required: true, message: "Please input Employee ID!" }]}>
            <Input placeholder="Employee ID" />
          </Form.Item>

          <Form.Item name="FirstName" label="First Name" className={"formLabel"} rules={[
            { required: true, message: "Please input the First Name!" }
          ]}>
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item name="LastName" label="Full Name:" className={"formLabel"} rules={[
            { required: true, message: "Please input the Last Name!" }
          ]}>
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item name="Email" label="Email:" className={"formLabel"} rules={[
            {
              type: "email",
              message: "The input is not valid Email!"
            },
            {
              required: true,
              message: "Please input your Email!"
            }
          ]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Group" name="Group" className={"formLabel"} rules={[{ required: true, message: "Please select your Group!" }]}>

            <Select onChange={this.selectChange} placeholder="Select Group">
              {group}
            </Select>

          </Form.Item>
          <Form.Item label="Reports To" name="reportsto" className={"formLabel"} rules={[
            {
              required:
                !this.props.members || this.props.members.length == 0
                  ? false
                  : true,
              message: "Please select your Reports To!"
            }
          ]}>
            <Select
              disabled={this.state.disabled}
              onChange={this.selectChangeReportsTo}
              placeholder="Select Reports to"
            >
              {reports_to}
            </Select>
          </Form.Item>

          <Form.Item name="Designation" label="Designation:" className={"formLabel"} rules={[
            {
              required: designation.length == 0 ? false : true,
              message: "Please input Designation!"
            }
          ]}>
            <Select
              disabled={this.state.disabled}
              placeholder="Select Designation"
            >
              {designation}
            </Select>
          </Form.Item>

          <Form.Item name="phone" label="Phone Number" className={"formLabel"} rules={[
            {
              required: true,
              message: "Please input your phone number!"
            },
            {
              max: 11,
              min: 11,
              message: "Enter 11 Digit Number!"
            }
          ]}>

            <Input
              type="number"
              style={{ width: "100%" }}
              placeholder="Phone Number"
            />
          </Form.Item>
          <Form.Item label="Present Address:" name="PresentAddress" className={"formLabel"} rules={[
            { required: true, message: "Please input Present Address!" }
          ]}>
            <Input placeholder="Present Address" />
          </Form.Item>
          <Form.Item label="Date of Birth:" name="DateofBirth" className={"formLabel"}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="DateofJoining" label="Date of Joining:" className={"formLabel"}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="HighestDegree" label="Highest Degree:" className={"formLabel"} rules={[
            { required: true, message: "Please input Highest Degree!" }
          ]}>
            <Input placeholder="Highest Degree" />
          </Form.Item>
          <Form.Item name="BloodGroup" label="Blood Group:" className={"formLabel"} rules={[{ required: true, message: "Please input Blood Group!" }]}>
            <Input placeholder="Blood Group" />
          </Form.Item>

          <Form.Item name="EmergencyContact" label="Emergency Contact:" className={"formLabel"} rules={[
            {
              required: true,
              message: "Please input your Emergency Contact!"
            },
            {
              max: 11,
              min: 11,
              message: "Enter 11 Digit Number!"
            }
          ]}>

            <Input
              type="number"
              placeholder={"Emergency Contact"}
              style={{ width: "100%" }}
            />
            {/* addonBefore={prefixSelector}  */}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  designations: state.HR.designations,
  groups: state.group.allgroup,
  members: state.member.members
});

// const WrappedLogin = Form.create()(CreateUserForm);
export default connect(mapStateToProps, {
  createUser,
  getAllDesignations,
  getGroupListAll,
  getTypeMembers
})(CreateUserForm);
