import React from 'react';
import PropTypes from 'prop-types';
import '../static/uspl/css/main.css';
import '../static/uspl/css/notice_board.css';
import '../static/uspl/css/styles.css';

import Title from './title_header'
//import { withStyles } from '@material-ui/core/styles';

let id = 0;
function createData(project_title_link,project_title, started_on, due_date, status) {
  id += 1;
  return { id,project_title_link, project_title, started_on, due_date, status};
}

const rows = [
  createData('/uspl/projects/56/','DT-US-18-AMSV-01', 'Oct. 31, 2018', 'Dec. 31, 2018','30.43%'),
  createData('/uspl/projects/56/','DT-US-18-AMSV-02', 'Oct. 31, 2018', 'Dec. 31, 2018','30.43%'),
  createData('/uspl/projects/56/','DT-US-18-AMSV-03', 'Oct. 31, 2018', 'Dec. 31, 2018','30.43%'),
  createData('/uspl/projects/56/','DT-US-18-AMSV-04', 'Oct. 31, 2018', 'Dec. 31, 2018','30.43%'),
  createData('/uspl/projects/56/','DT-US-18-AMSV-05', 'Oct. 31, 2018', 'Dec. 31, 2018','30.43%'),
  createData('/uspl/projects/56/','DT-US-18-AMSV-06', 'Oct. 31, 2018', 'Dec. 31, 2018','30.43%'),
];

function CustomizedTable(props) {
  //const { classes } = members;
  
  return (
    <div className="col-sm-11" id="base-main-body"> 
        <div className="row">
          <div className="col-sm-12">
            <br/>
            <div id="main-body-div">
              <Title title="Ongoing Projects"/>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Started On</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
				  {rows.map(row => (
					<tr key={row.id}>
                      <td><a href={row.project_title_link}>{row.project_title}</a></td>
                      <td>{row.started_on}</td>
                      <td>{row.due_date}</td>
                      <td id="progress-td">
                        {row.status}
                        <div className="progress" id="progress-status">
                          <div className="progress-bar" role="progressbar" aria-valuenow="30.4347826087" aria-valuemin={0} aria-valuemax={100} style={{width: '30.4347826087%'}}>
                          </div>
                        </div>
                      </td>
                    </tr>
				  ))}
                  </tbody>
                </table>
              </div>
              <br />
              <br />
              <br />
              <div className="row" align="center">				
              </div>
            </div>
          </div> 	
        </div>
      </div>
  );
}

CustomizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default (CustomizedTable);
//export default withStyles(styles)(CustomizedTable);