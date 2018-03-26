import React, { Component } from 'react';
import { connect } from 'react-redux';
import { liftUpdatedUser } from '../redux/actions/index';
import axios from 'axios';

const mapDispatchToProps = dispatch => {
  return {
    liftUpdatedUser: user => dispatch(liftUpdatedUser(user)),
  }
}

class ConnectedReviewUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRating: 1
    }
    this.handleRatingChange = this.handleRatingChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleRatingChange(e) {
    this.setState({ selectedRating: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log(this.state.selectedRating)
    axios.post('/profile/' + this.props.clickedUserId + '/reviewuser', {
      clickedId: this.props.clickedUserId,
      rating: parseInt(this.state.selectedRating),
      userType: this.props.userType,
      theUser: this.props.theUser
    }).then( result => {
      console.log(result.data)
      this.props.userType === 'ryder' ? this.props.updateProfileRyderDetails(result.data) : this.props.updateProfileDryverDetails(result.data)
      this.props.liftUpdatedUser(result.data.theUser)
      this.props.notifyUpdate('You have reviewed this user.')
    }).catch( err => console.log(err) )
  }

  render() {
    return(
      <form className='review-form' onSubmit={(e) => this.handleSubmit(e)}>
        <input required name='this.props.inputName' value='1' checked={this.state.selectedRating === '1'} onChange={this.handleRatingChange} type='radio' id={this.props.userType + 'one-star'}/>
        <label htmlFor={this.props.userType + 'one-star'}>1</label>
        <input name='this.props.inputName' value='2' checked={this.state.selectedRating === '2'} onChange={this.handleRatingChange} type='radio' id={this.props.userType + 'two-star'} />
        <label htmlFor={this.props.userType + 'two-star'}>2</label>
        <input name='this.props.inputName' value='3' checked={this.state.selectedRating === '3'} onChange={this.handleRatingChange} type='radio' id={this.props.userType + 'three-star'} />
        <label htmlFor={this.props.userType + 'three-star'}>3</label>
        <input name='this.props.inputName' value='4' checked={this.state.selectedRating === '4'} onChange={this.handleRatingChange} type='radio' id={this.props.userType + 'four-star'} />
        <label htmlFor={this.props.userType + 'four-star'}>4</label>
        <input name='this.props.inputName' value='5' checked={this.state.selectedRating === '5'} onChange={this.handleRatingChange} type='radio' id={this.props.userType + 'five-star'} />
        <label htmlFor={this.props.userType + 'five-star'}>5</label>
        <br />
        <input type='submit' className='rydeGreenBtn btn' value='Submit rating' />
      </form>
    )
  }
}

const ReviewUser = connect(null, mapDispatchToProps)(ConnectedReviewUser);

export default ReviewUser;
