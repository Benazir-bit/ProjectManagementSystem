import React, { Component, Fragment } from "react";
import Highcharts from "highcharts";
import { Skeleton } from "antd";

class PieChartChart extends Component {
  static defaultProps = {
    id: "pie_count_chart"
  };
  // <Skeleton active loading={this.props.fetchingData} paragraph={false}></Skeleton>
  componentDidUpdate(prevProps) {
    if (this.props.overview !== prevProps.overview && this.props.fetchingData) {
      const completed =
        (this.props.overview.completed_tasks /
          this.props.overview.total_tasks) *
        100;
      const ongoing =
        (this.props.overview.ongoing_tasks / this.props.overview.total_tasks) *
        100;
      const paused =
        (this.props.overview.paused_tasks / this.props.overview.total_tasks) *
        100;
      const wfr =
        (this.props.overview.waiting_for_review_tasks /
          this.props.overview.total_tasks) *
        100;
      const not_started =
        (this.props.overview.not_started_tasks /
          this.props.overview.total_tasks) *
        100;
      Highcharts.chart(this.props.id, {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie"
        },
        title: {
          text: ""
        },
        tooltip: {
          pointFormat: "<b>{point.percentage:.1f}%</b>"
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            colors: ["#000e24", "#2c5ea9", "#3c92d3", "#7bcef3", "#C6E2FF"],
            dataLabels: {
              enabled: true,
              format: "{point.percentage:.1f} %",
              distance: -35,
              filter: {
                property: "percentage",
                operator: ">",
                value: 5
              }
            }
          }
        },
        series: [
          {
            name: "status",
            data: [
              { name: "Completed", y: completed },
              { name: "Ongoing", y: ongoing },
              { name: "Paused", y: paused },
              { name: "Waiting For Review", y: wfr },
              { name: "Not Started", y: not_started }
            ]
          }
        ]
      });
    }
  }
  componentDidMount() {
    // Build the chart
    const completed =
      (this.props.overview.completed_tasks / this.props.overview.total_tasks) *
      100;
    const ongoing =
      (this.props.overview.ongoing_tasks / this.props.overview.total_tasks) *
      100;
    const paused =
      (this.props.overview.paused_tasks / this.props.overview.total_tasks) *
      100;
    const wfr =
      (this.props.overview.waiting_for_review_tasks /
        this.props.overview.total_tasks) *
      100;
    const not_started =
      (this.props.overview.not_started_tasks /
        this.props.overview.total_tasks) *
      100;
    Highcharts.chart(this.props.id, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      title: {
        text: ""
      },
      tooltip: {
        pointFormat: "<b>{point.percentage:.1f}%</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          colors: ["#000e24", "#2c5ea9", "#3c92d3", "#7bcef3", "#C6E2FF"],
          dataLabels: {
            enabled: true,
            format: "{point.percentage:.1f} %",
            distance: -35,
            filter: {
              property: "percentage",
              operator: ">",
              value: 5
            }
          }
        }
      },
      series: [
        {
          name: "status",
          data: [
            { name: "Completed", y: completed },
            { name: "Ongoing", y: ongoing },
            { name: "Paused", y: paused },
            { name: "Waiting For Review", y: wfr },
            { name: "Not Started", y: not_started }
          ]
        }
      ]
    });
  }

  // Make monochrome colors
  render() {
    // if (!this.props.overview) {
    //   return null;
    // }
    return (
      <Fragment>
        <div
          id={this.props.id}
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            height: "100%",
            width: "100%"
            // minWidth: "150px",
            // height: "245px",
            // maxWidth: "226px"
          }}
        />
      </Fragment>
    );
  }
}
export default PieChartChart;
