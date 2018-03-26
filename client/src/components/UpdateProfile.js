import React, { Component } from 'react';
import { connect } from 'react-redux';
import { liftUpdatedUser } from '../redux/actions/index';
import { Input } from 'react-materialize';
// import store from '../redux/store/index';
import axios from 'axios';

const mapDispatchToProps = dispatch => {
  return { liftUpdatedUser: user => dispatch(liftUpdatedUser(user)) };
}

const mapStateToProps = state => {
  return { user: state.user }
}

class ConnectedUpdateProfile extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.notifyUpdate = this.notifyUpdate.bind(this)
  }

  // notifyUpdate = () => toast.info("Updated user profile!", {position: toast.POSITION.TOP_CENTER});

  // becomeDryverSubmit(e) {
  //   e.preventDefault()
  //   let car = this.carType.value
  //   let driversLicense = this.driversLicense.value
  //   let userId = this.props.userId
  //   axios.post('/profile/' + this.props.userId + '/becomedryver', {car, driversLicense, userId})
  //     .then( result => {
  //       this.props.liftUpdatedUser(result.data)
  //   }).catch( err => console.log(err) )
  // }

  handleSubmit(e) {
    e.preventDefault()
    let userId = this.props.user._id
    let name = this.name.value
    let email = this.email.value
    // let password = this.password.value
    let dob = this.dob.value
    let homeStreet = this.homeStreet.value
    let homeCity = this.homeCity.value
    let homeState = this.homeState.value
    let homeZip = this.homeZip.value
    let workStreet = this.workStreet.value
    let workCity = this.workCity.value
    let workState = this.workState.value
    let workZip = this.workZip.value
    axios.put('/profile/:id/edit',
      // {name, email, password, dob, homeStreet, homeCity, homeState, homeZip, workStreet, workCity, workState, workZip})
      {userId, name, email, dob, homeStreet, homeCity, homeState, homeZip, workStreet, workCity, workState, workZip})
        .then( result => {
        this.props.liftUpdatedUser(result.data)
        this.props.notifyUpdate('You have successfully updated your profile.')
    }).catch( err => console.log(err) )
  }

  render() {
    let user = this.props.user
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col s12 m6">
            Name: <input defaultValue={user.name} type='text' ref={ input => {this.name = input}} placeholder='Full name' required />
          </div>
          <div className="col s12 m6">
            Email: <input defaultValue={user.email} type='email' ref={ input => {this.email = input}} placeholder='email@email.com' required />
          </div>
        </div>

        <div className="row">
          {/* <div className="col s12 m9">
            Password - required: <input defaultValue={user.password} type='password' ref={ input => {this.password = input}} placeholder='P@$$w0rD! - must be a minimum of 8 characters' required />
          </div> */}
          <div className="col s12 m3">
            Date of birth: <input defaultValue={user.dob} type='date' ref={ input => {this.dob = input}} placeholder='March 15 1990' required />
          </div>
        </div>

        <div className="row">
          <div className="col s12 m4">
            Home Street Address: <input defaultValue={user.homeAddress.street} type='text' ref={input => {this.homeStreet = input}} placeholder='123 Main St' />
          </div>
          <div className="col s12 m3">
            Home City: <input defaultValue={user.homeAddress.city} type='text' ref={input => {this.homeCity = input}} placeholder='Seattle' required />
          </div>
          <div className="col s12 m2">
            Home State: <Input type='select' defaultValue={user.homeAddress.state} ref={input => {this.homeState = input}} required>
              <option value="" disabled>Select one--</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </Input>
          </div>
          <div className="col s12 m3">
            Home Zip: <input defaultValue={user.homeAddress.zip} type='number' ref={input => {this.homeZip = input}} placeholder='98102' />
          </div>
        </div>

        <div className="row">
          <div className="col s12 m4">
            Work Street Address: <input defaultValue={user.workAddress.street} type='text' ref={input => {this.workStreet = input}} placeholder='456 Thunder Road' />
          </div>
          <div className="col s12 m3">
            Work City: <input defaultValue={user.workAddress.city} type='text' ref={input => {this.workCity = input}} placeholder='Seattle' />
          </div>
          <div className="col s12 m2">
            Work State: <Input type='select' defaultValue={user.workAddress.state} ref={input => {this.workState = input}}>
              <option value="" disabled>Select one--</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </Input>
          </div>
          <div className="col s12 m3">
            Work Zip: <input defaultValue={user.workAddress.zip} type='number' ref={input => {this.workZip = input}} placeholder='98101' />
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            <input type='submit' className="rydeBlueBtn btn modal-action modal-close" value='Update' />
          </div>
        </div>
      </form>
    )
  }
}

const UpdateProfile = connect(mapStateToProps, mapDispatchToProps)(ConnectedUpdateProfile);

export default UpdateProfile;
