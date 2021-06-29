import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getNoticeDetails } from "../../../../actions/notice";
import { Descriptions, Badge, List, Skeleton } from "antd";
import moment from "moment";
import TitleHeader from "../../../Common/TitleHeader/TitleHeader";
import ImageSmall from "../../../Common/ImageSmall/ImageSmall";
import "./NoticeDetails.css";
class NoticeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true
    };
  }
  componentDidMount() {
    this.props.getNoticeDetails(this.props.match.params.id);
    this.setState({ fetchingData: true });
  }
  componentWillReceiveProps() {
    this.setState({ fetchingData: false });
  }
  render() {
    return (
      <Fragment>
        <div className="col-sm-9" id="base-main-body">
          <div className="row">
            <div className="col-sm-12">
              <div id="main-body-div">
                <br />
                <TitleHeader title={"Notice"} title_color={"#337ab7"} />
                <br />
                <div className="NoticeDetails" id={this.props.id}>
                  <List id="NotiDetails">
                    <List.Item id="NotiDetails">
                      {!this.props.notice ? (
                        <Skeleton active loading={true} paragraph={true} />
                      ) : (
                        <Descriptions
                          column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}
                          title={this.props.notice.title}
                          id="NotiDetails"
                        >
                          {/* {this.props.notice.important ? <p>okkk</p> : null} */}
                          <Descriptions.Item label="Created By">
                            &emsp;
                            <ImageSmall
                              clsattr={"img-circle"}
                              altname={"Simul"}
                              srcfile={this.props.notice.created_by_image}
                            />
                            {this.props.notice.created_by_name}
                          </Descriptions.Item>
                          <Descriptions.Item label="Posted On">
                            {moment(this.props.notice.created_on).format(
                              "DD MMM, YYYY, hh:mm a"
                            )}
                          </Descriptions.Item>

                          <Descriptions.Item label="Expires On">
                            {moment(this.props.notice.expires_on).format(
                              "DD MMM, YYYY, hh:mm a"
                            )}
                          </Descriptions.Item>

                          <Descriptions.Item label="Details">
                            {this.props.notice.body}
                          </Descriptions.Item>

                          <Descriptions.Item label="Important">
                            {this.props.notice.important ? (
                              <div style={{ display: "-webkit-inline-box" }}>
                                {/* <Icon
                                  type="exclamation-circle"
                                  theme="twoTone"
                                  style={{ fontSize: "14px" }}
                                  twoToneColor="#d9534f"
                                /> */}
                                &nbsp;
                                <p
                                  style={{ fontSize: "13px", color: "#d9534f" }}
                                >
                                  TRUE
                                </p>
                              </div>
                            ) : (
                              <div style={{ display: "-webkit-inline-box" }}>
                                {/* <Icon
                                  type="exclamation-circle"
                                  theme="twoTone"
                                  style={{ fontSize: "14px" }}
                                  twoToneColor="#098a09"
                                /> */}
                                &nbsp;
                                <p
                                  style={{ fontSize: "13px", color: "#098a09" }}
                                >
                                  FALSE
                                </p>
                              </div>
                            )}
                          </Descriptions.Item>
                        </Descriptions>
                      )}
                    </List.Item>
                  </List>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  notice: state.notice.notice,
  user: state.auth.user
});
export default connect(mapStateToProps, { getNoticeDetails })(NoticeDetails);
