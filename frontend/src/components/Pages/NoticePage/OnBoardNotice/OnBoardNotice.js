import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getTypeNotices, getNoticeDetails } from "../../../../actions/notice";
import CommonTable from "../../../Common/AllTables/CommonTable";
import TitleHeader from "../../../Common/TitleHeader/TitleHeader";
import CardBodyOnly from "../../../Common/AllCard/CardBodyOnly";
import { Badge, Skeleton, Row, Button, Icon } from "antd";
import "./OnBoardNotice.css";
import NoticeEditModal from "../../../Common/Modals/NoticeEditModal/NoticeEditModal";
import NoticeDeleteModal from "../../../Common/Modals/NoticeDeleteModal/NoticeDeleteModal";
import AddNewNoticeModal from "../../../Common/Modals/AddNewNoticeModal/AddNewNoticeModal";
import NoData from "../../../Common/NoData/NoData";
import moment from "moment";
import "./OnBoardNotice.css";
class OnBoardNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true
    };
  }
  componentWillMount() {
    this.setState({ fetchingData: false });
    {
      this.props.getTypeNotices("onboard", this.props.match.params.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ fetchingData: false });
    }
  }
  componentWillReceiveProps() {
    this.setState({ fetchingData: false });
  }

  editModal(id) {
    this.editModalchild.showModal(id);
  }
  deleteModal(deleteId) {
    this.deleteModalchild.showModal(deleteId);
  }

  render() {
    if (!this.props.notices) {
      return null;
    }

    const fetchingData = this.state.fetchingData;
    let notice_list = [];

    if (this.props.notices) {
      {
        this.props.notices.map(notice => {
          let notice_object = {
            Title: (
              <Skeleton active loading={fetchingData} paragraph={false}>
                {notice.important ? (
                  <Fragment>
                    <Link
                      to={`/notice-details/${notice.id}`}
                      style={{ color: "#f5222d" }}
                    >
                      {notice.title}
                    </Link>
                    &emsp;
                    {/* <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#f5222d"
                      style={{ fontSize: "14px" }}
                    /> */}
                  </Fragment>
                ) : (
                  <Fragment>
                    <Link to={`/notice-details/${notice.id}`}>
                      {notice.title}
                    </Link>
                  </Fragment>
                )}
                {/* <Link to={`/notice-details/${notice.id}`}>{notice.title}</Link> */}
              </Skeleton>
            ),

            "Expires On": (
              <Skeleton active loading={fetchingData} paragraph={false}>
                {moment(notice.expires_on).format("YYYY-MM-DD hh:mm a")}
              </Skeleton>
            ),

            1: (
              <Button
                type="primary"
                id="EditNoticeBtn"
                onClick={() => this.editModal(notice.id)}
              >
                Update Notice
              </Button>
            ),
            2: (
              <Button
                type="danger"
                id="DeleteNoticeBtn"
                onClick={() => this.deleteModal(notice.id)}
              >
                Delete Notice
              </Button>
            )
          };
          notice_list.push(notice_object);
        });
      }
      var tableData = {
        columns: ["Title", "Expires On", "1", "2"],
        rows: notice_list
      };
    }

    return (
      <Fragment>
        <NoticeEditModal onRef={ref => (this.editModalchild = ref)} />
        <NoticeDeleteModal onRef={ref => (this.deleteModalchild = ref)} />
        <div className="col-sm-8" id="base-main-body">
          <div className="row">
            <div className="col-sm-12">
              <div id="main-body-div">
                <br />
                <TitleHeader
                  title={"On Board Notice"}
                  title_color={"#337ab7"}
                />
                <CardBodyOnly BodyId={"my_proj_table"} id={"ProjectCard"}>
                  {this.props.notices.length > 0 ? (
                    <CommonTable
                      clsattr={"table OnBoardTable"}
                      data={tableData}
                      class_div={"allprojtab"}
                    />
                  ) : (
                    <NoData />
                  )}
                  <br />
                  <Row
                    type="flex"
                    align="middle"
                    style={{ placeContent: "center" }}
                  >
                    <AddNewNoticeModal />
                  </Row>
                </CardBodyOnly>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  user: state.auth.user,
  notices: state.notice.notices
});

const mapActionsToProps = {
  getNoticeDetails: getNoticeDetails,
  getTypeNotices: getTypeNotices
};
export default connect(mapStateToProps, mapActionsToProps)(OnBoardNotice);
