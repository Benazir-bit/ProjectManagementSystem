import React, { Component } from "react";
import "./PieProgress.css";
import $ from "jquery";
import { Skeleton } from "antd";
class PieProgress extends Component {
  constructor(props) {
    super(props);
    this.drawProgress = this.drawProgress.bind(this);
    this.state = {
      fetchingData: true
    };
  }

  componentDidMount() {
    this.drawProgress(this.props.overall_kpi);
  }

  drawProgress = percent => {
    $("div.prog").html(
      '<div class="percent"></div><div id="slice"' +
        (percent > 50 ? ' class="gt50"' : "") +
        '><div class="pie"></div>' +
        (percent > 50 ? '<div class="pie fill"></div>' : "") +
        "</div>"
    );
    var deg = (360 / 100) * percent;
    $("#slice .pie").css({
      "-moz-transform": "rotate(" + deg + "deg)",
      "-webkit-transform": "rotate(" + deg + "deg)",
      "-o-transform": "rotate(" + deg + "deg)",
      transform: "rotate(" + deg + "deg)"
    });
    $(".percent").html("<p>" + Math.round(percent) + "%</p>");
  };

  render() {
    const { fetchingData } = this.props;
    return (
      // <div className="progress pie-progress blue circle-prog">
      //     <span className="progress-left circle-left">
      //         <span className="progress-bar circle-bar prog"></span>
      //     </span>
      //     <span className="progress-right circle-right">
      //         <span className="progress-bar circle-bar"></span>
      //     </span>
      //     <div className="progress-value"></div>

      <div
        id="prog-contain"
        style={this.props.fetchingData ? { filter: "blur(0px)" } : {}}
      >
        <Skeleton
          active
          loading={fetchingData}
          paragraph={false}
          shape={"circle"}
        >
          <div className="prog" />
        </Skeleton>
      </div>
    );
  }
}
export default PieProgress;
