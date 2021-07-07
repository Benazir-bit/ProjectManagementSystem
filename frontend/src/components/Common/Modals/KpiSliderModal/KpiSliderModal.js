import React, { Fragment } from "react";
// import ReactDOM from "react-dom";
import { Modal, Button, Input } from "antd";
import SliderKPI from "../../SliderKPI/SliderKPI";
import KpiModalHead from "./KpiModalHead";
import { connect } from "react-redux";
import { getKPIDetails } from "../../../../actions/kpi";
const { TextArea } = Input;
class KpiSliderModal extends React.Component {
  state = {
    loading: false,
    visible: false
  };

  showModal = () => {
    this.props.getKPIDetails(this.props.kpiId);
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 1000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    return (
      <Fragment>
        <div>
          <Button type="primary" onClick={this.showModal} id="MarkDoneBtn">
            {this.props.btnname}
          </Button>
          <Modal
            visible={visible}
            title="Performance Report"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={700}
            maskClosable={false}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Return
              </Button>
            ]}
          >
            {this.props.kpi ? (
              <Fragment>
                <KpiModalHead kpi={this.props.kpi} />
                <br />
                <SliderKPI value={this.props.kpi.skill} category={"Skill"} />
                <SliderKPI
                  value={this.props.kpi.attitude}
                  category={"Attitude"}
                />
                <SliderKPI
                  value={this.props.kpi.motivation}
                  category={"Motivation"}
                />
                <SliderKPI
                  value={this.props.kpi.communication}
                  category={"Communication"}
                />
                <SliderKPI
                  value={this.props.kpi.time_management}
                  category={"Time Management"}
                />
                <SliderKPI
                  value={this.props.kpi.reliability}
                  category={"Reliability"}
                />
                <p>Comment:</p>
                <TextArea rows={4} value={this.props.kpi.comment} readOnly />
              </Fragment>
            ) : null}
          </Modal>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  kpi: state.kpi.kpi
});

export default connect(
  mapStateToProps,
  { getKPIDetails }
)(KpiSliderModal);
