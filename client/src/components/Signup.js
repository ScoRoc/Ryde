import React, { Component } from 'react';
import { connect } from 'react-redux';
// import store from '../redux/store/index';
import { liftTokenToState } from '../redux/actions/index';
import { Redirect } from 'react-router-dom';
import { Input } from 'react-materialize';
import axios from 'axios';

const mapDispatchToProps = dispatch => {
  return {
    liftTokenToState: data => dispatch(liftTokenToState(data))
  }
}

const mapStateToProps = state => {
  return { token: state.token, user: state.user, currentPage: state.currentPage };
}

class ConnectedSignup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      homeState: '',
      workState: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    let name = this.name.value
    let email = this.email.value
    let password = this.password.value
    let dob = this.dob.value
    let homeStreet = this.homeStreet.value
    let homeCity = this.homeCity.value
    let homeState = this.state.homeState
    let homeZip = this.homeZip.value
    let workStreet = this.workStreet.value
    let workCity = this.workCity.value
    let workState = this.state.workState
    let workZip = this.workZip.value
    axios.post('/auth/signup',
      {name, email, password, dob, homeStreet, homeCity, homeState, homeZip, workStreet, workCity, workState, workZip})
        .then( result => {
          console.log("Just clicked submit on signup")
        localStorage.setItem('rydeAppToken', result.data.token)
        this.props.liftTokenToState(result.data)
        this.props.notifySuccess('signed up!')
    }).catch( err => console.log(err) )
  }

  handleStateInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    if ( this.props.user && Object.keys(this.props.user).length > 0 ) {
      return (<Redirect to={{ pathname: this.props.currentPage }} />)
    } else {
        return (
          <div>
            <form id='sign-up-form' onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col s12 m6">
                  Name <input type='text' ref={ input => {this.name = input}} placeholder='Full name' required />
                </div>
                <div className="col s12 m6">
                  Email<input type='email' ref={ input => {this.email = input}} placeholder='email@email.com' required />
                </div>
              </div>
              <div className="row">
                <div className="col s12 m9">
                  Password <input type='password' ref={ input => {this.password = input}} placeholder='P@$$w0rD! - must be a minimum of 8 characters' required />
                </div>
                <div className="col s12 m3">
                  Date of birth <input type='date' ref={ input => {this.dob = input}} placeholder='YYYY-MM-DD' required />
                </div>
              </div>
              <div className="row">
                <h5>Home Address</h5>
                <div className="col s12 m4">
                  Address <input type='text' ref={input => {this.homeStreet = input}} placeholder='123 Main St' />
                </div>
                <div className="col s12 m3">
                  City <input type='text' ref={input => {this.homeCity = input}} placeholder='Seattle' required />
                </div>
                <div className="col s12 m2">
                  State <Input type='select' defaultValue='' ref={input => {this.homeState = input}} onChange={(e) => this.handleStateInputChange(e)} name='homeState' required>
                    <option value="" disabled>Select</option>
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
                  Zipcode<input type='number' ref={input => {this.homeZip = input}} placeholder='Zip code' />
                </div>
              </div>
              <div className="row">
                <h5>Work Address</h5>
                <div className="col s12 m4">
                  Address <input type='text' ref={input => {this.workStreet = input}} placeholder='123 Main St' />
                </div>
                <div className="col s12 m3">
                  City <input type='text' ref={input => {this.workCity = input}} placeholder='Seattle' />
                </div>
                <div className="col s12 m2">
                  State <Input type='select' defaultValue='' ref={input => {this.workState = input}} onChange={(e) => this.handleStateInputChange(e)} name='workState'>
                    <option value="" disabled>Select</option>
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
                  Zipcode <input type='number' ref={input => {this.workZip = input}} placeholder='Zip code' />
                </div>
              </div>
            </form>
            <div className="row">
              <div className="col s12 modal-buttons">
                <input type="submit" className="rydeBlueBtn btn modal-action modal-close" value="Sign Up" form="sign-up-form" />
                <button className="rydeBlueBtn btn modal-action modal-close cancel-button">Cancel</button>
              </div>
            </div>
          </div>
        )
     }
  }
}

const Signup = connect(mapStateToProps, mapDispatchToProps)(ConnectedSignup);

export default Signup;
