import React, { Component, Fragment } from "react";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import { Input, Select, DatePicker, Button, Icon } from "antd";
import { Link } from "react-router-dom";
const InputGroup = Input.Group;
const { Option } = Select;
import "./Inbox.css";
import CommonTable from "../../Common/AllTables/CommonTable";
class Inbox extends Component {
	render() {
		const { RangePicker } = DatePicker;
		var tableData = {
			columns: ["Status", "Sender", "Time"],
			rows: [
				{
					Status: "Ongoing",
					Sender: <Link>Simul Barua</Link>,
					Time: "20-01-2019"
				},
				{
					Status: "Ongoing",
					Sender: <Link>Simul Barua</Link>,
					Time: "20-01-2019"
				},
				{
					Status: "Ongoing",
					Sender: <Link>Simul Barua</Link>,
					Time: "20-01-2019"
				},
				{
					Status: "Ongoing",
					Sender: <Link>Simul Barua</Link>,
					Time: "20-01-2019"
				},
				{
					Status: "Ongoing",
					Sender: <Link>Simul Barua</Link>,
					Time: "20-01-2019"
				},
				{
					Status: "Ongoing",
					Sender: <Link>Simul Barua</Link>,
					Time: "20-01-2019"
				},
				{
					Status: "Ongoing",
					Sender: <Link>Simul Barua</Link>,
					Time: "20-01-2019"
				}
			]
		};
		return (
			<Fragment>
				<div className="col-sm-8" id="base-main-body">
					<div className="row">
						<div className="col-sm-12">
							<div id="main-body-div">
								<br />
								<TitleHeader title={"Inbox"} title_color={"#337ab7"} />

								<div
									style={{ position: "absolute", top: "2.2em", right: "11em" }}
								>
									<InputGroup compact>
										<Select
											style={{
												width: "300%"
											}}
											defaultValue="All"
											className="taskDropDown"
										>
											<Option value="All">All</Option>
											<Option value="Front-End Verification">
												Front-End Verification
											</Option>
											<Option value="IC Layout Design">IC Layout Design</Option>
											<Option value="IC Physical Design">
												IC Physical Design
											</Option>
											<Option value="IC Circuit Design">
												IC Circuit Design
											</Option>
										</Select>
									</InputGroup>
								</div>
								<br />

								<div className="row TitleColor">
									<span>
										<RangePicker />
									</span>
									<Button size="large" className="btnSearch">
										Search
									</Button>
									<Button size="large" className="btnAdd">
										{/* <Icon type="plus" /> */}
										New Weekly Report
									</Button>
								</div>

								<br />
								<CommonTable
									data={tableData}
									clsattr={"table table-bordered table-hover Inboxtab"}
								/>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Inbox;
