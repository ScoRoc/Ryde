import React, { Component } from 'react';
import { connect } from 'react-redux';
import { liftCurrentPageToState, liftClickedUser } from '../redux/actions/index';
import PrivateProfile from './PrivateProfile';
import { PublicProfile } from './PublicProfile';
import axios from 'axios';

const mapDispatchToProps = dispatch => {
  return {
    liftCurrentPageToState: page => dispatch(liftCurrentPageToState(page)),
    liftClickedUser: data => dispatch(liftClickedUser(data))
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    clickedUser: state.clickedUser
  };
}

class ConnectedUserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clickedUser: null
    }
  }

  componentDidMount() {
    this.props.liftCurrentPageToState('/profile/' + this.props.match.params.id)
    axios.get('/profile/' + this.props.match.params.id)
      .then( result => {
        this.props.liftClickedUser(result.data)
        this.setState({ clickedUser: result.data})
    }).catch( err => console.log(err.message))
  }

  render() {
    let showProfile = this.state.clickedUser ? (<PublicProfile clickedUser={this.state.clickedUser} />) : (<h3>Loading...</h3>);
    if (this.props.user) {
      if (this.props.user._id === this.props.match.params.id) {
        return <PrivateProfile user={this.props.user} />
      } else {
        return showProfile
      }
    } else {
      return showProfile
    }
  }
}

const UserProfile = connect(mapStateToProps, mapDispatchToProps)(ConnectedUserProfile);

export default UserProfile;
