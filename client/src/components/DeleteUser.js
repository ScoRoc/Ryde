import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { liftTokenToState } from '../redux/actions/index';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../redux/actions/index';

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  }
}

const mapStateToProps = state => {
  return { token: state.token, user: state.user, currentPage: state.currentPage };
}

class ConnectedDeleteUser extends Component {
  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: '',
      wrongEmail: false,
      wrongPassword: false,
      redirect: false
    }
  }

  handleEmailChange = (e) => {
    e.preventDefault()
    this.setState({
      email: e.target.value
    })
  }
  handlePasswordChange = (e) => {
    e.preventDefault()
    this.setState({
      password: e.target.value
    })
  }
  handleUserDeletionSubmit = (e) => {
    e.preventDefault()
    let email = this.state.email
    let password = this.state.password
    let userId = this.props.user._id
    console.log(email, password);
    if(email === this.props.user.email) {
      axios({
        url: '/profile/' + userId,
        method: 'delete',
        data: {email, password, userId}
      }).then(result => {
        if(result.data.msg === false) {
          this.setState({
            wrongPassword: true,
            wrongEmail: false
          })
        } else {
          console.log('deleted user');
          localStorage.removeItem('rydeAppToken');
          this.props.logout()
          this.setState({
            redirect:true
          })
        }
      })
    } else {
      this.setState({
        wrongPassword:false,
        wrongEmail:true
      })
      console.log('wrong email');
    }
  }

  render(){
    if (this.state.redirect) {
      return (<Redirect to={{ pathname: this.props.currentPage }} />)
    }
    var check = ''
    if(this.state.wrongEmail) {
      check = <div className='border-background-red'>You have entered a wrong email</div>
    } else if (this.state.wrongPassword){
      check = <div className='border-background-red'>You have entered a wrong Password</div>
    } else {
      check = <br />
    }
    return(
      <div>
        <h4>Confirm your details:</h4>
        {check}
        <form onSubmit={this.handleUserDeletionSubmit}>
          Email: <input type='text' value={this.state.email} onChange={this.handleEmailChange} />
          <br />
          Password: <input type='text' value={this.state.password} onChange={this.handlePasswordChange} />
          <br />
          <button type='submit' className='btn red'>Confirm Deletion</button>
        </form>
      </div>
    )
  }
}

const DeleteUser = connect(mapStateToProps, mapDispatchToProps)(ConnectedDeleteUser)
export default DeleteUser;
