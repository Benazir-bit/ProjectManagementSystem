import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./MemberEditInfoModal.css";
import {
  Form,
  Modal,
  Button,
  Input,
  Select,
  Row,
  Col,
  Spin,
  DatePicker
} from "antd";
import { updateProfile, getUserProfile } from "../../../../actions/profile";
import { searchData } from "../../../../actions/search";
import ImageSmall from "../../ImageSmall/ImageSmall";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";
const { Option } = Select;

class UserReportstoEditModal extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
    fetching: false,
    data: [],
    reportsto: "",
    defreportsto: ""
  };
  componentDidMount() {
    this.props.onRef(this);
  }

  onChangeDB = (value, dateString) => {
    this.setState({
      DB: dateString
    });
  };

  showModal(id) {
    this.props.getUserProfile(id);
    this.setState({
      visible: true,
      data: [],

      reportsto: "",
      defreportsto: ""
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      data: [],
      reportsto: "",
      defreportsto: ""
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

    if (!this.state.reportsto) {
      return;
    }

    form.validateFields(err => {
      const profile_body = {
        organogram: true,
        reports_to: this.state.reportsto
      };
      this.props.updateProfile(this.props.profile.user, profile_body);
      form.resetFields();
      this.setState({
        visible: false,
        data: [],
        reportsto: "",
        defreportsto: ""
      });
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.profile != this.props.profile) {
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
    }

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

  render() {
    if (!this.props.profile) {
      return null;
    }
    const { data, fetching } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;

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
          >
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

// const WrappedUserReportstoEditModal = Form.create()(UserReportstoEditModal);
export default connect(mapStateToProps, {
  searchData,
  updateProfile,
  getUserProfile
  // getTypeMembers
})(UserReportstoEditModal);
