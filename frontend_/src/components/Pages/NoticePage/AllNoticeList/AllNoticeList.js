import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getTypeNotices, getNoticeDetails } from "../../../../actions/notice";
import TitleHeader from "../../../Common/TitleHeader/TitleHeader";
import CardBodyOnly from "../../../Common/AllCard/CardBodyOnly";
import { Badge, Skeleton, List, Icon } from "antd";
import "./AllNoticeList.css";
import axios from "axios";
import moment from "moment";
import NoticeDeleteModal from "../../../Common/Modals/NoticeDeleteModal/NoticeDeleteModal";

class AllNoticeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      right: "0",
      fetchingData: true,
      error: false,
      loading: false,
      notice: [],
      count: null,
      hasMore: true,
      offset: 0,
      limit: 20
    };
    window.onscroll = () => {
      const {
        state: { error, loading, hasMore, fetchingData }
      } = this;

      this.state.hasMore =
        this.state.offset / this.state.limit + 1 <=
        Math.ceil(this.state.count / this.state.limit);
      if (error || loading || !hasMore) return;

      //divided by limit
      if (hasMore) {
        if (
          Math.ceil(
            document.documentElement.scrollHeight - window.pageYOffset
          ) === document.documentElement.clientHeight ||
          Math.ceil(
            document.documentElement.scrollHeight - window.pageYOffset
          ) +
          1 ===
          document.documentElement.clientHeight ||
          Math.ceil(
            document.documentElement.scrollHeight - window.pageYOffset
          ) -
          1 ===
          document.documentElement.clientHeight ||
          Math.round(
            document.documentElement.scrollHeight - window.pageYOffset
          ) === document.documentElement.clientHeight
        ) {
          this.loadData();
        }
      }
    };
  }

  loadData = () => {
    const token = localStorage.getItem("token");

    //HEADERS
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // IF TOKEN AVAILABLE, ADD TO HEADER (AUTHORIZATION)
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    this.setState({ loading: true, fetchingData: true });
    const { offset, limit } = this.state;

    axios
      .get(`/uspl/api/notices/all/?offset=${offset}&limit=${limit}`, config)
      .then(res => {
        const newJournals = res.data.results;
        console.log("fetching...");
        console.log(res.data.results);
        console.log(res.data.count);
        this.state.count = res.data.count;
        this.state.notice = [...this.state.notice, ...newJournals];
        this.state.offset = offset + limit;
        this.setState({
          loading: false,
          fetchingData: false
        });
      })
      .catch(err => {
        this.setState({
          error: true,
          loading: false
        });
      });
  };
  componentWillMount() {
    this.setState({
      fetchingData: true,
      loading: true
    });
    this.loadData();
  }

  render() {
    var list;
    let notice_list = [];
    if (this.state.notice.length == 0) {
      notice_list = (
        <Skeleton active loading={true} paragraph={true}></Skeleton>
      );
    } else {
      this.state.notice.map((notice, i) => {
        list = (
          <List.Item
            key={i}
            actions={[
              <Fragment>
                <p style={{ color: "#123a5d" }}>
                  {/* <Icon type="clock-circle" style={{ marginRight: 10 }} /> */}
                  {moment(notice.created_on).format("h:mm a")}
                </p>
              </Fragment>
            ]}
          >
            <List.Item.Meta
              title={
                <p style={{ fontSize: "14px", color: "#123a5d" }}>
                  {/* <Icon type="calendar" theme="filled" />{" "} */}
                  <span style={{ marginLeft: 10 }}>
                    {moment(notice.created_on).format("DD MMM, YYYY")}
                  </span>
                </p>
              }
              description={
                <p>
                  <Link to={`/notice-details/${notice.id}`}>
                    <span
                      style={{
                        marginLeft: "10px",
                        fontSize: "13px"
                      }}
                    >
                      {notice.title}
                    </span>
                  </Link>
                </p>
              }
            />
          </List.Item>
        );
        notice_list.push(list);
      });
    }
    return (
      <Fragment>
        <div className="col-sm-8" id="base-main-body">
          <div className="row">
            <div className="col-sm-12">
              <div id="main-body-div">
                <br />
                <TitleHeader title={"All Notices"} title_color={"#337ab7"} />
                <List itemLayout="horizontal"> {notice_list} </List>
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
  notice: state.notice.notice
});

const mapActionsToProps = {
  getNoticeDetails: getNoticeDetails,
  getTypeNotices: getTypeNotices
};

export default connect(mapStateToProps, mapActionsToProps)(AllNoticeList);
