import React, { Component } from 'react';
import { connect } from 'react-redux';
import { liftUpdatedUser } from '../redux/actions/index';
// import store from '../redux/store/index';
import axios from 'axios';

const mapDispatchToProps = dispatch => {
  return { liftUpdatedUser: user => dispatch(liftUpdatedUser(user)) };
}

class ConnectedBecomeADryver extends Component {

  becomeDryverSubmit(e) {
    e.preventDefault()
    let car = this.carType.value
    let driversLicense = this.driversLicense.value
    let userId = this.props.userId
    axios.put('/profile/' + this.props.userId + '/becomedryver', {car, driversLicense, userId})
      .then( result => {
        this.props.liftUpdatedUser(result.data)
        this.props.notifyUpdate('You are now a Dryver! Check out your new Post a Ryde page in the navbar.')
    }).catch( err => console.log(err) )
  }

  render() {
    return(
      <form onSubmit={(e) => this.becomeDryverSubmit(e)}>
        <input type='text' placeholder='Car type: i.e. Toyota 4Runner' ref={ input => {this.carType = input}} />
        <input type='text' placeholder="Driver's license number" ref={ input => {this.driversLicense = input}} />
        <input type='submit' className='rydeBlueBtn btn' value='Submit Dryver info' />
      </form>
    )
  }
}

const BecomeADryver = connect(null, mapDispatchToProps)(ConnectedBecomeADryver);

export default BecomeADryver;
