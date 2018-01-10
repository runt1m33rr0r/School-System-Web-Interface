import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import withStyles from 'material-ui/styles/withStyles';
import PropTypes from 'prop-types';

import styles from './styles';

class GroupList extends Component {
  componentDidMount() {
    const { generateGroups, schoolType, groupsCount } = this.props;
    generateGroups(schoolType, groupsCount);
  }

  render() {
    const {
      classes, handleAddSubject, handleRemoveSubject, groups, subjects,
    } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {Object.keys(groups).map(key => <TableCell key={key}>{key}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map(subject => (
              <TableRow key={subject}>
                {Object.keys(groups).map(key => (
                  <TableCell key={key}>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleAddSubject(key, e.target.value);
                            } else {
                              handleRemoveSubject(key, e.target.value);
                            }
                          }}
                          value={subject}
                        />
                      }
                      label={subject}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

GroupList.propTypes = {
  classes: PropTypes.any.isRequired,
  groups: PropTypes.object.isRequired,
  subjects: PropTypes.array.isRequired,
  schoolType: PropTypes.string.isRequired,
  groupsCount: PropTypes.number.isRequired,
  handleAddSubject: PropTypes.func.isRequired,
  handleRemoveSubject: PropTypes.func.isRequired,
  generateGroups: PropTypes.func.isRequired,
};

export default withStyles(styles)(GroupList);
