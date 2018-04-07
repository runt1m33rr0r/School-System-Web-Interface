import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';

import styles from './styles';

class TableComponent extends Component {
  static getHeadCells() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => <TableCell key={num}>{num}</TableCell>);
  }

  getRows() {
    return ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък'].map((day, idx) => (
      <TableRow key={day}>
        <TableCell>{day}</TableCell>
        {this.lessonsByDay(idx + 1)}
      </TableRow>
    ));
  }

  lessonsByDay(day) {
    return this.props.lessons.map((lesson) => {
      if (lesson.timeslot.day === day) {
        return (
          <TableCell
            key={`${lesson.timeslot.fromHour}${lesson.timeslot.fromMinute}${
              lesson.timeslot.toHour
            }${lesson.timeslot.toMinute}${lesson.groupName}${lesson.subjectCode}${
              lesson.teacherUsername
            }`}
          >
            {typeof this.props.deleteHandler === 'function' ? (
              <Chip
                label={
                  <div>
                    <div>{lesson.subjectCode}</div>
                    <div>{lesson.teacherUsername}</div>
                  </div>
                }
                onDelete={this.props.deleteHandler(lesson)}
              />
            ) : (
              <div>
                <div>{lesson.subjectCode}</div>
                <div>{lesson.teacherUsername}</div>
                {this.props.showGroups && <div>{lesson.groupName}</div>}
              </div>
            )}
          </TableCell>
        );
      }
      return undefined;
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.overflowing}>
              <TableCell>Ден</TableCell>
              {TableComponent.getHeadCells()}
            </TableRow>
          </TableHead>
          <TableBody>{this.getRows()}</TableBody>
        </Table>
      </Paper>
    );
  }
}

TableComponent.propTypes = {
  lessons: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  showGroups: PropTypes.bool,
  deleteHandler: PropTypes.func,
};

export default withStyles(styles)(TableComponent);
