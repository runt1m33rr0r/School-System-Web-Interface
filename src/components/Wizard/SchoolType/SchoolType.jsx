import React from 'react';
import PropTypes from 'prop-types';
import { Radio, RadioGroup, FormControlLabel, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const SchoolTypeChooser = props => (
  <div>
    <RadioGroup value={props.schoolType}>
      <FormControlLabel
        onClick={props.handleSchoolTypeChange('gymnasium')}
        value="gymnasium"
        control={<Radio />}
        label="Гимназия"
      />
      <FormControlLabel
        onClick={props.handleSchoolTypeChange('elementary')}
        value="elementary"
        control={<Radio />}
        label="Основно училище"
      />
    </RadioGroup>
    <TextField
      id="number"
      label="Брой паралелки на клас"
      value={props.groupsCount}
      onChange={props.handleGroupsCountChange}
      type="number"
      className={props.classes.textField}
      InputLabelProps={{
        shrink: true,
      }}
      margin="normal"
    />
  </div>
);

SchoolTypeChooser.propTypes = {
  classes: PropTypes.object.isRequired,
  schoolType: PropTypes.string.isRequired,
  groupsCount: PropTypes.number.isRequired,
  handleSchoolTypeChange: PropTypes.func.isRequired,
  handleGroupsCountChange: PropTypes.func.isRequired,
};

export default withStyles()(SchoolTypeChooser);
