import React, { Component, Fragment } from "react";
import { List, Avatar, Skeleton } from "antd";
import { Link } from "react-router-dom";
import TitleHeader from "../TitleHeader/TitleHeader";
import { connect } from "react-redux";
import { getTypeNews } from "../../../actions/news";
import { resetNewsInfinityScroll } from "../../../actions/news";
import moment from "moment-timezone";
import _ from "lodash";
let init = 0;
class ViewAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      right: "0",
      fetchingData: true,
      error: false,
      loading: false,
      news: [],
      count: null,
      hasMore: true,
      offset: 0,
      limit: 20,
      data: []
    };
  }
  loadData = () => {
    console.log("load data.....");
    this.props.getTypeNews(
      this.props.match.params.type,
      this.props.match.params.id,
      this.props.offset,
      this.props.limit
    );
  };
  pageScrollCheck = () => {
    let hasMore =
      this.props.offset / this.props.limit + 1 <=
      Math.ceil(this.props.count / this.props.limit);
    // console.log("Hasmore #### ", hasMore);
    if (!hasMore || this.props.isLoading) return;
    if (
      !(window.innerWidth - window.document.documentElement.clientWidth > 0)
    ) {
      if (hasMore) {
        this.loadData();
      }
    }
  };
  componentWillMount() {
    init = 1;
    this.props.resetNewsInfinityScroll();
    window.addEventListener("scroll", this.handleScroll);
    console.log("componentWillMount");
  }
  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate");
    if (init === 1) {
      this.loadData();
    }
    init = 0;
    console.log("componentDidUpdate ************");
    if (prevProps.data !== this.props.data) {
      this.pageScrollCheck();
    }
    window.addEventListener("resize", this.pageScrollCheck.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = () => {
    let hasMore =
      this.props.offset / this.props.limit + 1 <=
      Math.ceil(this.props.count / this.props.limit);
    if (!hasMore || this.props.isLoading) return;

    //divided by limit
    if (hasMore) {
      if (
        Math.ceil(
          document.documentElement.scrollHeight - window.pageYOffset
        ) === document.documentElement.clientHeight ||
        Math.ceil(document.documentElement.scrollHeight - window.pageYOffset) +
        2 ===
        document.documentElement.clientHeight ||
        Math.ceil(document.documentElement.scrollHeight - window.pageYOffset) -
        2 ===
        document.documentElement.clientHeight ||
        Math.round(
          document.documentElement.scrollHeight - window.pageYOffset
        ) === document.documentElement.clientHeight
      ) {
        this.loadData();
      }
    }
  };
  render() {
    console.log("this.props.data", this.props.scrolllisLoading);
    let news_list = [];
    if (!this.props.data) {
      news_list = <Skeleton active loading={true} paragraph={true}></Skeleton>;
    } else {
      const Property = "date";
      const newJournals = _.groupBy(this.props.data, Property);
      console.log(newJournals, "newJournals");
      console.log(this.props.data, "this.props.data");
      let dt = "";
      this.props.data.map(news => {
        let list = (
          <List
            key={news.id}
            itemLayout="horizontal"
            header={
              dt !== moment(news.created_date).format("DD-MMM-YYYY") ? (
                <p style={{ fontSize: "18px", color: "#123a5d" }}>
                  {/* <Icon type="calendar" theme="filled" />{" "} */}
                  <span style={{ marginLeft: 10 }}>
                    {moment(news.created_date).format("DD-MMM-YYYY")}
                  </span>
                </p>
              ) : null
            }
          >
            <List.Item
              actions={[
                <p style={{ color: "#123a5d" }}>
                  {/* <Icon type="clock-circle" style={{ marginRight: 10 }} /> */}
                  {moment(news.created_date).format("h:mm a")}
                </p>
              ]}
            >
              <List.Item.Meta
                description={
                  <p>
                    <Link to={`/profile/${this.props.user.id}`}>
                      <Avatar src={news.owner.profile.image} />{" "}
                      {news.owner.profile.full_name}
                    </Link>{" "}
                    <span
                      style={{
                        fontSize: "16px"
                      }}
                    >
                      {news.message}
                    </span>
                  </p>
                }
              />
            </List.Item>
          </List>
        );
        dt = moment(news.created_date).format("DD-MMM-YYYY");
        news_list.push(list);
      });

      if (this.props.scrolllisLoading) {
        for (let i = 0; i < 3; i++) {
          let list = (
            <Skeleton
              key={`loading${i}`}
              active
              loading={true}
              paragraph={false}
            ></Skeleton>
          );
          news_list.push(list);
        }
      }
    }

    return (
      <Fragment>
        <div className="col-sm-10" id="base-main-body">
          <div className="row">
            <div className="col-sm-12">
              <div id="main-body-div">
                <br />
                <TitleHeader title={"All News"} title_color={"#337ab7"} />
                <br />
                {news_list}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
//export default ViewAll
const mapStateToProps = state => ({
  user: state.auth.user,
  isLoading: state.news.isLoading,
  scrolllisLoading: state.infinityScroll.scrolllisLoading,
  data: state.news.data,
  count: state.news.count,
  offset: state.news.offset,
  limit: state.news.limit
});
export default connect(mapStateToProps, {
  getTypeNews,
  resetNewsInfinityScroll
})(ViewAll);
