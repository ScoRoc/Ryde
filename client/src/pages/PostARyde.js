import React, { Component } from 'react';
import '../css/postaryde.css';
import RydeForm from '../components/RydeForm';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { toggleRydesTab } from '../redux/actions/index';
import axios from 'axios';

const mapDispatchToProps = dispatch => {
  return {
    toggleRydesTab: data => dispatch(toggleRydesTab(data)),
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

class ConnectedPostARyde extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reoccurring: false,
      twoWay: false,
      rydeName: '',
      startStreet: '',
      startCity: '',
      startState: '',
      startZip: '',
      endStreet: '',
      endCity: '',
      endState: '',
      endZip: '',
      departDate: '',
      departTime: '',
      returnDepartDate: '',
      returnDepartTime: '',
      reoccurringMon: false,
      reoccurringTues: false,
      reoccurringWed: false,
      reoccurringThurs: false,
      reoccurringFri: false,
      reoccurringSat: false,
      cost: '',
      costBreakdown: '',
      smoking: false,
      tripPets: false,
      carType: '',
      seats: '',
      redirect: false
    }
    this.handlePostARydeSubmit = this.handlePostARydeSubmit.bind(this)
    this.handleReoccurringChange = this.handleReoccurringChange.bind(this)
    this.handleTwoWayChange = this.handleTwoWayChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleReoccurringChange(e) {
    this.setState({
      reoccurring: e.target.checked,
    })
  }

  handleTwoWayChange(e) {
    this.setState({
      twoWay: e.target.checked,
    })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handlePostARydeSubmit(e) {
    e.preventDefault()
    let reoccurringArray = [
      this.state.reoccurringSun,
      this.state.reoccurringMon,
      this.state.reoccurringTues,
      this.state.reoccurringWed,
      this.state.reoccurringThurs,
      this.state.reoccurringFri,
      this.state.reoccurringSat
    ];

    let newDepartDate = this.state.departDate.split('-');
    let newDepartTime = this.state.departTime.split(':');

    var numDepartDate = []
    var numDepartTime = []

    newDepartDate.forEach(function(newDate, index) {
      if (index !== 1) {
        numDepartDate.push(+newDate)
      } else {
        // Have to subtract 1 from the month value because this argument is 0 index'd in Date.UTC
        numDepartDate.push(newDate - 1)
      }
    })

    newDepartTime.forEach(function(newDate) {
      numDepartTime.push(+newDate)
    })

    // year, month, day, hour, minute, second, and millisecond
    var departDateTime =  Date.UTC(...numDepartDate, ...numDepartTime)

    var trip = {
      driverId: this.props.user._id,
      rydeName: this.state.rydeName,
      startAddress: {
        street: this.state.startStreet,
        city: this.state.startCity,
        state: this.state.startState,
        zip: this.state.startZip,
      },
      endAddress: {
        street: this.state.endStreet,
        city: this.state.endCity,
        state: this.state.endState,
        zip: this.state.endZip,
      },
      departDate: departDateTime,
      reoccurring: this.state.reoccurring,
      reoccurringDays: reoccurringArray,
      cost: this.state.cost,
      costBreakdown: this.state.costBreakdown,
      smoking: this.state.smoking,
      pets: this.state.tripPets,
      carType: this.state.carType,
      seats: this.state.seats,
    }

    if (this.state.twoWay) {
      let newReturnDepartDate = this.state.returnDepartDate.split('-');
      let newReturnDepartTime = this.state.returnDepartTime.split(':');

      var numReturnDepartDate = []
      var numReturnDepartTime = []

      newReturnDepartDate.forEach(function(newDate) {
        numReturnDepartDate.push(+newDate)
      })
      newReturnDepartTime.forEach(function(newDate) {
        numReturnDepartTime.push(+newDate)
      })

      // year, month, day, hour, minute, second, and millisecond
      var returnDepartDateTime =  Date.UTC(...numReturnDepartDate, ...numReturnDepartTime)

      var returnTrip = {
        driverId: this.props.user._id,
        rydeName: this.state.rydeName,
        startAddress: {
          street: this.state.endStreet,
          city: this.state.endCity,
          state: this.state.endState,
          zip: this.state.endZip
        },
        endAddress: {
          street: this.state.startStreet,
          city: this.state.startCity,
          state: this.state.startState,
          zip: this.state.startZip
        },
        departDate: returnDepartDateTime,
        reoccurring: this.state.reoccurring,
        reoccurringDays: reoccurringArray,
        cost: this.state.cost,
        costBreakdown: this.state.costBreakdown,
        smoking: this.state.smoking,
        pets: this.state.TripPets,
        carType: this.state.carType,
        seats: this.state.seats,
      }
    }

    axios.post('/ryde', trip).then(result => {
      this.props.toggleRydesTab({ rydesTabIsToggled: false });
      if(!this.state.twoWay) {
        this.setState({
          redirect: true
        })
      }
      if (this.state.twoWay) {
        axios.post('/ryde', returnTrip).then(result => {
          if(this.state.twoWay){
            this.setState({
              redirect: true
            })
          }
        }).catch(err => {
          console.log(err);
        })
      }

    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    if(this.state.redirect){
      return <Redirect to='/myrydes' />
    }
    const reoccurringShowHide = this.state.reoccurring ? 'show' : 'hide';
    const twoWayShowHide = this.state.twoWay ? 'show' : 'hide';
    return (
      <div id="post-a-ryde" className="container">
        <h2>Post A Ryde</h2>
        <RydeForm
          isEditPage={false}
          rydeName={this.state.rydeName}
          onInputChange={this.handleInputChange}
          startStreet={this.state.startStreet}
          startCity={this.state.startCity}
          startState={this.state.startState}
          startZip={this.state.startZip}
          endStreet={this.state.endStreet}
          endCity={this.state.endCity}
          endState={this.state.endState}
          endZip={this.state.endZip}
          departDate={this.state.departDate}
          departTime={this.state.departTime}
          twoWay={this.state.twoWay}
          onTwoWayChange={this.handleTwoWayChange}
          twoWayShowHide={twoWayShowHide}
          returnDepartDate={this.state.returnDepartDate}
          returnDepartTime={this.state.returnDepartTime}
          reoccurring={this.state.reoccurring}
          reoccurringShowHide={reoccurringShowHide}
          onReoccurringChange={this.handleReoccurringChange}
          reoccurringSun={this.state.reoccurringSun}
          reoccurringMon={this.state.reoccurringMon}
          reoccurringTues={this.state.reoccurringTues}
          reoccurringWed={this.state.reoccurringWed}
          reoccurringThurs={this.state.reoccurringThurs}
          reoccurringFri={this.state.reoccurringFri}
          reoccurringSat={this.state.reoccurringSat}
          cost={this.state.cost}
          costBreakdown={this.state.costBreakdown}
          smoking={this.state.smoking}
          pets={this.state.tripPets}
          carType={this.state.carType}
          seats={this.state.seats}
          onPostARydeSubmit={this.handlePostARydeSubmit} />
      </div>
    )
  }
}

const PostARyde = connect(mapStateToProps, mapDispatchToProps)(ConnectedPostARyde);


export default PostARyde;
