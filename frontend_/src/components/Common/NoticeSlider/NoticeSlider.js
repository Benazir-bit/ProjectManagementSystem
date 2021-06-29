import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./NoticeSlider.css";

class NoticeSlider extends Component {
  render() {
    return (
      <div className="row" id="notice_row">
        <div className="bn-breaking-important_news">
          <div className="col-xs-1" id="announcement_icon">
            <span className="glyphicon"></span>
          </div>
          <div className="bn-label_important">NOTICE</div>

          <div className="bn-news">
            <div id="myNotice" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner" role="listbox">
                {this.props.notices.map((notice, i) => (
                  <div key={i} className={i == 0 ? "item active" : "item"}>
                    {notice.important ? (
                      <Fragment>
                        <Link
                          to={`/notice-details/${notice.id}`}
                          style={{ color: "#f5222d" }}
                        >
                          {notice.title}
                        </Link>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Link to={`/notice-details/${notice.id}`}>
                          {notice.title}
                        </Link>
                      </Fragment>
                    )}
                    {/* <Link
                      to={`/notice-details/${notice.id}`}
                      title={notice.title}
                      target="_blank"
                    >
                      {notice.title}
                    </Link> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bn-controls">
            <Link to="#myNotice" role="button" data-slide="prev">
              <button>
                <span className="bn-arrow bn-prev" />
              </button>
            </Link>
            <Link to="#myNotice" role="button" data-slide="next">
              <button>
                <span className="bn-arrow bn-next" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(NoticeSlider);
