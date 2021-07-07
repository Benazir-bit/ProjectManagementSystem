import React, { Fragment } from "react";
// import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Modal, Button } from "antd";
import MemberDetailInfo from "./MemberDetailInfo";
import ImageBig from "../../ImageBig/ImageBig";
import "./MemberDetailModal.css";
import MemberDetailBtn from "./MemberDetailBtn";
import CircleProgress from "../../CircleProgress/CircleProgress";

class MemberDetailModal extends React.Component {
  state = { visible: false, loading: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 500);
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        <Button id="allMemDetailBtn" onClick={this.showModal}>
          Details
        </Button>
        <Modal
          title={this.props.member.profile.full_name}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
          width={878}
          footer={[
            <Button
              key="okay"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
            >
              Okay
            </Button>
          ]}
        >
          <Fragment>
            <div className="row">
              <div className="col-sm-7">
                <MemberDetailInfo member_info={this.props.member} />
              </div>
              <div className="col-sm-5">
                <br />
                <br />
                <ImageBig
                  altname={this.props.member.profile.full_name}
                  id={"memberpic"}
                  srcfile={this.props.member.profile.image}
                />
              </div>
            </div>
            <br />
            {
              this.props.user.is_hr ? null :
                < div className="row">
                  <div className="col-sm-12">
                    <div className="col-sm-7">
                      <MemberDetailBtn />
                    </div>
                    <div className="col-sm-5 avgKpi">
                      <h4 style={{ textAlign: "center", fontStyle: "italic" }}>
                        Average KPI
                      </h4>
                      <CircleProgress />
                    </div>
                  </div>
                </div>
            }

          </Fragment>
        </Modal>
      </div >
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});
export default connect(
  mapStateToProps
)(MemberDetailModal);
