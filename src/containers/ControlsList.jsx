import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import Controls from '../components/ControlsList';
import * as AuthActions from '../actions/auth-actions';

const ControlsList = props => (
  <Controls
    handleLogout={props.actions.logoutUser}
    isAuthenticated={props.isAuthenticated}
    isRegistered={props.isRegistered}
  />
);

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(AuthActions, dispatch),
});

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated,
  isRegistered: auth.isRegistered,
});

ControlsList.propTypes = {
  actions: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isRegistered: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlsList);
