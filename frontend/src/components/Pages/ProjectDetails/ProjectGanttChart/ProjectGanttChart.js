import React, { useEffect, useState, Component, Fragment } from 'react'
import { Bar } from '@ant-design/charts';
import moment from 'moment';

class ProjectGanttChart extends Component {

  render() {
    if (!this.props.project_chart) {
      return null
    }
    var data = []
    let min_max = []
    this.props.project_chart.map((d) => {
      data.push({
        type: d.type,
        values: [Date.parse(d.values[0]), Date.parse(d.values[1])]
      });
      min_max.push(Date.parse(d.values[0]), Date.parse(d.values[1]))
    })
    var min = Math.min(...min_max),
      max = Math.max(...min_max);

    // var data = [
    //     {
    //       type: 'a',
    //       values:[Date.parse("2020-01-01"),Date.parse("2020-01-12")]
    //     },
    //     {
    //       type: 'b',
    //       values:[Date.parse("2020-01-20"),Date.parse("2020-01-29")]

    //     },
    //     {
    //       type: 'c',
    //       values:[Date.parse("2020-02-01"),Date.parse("2020-02-10")]

    //     },


    //   ];
    var config = {
      data: data,
      xField: 'values',
      yField: 'type',
      xAxis: {
        tickCount: 20,
        range: [0, 1],
        nice: true,
        label: {
          // rotate: Math.PI / 6,
          // offset: 10,
          // style: {
          //   fill: '#aaa',
          //   fontSize: 12,
          // },
        },
        title: {
          text: 'Timeline',
          style: { fontSize: 16 },
        },
        tickLine: {
          style: {
            lineWidth: 2,
            stroke: '#aaa',
          },
          length: 5,
        },
        grid: {
          line: {
            style: {
              stroke: '#ddd',
              lineDash: [4, 2],

            },
          },
          // alternateColor: 'rgba(0,0,0,0.05)',
        },
      },
      yAxis: {
        title: {
          text: 'WBS Tasks',
          style: { fontSize: 16 },
        },

      },
      // isRange: true,
      meta: {
        values: {
          max: Date.parse(moment(max).format('YYYY-MM-DD')),
          min: Date.parse(moment(min).format('YYYY-MM-DD')),
          formatter: function formatter(val) {
            let date = moment(val).format('DD-MMM-YYYY');
            return date;
          },
        },
      },

      label: {
        position: 'middle',
        layout: [
          { type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' },
        ],
        content: function formatter(val) {
          const date1 = new Date(val.values[0]);
          const date2 = new Date(val.values[1]);
          const diffTime = Math.abs(date2 - date1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        },
      },
      tooltip: {
        formatter: function formatter(val) {
          return {
            name: ''
              .concat("timeline", ' '),
            value: `${moment(val.values[0]).format("DD-MMM-YYYY")} - ${moment(val.values[1]).format("DD-MMM-YYYY")}`,
          };
        },
      },
      // scrollbar: { type: 'horizontal' },
    };

    return (
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        <Bar {...config} />
      </div>
    );
  }
}
export default ProjectGanttChart;
