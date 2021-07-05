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
		// const prefixSelector = getFieldDecorator('prefix', {
		// 	initialValue: '88',
		// })(
		<Select style={{ width: 70 }}>
			<Option value="88">+88</Option>
		</Select>,
		// );

		if (!this.props.profile) {
			return null;
		}
		return (
			<Fragment>
				<br />
				<Form
					initialValues={{
						Name: this.props.profile.full_name,
						EmployeeID: this.props.profile.username,
						Designation: this.props.profile.dsg,
						DateofBirth: this.props.profile.date_of_birth,
						DateofJoiming: this.props.profile.date_of_joining,
						phone: this.props.profile.phone_number,
						PresentAddress: this.props.profile.present_address,
						HighestDegree: this.props.profile.highest_degree,
						BloodGroup: this.props.profile.blood_group,
						EmergencyContact: this.props.profile.emergency_contact,

					}}
					{...formItemLayout} onFinish={this.handleSubmit}>
					<Form.Item label="Name:" name="Name" className={"formLabel"}>
						<Input readOnly />
					</Form.Item>
					<Form.Item label="Employee ID:" name="EmployeeID" className={"formLabel"}>

						<Input readOnly />

					</Form.Item>
					<Form.Item label="Designation:" name="Designation" className={"formLabel"}>
						<Input readOnly />
					</Form.Item>
					<Form.Item label="Date of Birth:" name="DateofBirth" className={"formLabel"}>
						<Input readOnly />
					</Form.Item>
					<Form.Item label="Date of Joiming:" name="DateofJoiming" className={"formLabel"}>
						<Input readOnly />
					</Form.Item>
					<Form.Item label="Phone Number" name="phone" className={"formLabel"}>
						<Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="Phone Number" />
					</Form.Item>
					<Form.Item label="Present Address:" name="PresentAddress" className={"formLabel"}>
						<Input placeholder="Present Address" />
					</Form.Item>
					<Form.Item label="Highest Degree:" name="HighestDegree" className={"formLabel"}>
						<Input placeholder="Highest Degree" />
					</Form.Item>
					<Form.Item label="Blood Group:" name="BloodGroup" className={"formLabel"}>
						<Input readOnly />
					</Form.Item>

					<Form.Item label="Emergency Contact:" name="EmergencyContact" className={"formLabel"}>
						<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)
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


// const WrappedLogin = Form.create()(ProfileUpdateForm)
export default (ProfileUpdateForm);

