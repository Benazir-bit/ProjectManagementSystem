import React, { Component, Fragment } from "react";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import { connect } from "react-redux";
import "./ActivityList.css";
import { Link } from "react-router-dom";
//import { getTypeNews } from '../../../actions/news'
import moment from "moment";
import { Button, Layout, Spin } from "antd";
import { getTypeNews } from "../../../actions/news";
import { resetNewsInfinityScroll } from "../../../actions/news";
const { Sider } = Layout;


let init = 0;
class ActivityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      right: true,
      fetchingData: true,
      error: false,
      loading: false,
      news: [],
      count: null,
      hasMore: true,
      offset: 0,
      limit: 20,
      collapsed: false
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      right: !this.state.right
    });
  };
  loadData() {
    this.props.getTypeNews(
      this.props.type,
      this.props.id,
      this.props.offset,
      this.props.limit
    );
  }

  handleScroll = e => {
    if (!this.props.user.is_hr && !this.props.user.is_fna) {
      let hasMore =
        this.props.offset / this.props.limit + 1 <=
        Math.ceil(this.props.count / this.props.limit);
      if (!hasMore || this.props.isLoading) return;

      //divided by limit
      console.log(
        Math.ceil(
          document.getElementById("activityScroll").scrollHeight -
          document.getElementById("activityScroll").scrollTop
        ),
        document.getElementById("activityScroll").clientHeight
      );
      if (hasMore) {
        if (
          Math.ceil(
            document.getElementById("activityScroll").scrollHeight -
            document.getElementById("activityScroll").scrollTop
          ) === document.getElementById("activityScroll").clientHeight ||
          Math.ceil(
            document.getElementById("activityScroll").scrollHeight -
            document.getElementById("activityScroll").scrollTop
          ) ===
          document.getElementById("activityScroll").clientHeight + 1 ||
          Math.ceil(
            document.getElementById("activityScroll").scrollHeight -
            document.getElementById("activityScroll").scrollTop
          ) ===
          document.getElementById("activityScroll").clientHeight - 1
        ) {
          // console.log("handleScroll");
          this.loadData();
        }
      }
    }
  };
  pageScrollCheck() {
    if (!this.props.user.is_hr && !this.props.user.is_fna) {
      let hasMore =
        this.props.offset / this.props.limit + 1 <=
        Math.ceil(this.props.count / this.props.limit);
      // console.log("Hasmore #### ", hasMore);
      // console.log("pageScrollCheck");
      // console.log(
      //   "ssssssssssssss",
      //   document.getElementById("activityScroll").scrollHeight,
      //   document.getElementById("activityScroll").clientHeight
      // );
      var hasscroll =
        document.getElementById("activityScroll").scrollHeight >
        document.getElementById("activityScroll").clientHeight;
      if (!hasMore || this.props.isLoading) return;
      if (!hasscroll) {
        if (hasMore) {
          //console.log("pageScrollCheck load");
          this.loadData();
        }
      }
    }
  }
  // componentDidMount() {
  //   console.log("componentDidMount");

  //   this.loadData();
  //   //window.addEventListener("scroll", this.handleScroll);
  // }

  componentDidMount() {
    init = 1;
    this.props.resetNewsInfinityScroll();
    //this.loadData();

    if (this.props.offset === 0) {
      this.loadData();
      init = 0;
    }
    //this.props.resetInfinityScroll();
  }
  // shouldComponentUpdate() {
  //   console.log("shouldComponentUpdateshouldComponentUpdate");
  // }
  componentDidUpdate(prevProps) {
    // console.log(
    //   init,
    //   prevProps.id,
    //   this.props.id,
    //   prevProps.data,
    //   this.props.data,
    //   "check"
    // );
    if (prevProps.id !== this.props.id && prevProps.type === this.props.type) {
      this.props.resetNewsInfinityScroll();
      this.loadData();
    }
    if (init === 1) {
      this.loadData();
    }
    init = 0;
    if (prevProps.data !== this.props.data) {
      this.pageScrollCheck();
    }
    // window.addEventListener("resize", this.pageScrollCheck.bind(this));
  }
  componentWillUnmount() {
    this.props.resetNewsInfinityScroll();
  }

  // showDrawer = () => {
  //   console.log("llljj");
  //   // console.log(window.location.hash.substring(1).split('/'));
  //   // var type = window.location.hash.substring(1).split('/')[1]
  //   this.setState({
  //     visible: true,
  //     right: "320"
  //   });
  // };
  // onCollapse = collapsed => {
  //   console.log("llljj");
  //   this.setState({ collapsed });
  // };

  // onClose = () => {
  //   this.setState({
  //     visible: false,
  //     right: "0"
  //   });
  // };

  render() {
    // console.log(this.props.scrolllisLoading, "llll");
    if (
      !this.props.isAuthenticated ||
      this.props.user.is_hr ||
      this.props.user.is_fna
    ) {
      return null;
    }
    if (!this.props.id) {
      return <Spin />;
    }

    var val = [];
    if (!this.props.data) {
      val = (
        <div
          className={"ActivityListContent"}
          id={"activityScroll"}
          style={{
            marginTop: "57px",
            position: "fixed",
            height: "85%",
            background: "#f0f0f069",
            width: "100%"
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "8.5%",
              top: "6%",
              fontSize: "x-large"
            }}
          >
            <Spin tip="Loading..."></Spin>
          </div>
        </div>
      );
    } else {
      this.props.data.map(news => {
        let item = (
          <div>
            <div className="ant-comment" style={{ display: "inline-block" }}>
              <div className="ant-comment-inner">
                <div className="ant-comment-avatar">
                  <span
                    content="[object Object]"
                    className="ant-avatar ant-avatar-circle ant-avatar-image"
                  >
                    <ImageSmall
                      clsattr={"img-circle"}
                      altname={news.owner.profile.full_name}
                      srcfile={news.owner.profile.image}
                    />
                  </span>
                </div>
                <div className="ant-comment-content">
                  <div className="ant-comment-content-author">
                    <p className="ant-comment-content-author-name">
                      <strong>
                        <b>
                          <a>{news.owner.profile.full_name}</a>
                        </b>
                      </strong>
                      &nbsp;
                      <span className="activity_text">{news.message}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="date_time">
              <p className="activity_time">
                {" "}
                <span>
                  <i
                    aria-label="icon: clock-circle"
                    className="anticon anticon-clock-circle"
                  >
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      className=""
                      data-icon="clock-circle"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                      <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z" />
                    </svg>
                  </i>
                </span>
                {/* {news.created_date} */}
                {moment(news.created_date).format("DD MMM, YYYY, h:mm:ss a")}
                {/* July 8, 2019, 10:15 a.m. */}
              </p>
            </div>
            <hr />
          </div>
        );
        val.push(item);
      });
      if (this.props.scrolllisLoading) {
        // console.log("hereeeeeee");
        val.push(
          <div
            style={{
              position: "sticky",
              bottom: "1px",
              background: "#f9f9f9",
              fontSize: "x-large",
              margin: "auto",
              width: "22%"
            }}
          >
            <Spin tip="Loading..."></Spin>
          </div>
        );
      }
    }

    // }
    // } else {
    //   val = (
    //     <div>
    //       <Spin tip="Loading..."></Spin>
    //     </div>
    //   );
    // }

    // val = (
    //   <div>
    //     <Spin tip="Loading..."></Spin>
    //   </div>
    // );
    return (
      <Fragment>
        <div>
          <Button
            id="ant-pro-setting-drawer-handle"
            type="primary"
            onClick={this.toggle}
            style={{
              position: "sticky",
              marginLeft: "-48px",
              right: this.state.right ? 0 : 300
            }}
          >
            {/* <Icon className="trigger" type="slack" /> */}
          </Button>

          <Sider
            collapsedWidth={0}
            width={300}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            className="activitySlider"
          >
            {/* <Sider trigger={null} collapsible collapsed={this.state.collapsed}> */}
            <div
              style={{
                height: "5%",
                background: "#001529",
                top: 52,
                position: "fixed",
                width: "100%"
              }}
            >
              <p id="news_header">Recent Activities</p>
              {/* <p >
								<b></b>
							</p> */}
            </div>
            {this.props.data ? (
              <div
                className={"ActivityListContent"}
                id={"activityScroll"}
                style={{
                  marginTop: "57px",
                  position: "fixed",
                  height: "85%",
                  background: "#f0f0f069"
                }}
                onScroll={this.handleScroll}
              >
                {val}
              </div>
            ) : (
              val
            )}

            <div
              style={{
                height: "5%",
                background: "#001529",
                bottom: 0,
                position: "fixed",
                width: "100%"
              }}
            >
              <p id="news_viewall">
                <Link
                  to={`/all_news/${this.props.type}/${this.props.id}`}
                  style={{ color: "#dbdbdb" }}
                >
                  View All
                </Link>
              </p>
            </div>
          </Sider>
        </div>
      </Fragment>
      // <Fragment>

      // 	<Drawer
      // 		width={320}
      // 		position={"left"}
      // 		closable="false"
      // 		onClose={this.onClose}
      // 		visible={this.state.visible}
      // 		className={"aclivityListSlider"}
      // 		afterVisibleChange={(visible) => {
      // 			document.body.style.width = "auto";
      // 		}}
      // 	>
      // <div className={"ActivitySliderHeader"}>
      // 	<p id="news_header">
      // 		<b>Recent Activities</b>
      // 	</p>
      // </div>
      // <div className={"ActivityListContent"} style={{ paddingTop: 63 }} onScroll={this.handleScroll}>
      // 	{val}
      // </div>
      // <div className="ActivitySliderFooter">
      // 	<b>
      // 		<Link to={`/all_news/${this.props.type}/${this.props.id}`}>View All</Link>
      // 	</b>
      // </div>
      // 	</Drawer>
      // 	<Button
      // 		id="ant-pro-setting-drawer-handle"
      // 		type="primary"
      // 		onClick={this.showDrawer}
      // 		style={{ right: this.state.right }}
      // 	>
      // 		<Icon type="slack" />
      // 	</Button>

      // </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  isLoading: state.news.isLoading,
  scrolllisLoading: state.infinityScroll.scrolllisLoading,
  data: state.news.data,
  count: state.news.count,
  offset: state.news.offset,
  limit: state.news.limit
  //news_feed: state.news.news_feed
});
export default connect(mapStateToProps, {
  getTypeNews,
  resetNewsInfinityScroll
})(ActivityList);
