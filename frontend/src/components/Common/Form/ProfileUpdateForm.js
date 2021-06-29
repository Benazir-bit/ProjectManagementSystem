import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './Form.css';


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
  DatePicker,
} from 'antd';

const { Option } = Select;

class ProfileUpdateForm extends Component {
  state = {
    autoCompleteResult: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);        
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 20,
          offset: 10,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '88',
    })(
      <Select style={{ width: 70 }}>
        <Option value="88">+88</Option>
      </Select>,
    );

	if (!this.props.profile) {
      return null;
    }
    return (
		<Fragment>
		<br/>
		  <Form {...formItemLayout} onSubmit={this.handleSubmit}>
		    <Form.Item label="Name:" className={"formLabel"}>
			  {getFieldDecorator('Name', {
				  initialValue: this.props.profile.full_name,
			  })(
				  <Input readOnly/>
			  )}
			</Form.Item>
			<Form.Item label="Employee ID:" className={"formLabel"}>
			  {getFieldDecorator('EmployeeID', {
			    initialValue: 'this.props.profile.username',
				
			  })(
				  <Input readOnly/>
			  )}
			</Form.Item>
			<Form.Item label="Designation:" className={"formLabel"}>
			  {getFieldDecorator('Designation', {
				initialValue: this.props.profile.dsg,
			  })(
			   <Input readOnly />
			  )}
			</Form.Item>
			<Form.Item label="Date of Birth:" className={"formLabel"}>
			  {getFieldDecorator('DateofBirth', {
				initialValue: this.props.profile.date_of_birth,
			  })(
			   <Input readOnly/>
			  )}
			</Form.Item>
			<Form.Item label="Date of Joiming:" className={"formLabel"}>
			  {getFieldDecorator('DateofJoiming', {
	   		    initialValue: this.props.profile.date_of_joining,
			  })(
			   <Input readOnly/>
			  )}
			</Form.Item>
			<Form.Item label="Phone Number" className={"formLabel"}>
			  {getFieldDecorator('phone', {
				  initialValue: this.props.profile.phone_number,
			  })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="Phone Number"/>)}
			</Form.Item>
			<Form.Item label="Present Address:" className={"formLabel"}>
			  {getFieldDecorator('Present Address', {
				initialValue: this.props.profile.present_address,
			  })(
				  <Input placeholder="Present Address"/>
			  )}
			</Form.Item>
			<Form.Item label="Highest Degree:" className={"formLabel"}>
			  {getFieldDecorator('HighestDegree', {
				  initialValue: this.props.profile.highest_degree,
			  })(
				  <Input placeholder="Highest Degree"/>
			  )}
			</Form.Item>
			<Form.Item label="Blood Group:" className={"formLabel"}>
			  {getFieldDecorator('BloodGroup', {
				initialValue: this.props.profile.blood_group,
			  })(
				  <Input readOnly />
			  )}
			</Form.Item>
			
			<Form.Item label="Emergency Contact:" className={"formLabel"}>
			  {getFieldDecorator('EmergencyContact', {
				  initialValue: this.props.profile.emergency_contact,
			  })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
			</Form.Item>
			
			<Form.Item {...tailFormItemLayout}>
			  <Button type="primary" htmlType="submit">
				Update Profile
			  </Button>
			</Form.Item>
		  </Form>
	  </Fragment>
    );
  }
}


const WrappedLogin = Form.create()(ProfileUpdateForm)
export default (WrappedLogin);

