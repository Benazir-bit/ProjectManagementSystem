import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Form, Modal, Input, DatePicker, Checkbox } from "antd";
import { updateNotice, getNoticeDetails } from "../../../../actions/notice";

import moment from "moment";

class NoticeEditModal extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
    important: false,
    notice_id: "",
    data: [],
    expired_date: "",
    created_date: "",
    value: []
  };
  componentDidMount() {
    this.props.onRef(this);
  }

  onChange = e => {
    this.setState({
      important: !this.state.important
    });
  };
  showModal(id) {
    this.props.getNoticeDetails(id);
    this.setState({
      visible: true,
      notice_id: id,
      data: [],
      created_date: "",
      expired_date: "",
      value: []
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      data: [],
      created_date: "",
      expired_date: "",
      value: []
    });
  };
  formRef = React.createRef();
  handleCreate = () => {
    const {
      title,
      body,
      created_on,
      expires_on,
    } = this.formRef.current.getFieldsValue();


    this.props.updateNotice(
      this.state.notice_id,
      title,
      body,
      created_on.format(),
      expires_on.format(),
      this.state.important
    );
    //this.state.value = [];

    this.formRef.current.resetFields();
    this.setState({
      visible: false
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.notice) {
      if (prevProps.notice !== this.props.notice) {
        this.setState({
          created_date: this.props.notice.created_on,
          expired_date: this.props.notice.expires_on,
          important: this.props.notice.important
        });
      }
    }
  }

  render() {
    // console.log(this.props.notice, "this.props.notice");
    if (!this.props.notice) {
      return null;
    }

    // const { data, fetching } = this.state;
    let today = new Date();

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

    return (
      <Fragment>
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          width={768}
          title="Update Notice"
          okText="Update"
          onCancel={this.handleCancel}
          onOk={this.handleCreate}
          okType={"primary"}
          destroyOnClose={true}
        >
          <br />

          <Form {...formItemLayout} className={"formEdit"}
            ref={this.formRef}
            initialValues={{
              title: this.props.notice.title,
              body: this.props.notice.body,
              created_on: moment(this.state.created_date),
              expires_on: moment(this.state.expired_date),

            }}>
            <Form.Item label="Notice Title:" name="title" className={"formLabel"} rules={[
              { required: true, message: "Please Enter Notice Title!" }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item label="Details:" name="body" className={"formLabel"} rules={[
              { required: true, message: "Please Enter Notice Detail!" }
            ]}><Input />
            </Form.Item>
            <Form.Item label="Created On" name="created_on" className={"formLabel"}>
              <DatePicker
                format="DD MMM, YYYY, hh:mm a"
                initialValue={moment(this.state.created_date)}
                disabled
                showTime={{
                  user12hours: true
                }}
              />
            </Form.Item>
            <Form.Item label="Expires On" name="expires_on" className={"formLabel"} rules={[
              { required: true, message: "Please Enter Expired Date!" }
            ]}>
              <DatePicker
                disabledDate={d => !d || d.isBefore(today)}
                format="DD MMM, YYYY, hh:mm a"
                // initialValue={moment(this.state.expired_date)}
                showTime={{
                  user12hours: true
                }}
              />

            </Form.Item>
            <Form.Item name="important" rules={[{ required: false }]}>

              <center>
                <Checkbox
                  checked={this.state.important}
                  onChange={this.onChange}
                >
                  Important
                </Checkbox>
              </center>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  notice: state.notice.notice
});

// const WrappedBoardNotice = Form.create()(NoticeEditModal);
export default connect(mapStateToProps, { updateNotice, getNoticeDetails })(
  NoticeEditModal
);
