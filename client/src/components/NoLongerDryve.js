import React, { Component } from 'react';
import { connect } from 'react-redux';
import { liftUpdatedUser } from '../redux/actions/index';
// import store from '../redux/store/index';
import axios from 'axios';

const mapDispatchToProps = dispatch => {
  return { liftUpdatedUser: user => dispatch(liftUpdatedUser(user)) };
}

class ConnectedNoLongerDryve extends Component {

  removeDryverStatus(e) {
    e.preventDefault()
    let userId = this.props.userId
    axios.put('/profile/' + userId + '/removedryverstatus', { userId })
      .then( result => {
        this.props.liftUpdatedUser(result.data)
        this.props.notifyUpdate('You are no longer a Dryver.')
    }).catch( err => console.log(err) )
  }

  render() {
    return(
      <button className='rydeBlueBtn btn' onClick={(e) => this.removeDryverStatus(e)}>Remove Dryver status</button>
    )
  }
}

const NoLongerDryve = connect(null, mapDispatchToProps)(ConnectedNoLongerDryve);

export default NoLongerDryve;
