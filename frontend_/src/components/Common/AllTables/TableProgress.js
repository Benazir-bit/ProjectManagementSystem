// import React, { Component, Fragment } from 'react'
// import './AllTable.css'
// class TableProgress extends Component {

//     render() {

//         return (
// 			<div class="progress" id={this.props.id}>
// 				<div class={this.props.progress} role="progressbar" aria-valuenow={this.props.ariaValue} aria-valuemin="0" aria-valuemax={this.props.valueMax} style={this.props.style}></div>
// 			</div>
//         )
//     }
// }
// export default TableProgress

import React, { Component, Fragment } from "react";
import { Progress } from "antd";

class TableProgress extends Component {
  render() {
    return (
      <Fragment>
        <div className="TableProgress">
          <Progress
            strokeLinecap="square"
            status={"normal"}
            percent={this.props.percent}
          />
        </div>
      </Fragment>
    );
  }
}
export default TableProgress;
