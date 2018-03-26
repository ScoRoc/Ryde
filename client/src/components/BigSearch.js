import React, { Component } from 'react';
import '../css/bigsearch.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { liftBigSearch } from '../redux/actions/index';
import {Input,Row} from 'react-materialize';

const mapDispatchToProps = dispatch => {
  return {
    liftBigSearch: data => dispatch(liftBigSearch(data))
  }
}
const mapStateToProps = state =>{
  return {user: state.user}
}

class ConnectedBigSearch extends Component {
  constructor(props){
    super(props)
    this.state = {
      cost: '',
      date: '',
      time: ''
    }
  }

  handleBigSearch = (e) => {
    e.preventDefault()

    if(this.props.user) {
      var userId = this.props.user._id
    }
    let zip = this.zipInput.value
    let dist = this.distanceInput.value
    let sCity = this.sCityInput.value
    let eCity = this.eCityInput.value
    //split returns an array without special characters which I parseint with +
    let sDate = this.state.date
    sDate ? (sDate = sDate.split('-').map((date,index) => {
      if(index === 1) {
        return +date-1
      } else {
        return +date
      }
    })) : (sDate = '')
    let sTime = this.state.time
    sTime ? (sTime = sTime.split(':').map(time=>+time)): (sTime = '')
    let pets = this.petInput.state.checked
    let cost = this.state.cost
    let reoccur = this.reoccurInput.state.checked
    let seat = (this.seatInput.value - 1) >= 0 ? (this.seatInput.value - 1) : 1;
    //Date.UTC turns the unpacked date and time into a time stamp
    let dateTime = Date.UTC(...sDate,...sTime)
    let current = Date.now();
    console.log('this timestamp: ',(new Date(dateTime)).toUTCString(), dateTime);
    console.log('current timestamp: ',(new Date(current)).toUTCString(), current);
    if(dateTime<=current || !(dateTime)){
      dateTime = current
    }
    console.log('this timestamp: ',(new Date(dateTime)).toUTCString());

    axios.post('/bigsearch',
    {zip,dist,sCity,eCity,dateTime,pets,cost,reoccur,seat,userId,current}).then(result => {

      console.log('result:',result.data.newTrips);
      this.props.liftBigSearch(result.data.newTrips);

    })
  }

  handleStateInputChange = (e) => {
    e.preventDefault(e)
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleBigSearch(e)}>

          <div className="row">
            <div className="col s12 m6">
              <input type='number' maxLength='5' placeholder='Departing Zipcode' autoComplete='postal-code' ref={(input)=>{this.zipInput = input;}} />
            </div>
            <div className="col s12 m6">
              <input type='number' placeholder='Max Distance' ref={(input)=>{this.distanceInput = input;}}/>
            </div>
          </div>

          <div className="row">
            <div className="col s12 m6">
              <input type='text' placeholder='Departing City' autoComplete='departing-city' ref={(input)=>{this.sCityInput = input;}}/>
            </div>
            <div className="col s12 m6">
            <input type='text' placeholder='Destination City' autoComplete='destination-city' ref={(input)=>{this.eCityInput = input;}}/>
            </div>
          </div>

          <div className="row">
            <div className="col s12 m6">
              <input type='number' placeholder='Max Cost' onChange={(e)=>this.handleStateInputChange(e)} name='cost'/>
            </div>
            <div className="col s12 m6">
              <input type='number' placeholder='Seats Available' ref={(input)=>{this.seatInput = input;}}/>
            </div>
          </div>
          <div className="row">
            <div className="col s12 m6">
              <Input type="date" className="datepicker" options={{format: 'yyyy-mm-dd'}} name='date' placeholder="Date To Depart" onChange={(e)=>this.handleStateInputChange(e)} />
            </div>
            <div className='col s12 m6'>
              <Input type="time" className="timepicker" options={{twelvehour: false}} name='time' placeholder="Time To Depart" onChange={(e)=>this.handleStateInputChange(e)} />
            </div>
          </div>
          <div className='row'>
            <div className="col s12 m6">
              <Row>
                <Input label='Pets' name='Pets' type='checkbox' placeholder='Pets' ref={(input)=>{this.petInput = input;}}/>
              </Row>
            </div>
            <div className='col s12 m6'>
              <Row>
                <Input name='reoccur' label='Reoccurring' type='checkbox' ref={(input)=>{this.reoccurInput = input;}}/>
              </Row>
            </div>
            <br />
            <button type='submit' className='rydeGreenBtn btn'>Submit</button>
          </div>

        </form>
      </div>
    )
  }
}
const BigSearch = connect(mapStateToProps, mapDispatchToProps)(ConnectedBigSearch);
export default BigSearch;
