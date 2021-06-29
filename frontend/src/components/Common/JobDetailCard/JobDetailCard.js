import React, { Component, Fragment } from 'react';
import AllCardBody from '../AllCard/AllCardBody';
import {  Button } from "antd";
import './JobDetailCard.css'

class JobDetailCard extends Component {
    render() {
      return (
        <Fragment>
            <AllCardBody BodyId = {"job_table"} cardTitle={this.props.JobTitle}>
                <table id="JobCatergory" className="table table-hover">
					<tbody>
    					<tr id="row_mem">
							<td id="hr_td">Trainee Engineer</td>
							<td>
                                <Button id="detailBtn" icon ="eye">Details</Button>
				        	</td>
							<td>
                                <Button id="editBtn" icon ="edit">Edit</Button>
				        	</td>
							<td>
                                <Button id="deleteBtn" icon ="delete">Delete</Button>
							</td>
						</tr>
                        <tr id="row_mem">
							<td id="hr_td">Trainee Engineer</td>
							<td>
                                <Button id="detailBtn" icon ="eye">Details</Button>
				        	</td>
							<td>
                                <Button id="editBtn" icon ="edit">Edit</Button>
				        	</td>
							<td>
                                <Button id="deleteBtn" icon ="delete">Delete</Button>
							</td>
						</tr>
                        <tr id="row_mem">
							<td id="hr_td">Trainee Engineer</td>
							<td>
                                <Button id="detailBtn" icon ="eye">Details</Button>
				        	</td>
							<td>
                                <Button id="editBtn" icon ="edit">Edit</Button>
				        	</td>
							<td>
                                <Button id="deleteBtn" icon ="delete">Delete</Button>
							</td>
						</tr>
                        <tr id="row_mem">
							<td id="hr_td">Trainee Engineer</td>
							<td>
                                <Button id="detailBtn" icon ="eye">Details</Button>
				        	</td>
							<td>
                                <Button id="editBtn" icon ="edit">Edit</Button>
				        	</td>
							<td>
                                <Button id="deleteBtn" icon ="delete">Delete</Button>
							</td>
						</tr>
					</tbody>
                </table>
            </AllCardBody>
            
        </Fragment>
      )
    }
  }
  export default (JobDetailCard);
  

