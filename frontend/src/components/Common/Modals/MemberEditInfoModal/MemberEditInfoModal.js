import React, { Fragment } from "react";
import { connect } from "react-redux";
import "./MemberEditInfoModal.css";
import {
  Form,
  Modal,
  // Button,
  Input,
  Select,
  Row,
  Col,
  Spin,
  DatePicker
} from "antd";
import {
  getUserProfile,
  updateProfile,
  updateUser
} from "../../../../actions/profile";
import { getAllDesignations } from "../../../../actions/HR";
import { getGroupListAll } from "../../../../actions/group";
import { searchData } from "../../../../actions/search";
// import { getTypeMembers } from "../../../../actions/member";
import ImageSmall from "../../ImageSmall/ImageSmall";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";
const { Option } = Select;

class MemberEditInfoModal extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
    fetching: false,
    data: [],
    defdsg: "",
    dsg: "",
    reportsto: "",
    defreportsto: "",
    value: [],
    DB: "",
    DJ: ""
  };
  componentDidMount() {
    this.props.onRef(this);
  }

  onChangeDB = (value, dateString) => {
    this.setState({
      DB: dateString
    });
  };
  onChangeDJ = (value, dateString) => {
    this.setState({
      DJ: dateString
    });
  };
  showModal(id) {
    this.props.getUserProfile(id);
    this.setState({
      visible: true,
      data: [],
      dsg: "",
      defdsg: "",
      reportsto: "",
      defreportsto: "",
      value: [],
      DB: "",
      DJ: ""
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      data: [],
      dsg: "",
      defdsg: "",
      reportsto: "",
      defreportsto: "",
      value: [],
      DB: "",
      DJ: ""
    });
  };
  onSearch = value => {
    this.setState({
      fetching: true
    });
    if (value.length > 1) {
      this.props.searchData(value, "accounts", "user", "all");
    }
  };

  handleCreate = () => {
    const { form } = this.props;

    form.validateFields(err => {
      if (this.state.value.length === 0) {
        document
          .getElementsByClassName("groupSelect")[0]
          .getElementsByClassName("ant-form-item-control-wrapper")[0]
          .getElementsByClassName("ant-form-item-control")[0].className +=
          " has-error";
        // var node = document.createElement("div");
        // node.classList.add("ant-form-explain");
        // var textnode = document.createTextNode("Plese Intert Group!");
        // node.appendChild(textnode);
        // document
        //   .getElementsByClassName("groupSelect")[0]
        //   .getElementsByClassName("ant-form-item-control-wrapper")[0]
        //   .getElementsByClassName("ant-form-item-control")[0]
        //   .appendChild(node);
      } else {
        document
          .getElementsByClassName("groupSelect")[0]
          .getElementsByClassName("ant-form-item-control-wrapper")[0]
          .getElementsByClassName("ant-form-item-control")[0].className =
          "ant-form-item-control";
      }
      if (!this.state.defdsg) {
        document
          .getElementsByClassName("designationSelect")[0]
          .getElementsByClassName("ant-form-item-control-wrapper")[0]
          .getElementsByClassName("ant-form-item-control")[0].className +=
          " has-error";
      } else {
        document
          .getElementsByClassName("designationSelect")[0]
          .getElementsByClassName("ant-form-item-control-wrapper")[0]
          .getElementsByClassName("ant-form-item-control")[0].className =
          "ant-form-item-control";
      }
      if (!this.state.DB) {
        document
          .getElementsByClassName("birthSelect")[0]
          .getElementsByClassName("ant-form-item-control-wrapper")[0]
          .getElementsByClassName("ant-form-item-control")[0].className +=
          " has-error";
      } else {
        document
          .getElementsByClassName("birthSelect")[0]
          .getElementsByClassName("ant-form-item-control-wrapper")[0]
          .getElementsByClassName("ant-form-item-control")[0].className =
          "ant-form-item-control";
      }
      if (!this.state.DJ) {
        document
          .getElementsByClassName("joinSelect")[0]
          .getElementsByClassName("ant-form-item-control-wrapper")[0]
          .getElementsByClassName("ant-form-item-control")[0].className +=
          " has-error";
      } else {
        document
          .getElementsByClassName("joinSelect")[0]
          .getElementsByClassName("ant-form-item-control-wrapper")[0]
          .getElementsByClassName("ant-form-item-control")[0].className =
          "ant-form-item-control";
      }

      // else  {
      //   document
      //     .getElementsByClassName("groupSelect")[0]
      //     .getElementsByClassName("ant-form-item-control-wrapper")[0]
      //     .getElementsByClassName("ant-form-item-control")[0].className =
      //     "ant-form-item-control";
      //   var list = document
      //     .getElementsByClassName("groupSelect")[0]
      //     .getElementsByClassName("ant-form-item-control-wrapper")[0]
      //     .getElementsByClassName("ant-form-item-control")[0]
      //     .getElementsByClassName("ant-form-explain")[0];
      //   list.removeChild(list.childNodes[0]);
      // }
      if (
        err ||
        !this.state.defdsg ||
        this.state.value.length === 0 ||
        !this.state.DB ||
        !this.state.DJ
      ) {
        return;
      }
      const {
        EmployeeID,
        firstname,
        lastname,
        email,
        phone_number,
        present_address,
        // dateBirth,
        // dateJoin,
        highest_degree,
        BloodGroup,
        emergency_contact
      } = form.getFieldsValue();

      const profile_body = {
        dsg: this.state.dsg,
        reports_to: this.state.reportsto,
        phone_number,
        present_address,
        date_of_birth: this.state.DB,
        date_of_joining: this.state.DJ,
        highest_degree,
        blood_group: BloodGroup,
        emergency_contact
      };

      const user_body = {
        user_id: this.props.profile.user,
        username: EmployeeID,
        first_name: firstname,
        last_name: lastname,
        email,
        groups: this.state.value,
        group_id: this.props.group_id
      };

      this.props.updateProfile(this.props.profile.user, profile_body);
      this.props.updateUser(user_body);
      form.resetFields();
      // this.state.value = [];
      this.setState({
        visible: false,
        data: [],
        dsg: "",
        defdsg: "",
        reportsto: "",
        defreportsto: "",
        value: [],
        DB: "",
        DJ: ""
      });
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.profile !== this.props.profile) {
      let groupList = [];
      this.props.profile.groups.map((group, i) => {
        groupList.push(group.id);
      });
      this.props.getAllDesignations(groupList);
      this.props.getGroupListAll();

      this.setState({
        DB: this.props.profile.date_of_birth,
        DJ: this.props.profile.date_of_joining
      });
      if (this.props.profile.dsg_name) {
        this.setState({
          defdsg: this.props.profile.dsg_name.title_name,
          dsg: this.props.profile.dsg_name.id
        });
      }
      if (this.props.profile.reports_to) {
        this.setState({
          reportsto: this.props.profile.reports_to.id,
          defreportsto: (
            <Fragment>
              <ImageSmall
                clsattr={"img-circle"}
                altname={this.props.profile.reports_to.full_name}
                srcfile={this.props.profile.reports_to.image}
              />
              &emsp;{this.props.profile.reports_to.full_name}
            </Fragment>
          )
        });
      }
      this.props.profile.groups.map((group, i) => {
        this.state.value.push(group.id);
      });
    }

    // if (prevProps.members !== this.props.members) {
    //   const data = this.props.members.map(user => ({
    //     value: user.username,
    //     username: user.full_name,
    //     image: user.image,
    //     full_name: user.full_name,
    //     id: user.id
    //   }));
    //   this.setState({ data });
    // }
    if (prevProps.userlist !== this.props.userlist) {
      const data = this.props.userlist.map(user => ({
        value: user.username,
        username: user.full_name,
        image: user.image,
        full_name: user.full_name,
        id: user.id
      }));
      this.setState({ data });
    }
  }
  handleChange = value => {
    this.setState({
      defreportsto: value,
      reportsto: value
    });
  };

  SelectDesignation = value => {
    this.setState({
      dsg: value,
      defdsg: value
    });
  };
  SelectGroup = value => {
    // this.props.getTypeMembers("group", value);
    if (value.length !== 0) {
      this.props.getAllDesignations(value);
    }

    this.setState({
      value: value,
      dsg: "",
      defdsg: ""
    });
  };

  render() {
    if (!this.props.profile || !this.props.allgroup) {
      return null;
    }
    const { data, fetching } = this.state;
    // const { form, member } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    let groups = [];
    this.props.profile.groups.map(grp => groups.push(grp.name));

    const children = [];
    this.props.allgroup.map((group, i) =>
      children.push(
        <Option key={i} value={group.id}>
          {group.name}
        </Option>
      )
    );

    const designations = [];
    if (this.props.designations) {
      this.props.designations.map((title, i) => {
        designations.push(
          <Option key={i} value={title.id}>
            {title.title_name}
          </Option>
        );
      });
    }

    return (
      <Fragment>
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          width={768}
          title="Update Profile"
          okText="Update"
          onCancel={this.handleCancel}
          onOk={this.handleCreate}
          okType={"primary"}
          //confirmLoading={this.state.confirmLoading}
          destroyOnClose={true}
        >
          <br />
          <Form
            {...formItemLayout}
            // onSubmit={this.handleSubmit}
            className={"formEdit"}
            initialValues={{
              EmployeeID: this.props.profile.username,
              firstname: this.props.profile.firstname,
              lastname: this.props.profile.lastname,
              email: this.props.profile.email,
              phone_number: this.props.profile.phone_number,
              present_address: this.props.profile.present_address,
              highest_degree: this.props.profile.highest_degree,
              BloodGroup: this.props.profile.blood_group,
              emergency_contact: this.props.profile.emergency_contact,

            }}
          >
            <Form.Item label="Employee ID:" name="EmployeeID" className={"formLabel"} rules={[
              { required: true, message: "Please input Employee ID!" }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item label="Full Name:" className={"formLabel"}>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item name="firstname" className={"formLabel"} rules={[
                    {
                      required: true,
                      message: "Please input the First Name!"
                    }
                  ]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastname" className={"formLabel"} rules={[
                    {
                      required: false,
                      message: "Please input the Last Name!"
                    }
                  ]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="Email:" name="email" className={"formLabel"} rules={[
              {
                type: "email",
                message: "The input is not valid Email!"
              },
              {
                required: true,
                message: "Enter Email Address"
              }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item label="Group" className={"formLabel groupSelect"}>
              <Select
                mode="multiple"
                getPopupContainer={trigger => trigger.parentNode}
                style={{ width: "100%" }}
                placeholder="Please select"
                //defaultValue={this.state.value}
                value={this.state.value}
                onChange={this.SelectGroup}
              //value={groups}
              >
                {children}
              </Select>
            </Form.Item>
            <Form.Item
              label="Designation"
              className={"formLabel designationSelect"}
            >
              <Select
                value={this.state.defdsg}
                onChange={this.SelectDesignation}
                placeholder="Select Group"
              >
                {designations}
              </Select>
            </Form.Item>
            <Form.Item label="Reports to" className={"formLabel reportSelect"}>
              <Select
                id="EmployeeID"
                showSearch
                //labelInValue
                getPopupContainer={trigger => trigger.parentNode}
                //value={this.state.reportsto}
                value={this.state.defreportsto}
                //placeholder="Select users"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.onSearch}
                onChange={this.handleChange}
                size="large"
                showArrow={false}
              >
                {data.map(d => (
                  // <Option key={d.value}>{d.username}</Option>
                  <Option key={d.value} value={d.id}>
                    <ImageSmall
                      clsattr={"img-circle"}
                      altname={d.username}
                      srcfile={d.image}
                    />
                    &emsp;{d.username}
                    {/* <Input value={d.id} hidden /> */}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Phone Number" name="phone_number" className={"formLabel"} rules={[
              {
                required: true,
                max: 11,
                min: 11,
                message: "Enter 11 Digit Number!"
              }
            ]}>
              <Input type="number" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Present Address:" name="present_address" className={"formLabel"} rules={[
              { required: true, message: "Please input Present Address!" }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Date of Birth:"
              className={"formLabel birthSelect"}
            >
              <DatePicker
                value={moment(this.state.DB, dateFormat)}
                onChange={this.onChangeDB}
                style={{ width: "100%" }}
              />
              {/* {getFieldDecorator("dateBirth", {
                //initialValue: this.props.profile.date_of_birth,
                rules: [
                  {
                    type: "object",
                    required: true,
                    message: "Please Enter Birth Date!"
                  }
                ]
              })(<DatePicker value={this.props.profile.date_of_birth} style={{ width: "100%" }} />)} */}
            </Form.Item>

            <Form.Item
              label="Date of Joining:"
              className={"formLabel joinSelect"}
            >
              <DatePicker
                value={moment(this.state.DJ, dateFormat)}
                onChange={this.onChangeDJ}
                style={{ width: "100%" }}
              />
              {/* {getFieldDecorator("dateJoin", {
                //initialValue: this.props.profile.date_of_joining,
                rules: [
                  {
                    type: "object",
                    required: true,
                    message: "Please Enter Joining Date!"
                  }
                ]
              })(<DatePicker style={{ width: "100%" }} />)} */}
            </Form.Item>

            <Form.Item label="Highest Degree:" name="highest_degree" className={"formLabel"} rules={[
              { required: true, message: "Please input Highest Degree!" }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item label="Blood Group:" name="BloodGroup" className={"formLabel"} rules={[
              { required: true, message: "Please input Blood Group!" }
            ]}>
              <Input />
            </Form.Item>

            <Form.Item label="Emergency Contact:" name="emergency_contact" className={"formLabel"} rules={[
              {
                required: true,
                max: 11,
                min: 11,
                message: "Enter 11 Digit Number!"
              }
            ]}>
              <Input type="number" style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  designations: state.HR.designations,
  profile: state.profile.profile,
  userlist: state.search.searchList,
  allgroup: state.group.allgroup
  // members: state.member.members
});

// const WrappedLogin = Form.create()(MemberEditInfoModal);
export default connect(mapStateToProps, {
  getUserProfile,
  getAllDesignations,
  searchData,
  updateProfile,
  updateUser,
  getGroupListAll
  // getTypeMembers
})(MemberEditInfoModal);
