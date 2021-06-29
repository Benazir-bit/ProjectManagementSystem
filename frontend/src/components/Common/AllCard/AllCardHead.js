import React, { Component, Fragment } from "react";
import "./AllCard.css";

class AllCardHead extends Component {
	render() {
		return (
			<Fragment>
				<div
					id={"Manager_project_dashboard_table"}
					className="card-header card-header-warning"
				>
					<h4 className="card-title" id={this.props.cardHeadTitle}>
						{this.props.cardTitle}
						{this.props.extras}
						{/* <a href={this.props.linkhref} id={this.props.id}>{this.props.view}</a> */}
					</h4>
				</div>
			</Fragment>
		);
	}
}
export default AllCardHead;
