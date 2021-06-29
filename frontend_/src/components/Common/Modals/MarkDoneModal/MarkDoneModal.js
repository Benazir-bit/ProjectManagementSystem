import React, { Fragment } from "react";
import { Modal, Button, Input } from "antd";
import MarkDoneSlider from "../../MarkDoneSlider/MarkDoneSlider";
import MarkDoneModalHead from "./MarkDoneModalHead";
import { markTaskAsDone } from "../../../../actions/task";
import { connect } from "react-redux";
const { TextArea } = Input;

class MarkDoneModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      skill: null,
      attitude: null,
      motivation: null,
      communication: null,
      time_management: null,
      reliability: null,
      comment: null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  showModal = () => {
    this.setState({
      ...this.state,
      visible: true
    });
  };

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    this.props.markTaskAsDone(
      this.props.task.id,
      this.state.skill,
      this.state.attitude,
      this.state.motivation,
      this.state.communication,
      this.state.time_management,
      this.state.reliability,
      this.state.comment
    );
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 1000);
  };

  WriteComment = e => {
    this.setState({
      comment: e.target.value
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <Fragment>
        <div>
          <Button type="primary" onClick={this.showModal} id="MarkDoneBtn">
            Mark as Done
          </Button>
          <Modal
            visible={visible}
            title="Performance Report"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={700}
            destroyOnClose={true}
            maskClosable={false}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Return
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={this.handleOk}
              >
                Submit
              </Button>
            ]}
          >
            <MarkDoneModalHead task={this.props.task} />
            <br />
            <MarkDoneSlider
              category={"Skill"}
              onChangeSlider={this.handleChange}
            />
            <MarkDoneSlider
              category={"Attitude"}
              onChangeSlider={this.handleChange}
            />
            <MarkDoneSlider
              category={"Motivation"}
              onChangeSlider={this.handleChange}
            />
            <MarkDoneSlider
              category={"Communication"}
              onChangeSlider={this.handleChange}
            />
            <MarkDoneSlider
              category={"Time Management"}
              onChangeSlider={this.handleChange}
            />
            <MarkDoneSlider
              category={"Reliability"}
              onChangeSlider={this.handleChange}
            />
            <br />
            <p>Add Comment:</p>

            <TextArea
              rows={4}
              value={this.state.comment}
              onChange={this.WriteComment}
            />
          </Modal>
        </div>
      </Fragment>
    );
  }
}

// const mapStateToProps = state => ({
//   user: state.auth.user,
//   task: state.tasks.task
// });
export default connect(
  null,
  { markTaskAsDone }
)(MarkDoneModal);
