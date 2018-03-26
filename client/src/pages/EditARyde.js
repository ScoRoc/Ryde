import React, { Component } from 'react';
import RydeForm from '../components/RydeForm';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { liftTokenToState, toggleRydesTab } from '../redux/actions/index';
import axios from 'axios';

const mapDispatchToProps = dispatch => {
  return {
    liftTokenToState: data => dispatch(liftTokenToState(data)),
    toggleRydesTab: data => dispatch(toggleRydesTab(data))
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    currentRyde: state.currentRyde
  }
}

class ConnectedEditARyde extends Component {
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
      reoccurringSun: false,
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
      rydeLoaded: false,
      redirect: false
    }
    // console.log('initial state: ', this.state)
    this.handlePostARydeSubmit = this.handlePostARydeSubmit.bind(this)
    this.handleReoccurringChange = this.handleReoccurringChange.bind(this)
    this.handleTwoWayChange = this.handleTwoWayChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    console.log('on Input Change');
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  componentDidMount() {
    var getAndStorePost = () => {
      axios.get('/ryde/' + this.props.currentRyde + '/edit')
      .then( result => {
        if (result.data && result.data.length > 0) {
          // console.log('results: ', result.data[0]);
          let results = result.data[0];

          // Convert depart timestamp into YYYY-MM-DD format and extract departTime
          let rawDepartDate = new Date(results.departDate);
          let departMonth = rawDepartDate.getMonth() < 10 ? ('0' + rawDepartDate.getMonth()) : rawDepartDate.getMonth();
          let departDate = rawDepartDate.getDate() < 10 ? ('0' + rawDepartDate.getDate()) : rawDepartDate.getDate();
          let fullDepartDate = rawDepartDate.getFullYear() + '-' + departMonth + '-' + departDate;
          let departTime = rawDepartDate.getHours() + ':' + rawDepartDate.getMinutes();



          this.setState({
            reoccurring: results.reoccurring,
            twoWay: false,
            rydeName: results.rydeName,
            startStreet: results.startAddress.street,
            startCity: results.startAddress.city,
            startState: results.startAddress.state,
            startZip: results.startAddress.zip,
            endStreet: results.endAddress.street,
            endCity: results.endAddress.city,
            endState: results.endAddress.state,
            endZip: results.endAddress.zip,
            departDate: fullDepartDate,
            departTime: departTime,
            reoccurringSun: results.reoccurringDays[0],
            reoccurringMon: results.reoccurringDays[1],
            reoccurringTues: results.reoccurringDays[2],
            reoccurringWed: results.reoccurringDays[3],
            reoccurringThurs: results.reoccurringDays[4],
            reoccurringFri: results.reoccurringDays[5],
            reoccurringSat: results.reoccurringDays[6],
            cost: results.cost,
            costBreakdown: results.costBreakdown,
            smoking: results.smoking,
            tripPets: results.pets,
            carType: results.carType,
            seats: results.seats,
            rydeLoaded: true
          });
        } else {
          this.setState({results: []});
          console.log('fails')
        }
      });

    }
    if (this.props.user) {
      getAndStorePost()
    } else {
      // console.log('hello else')
      let token = localStorage.getItem('rydeAppToken')
      if (token === 'undefined' || token === 'null' || token === '' || token === undefined || token === null) {
        localStorage.removeItem('rydeAppToken')
        this.props.logout()
      } else {
        axios.post('/auth/me/from/token', {
          token
        }).then( result => {
          localStorage.setItem('rydeAppToken', result.data.token)
          this.props.liftTokenToState(result.data);
          getAndStorePost()
        }).catch( err => console.log(err))
      }
    }
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

    // console.log(this.state.departDate, this.state.departTime, this.state.departDate.split('-'), this.state.departTime.split(':'));
    let newDepartDate = this.state.departDate.split('-');
    let newDepartTime = this.state.departTime.split(':');

    var numDepartDate = []
    var numDepartTime = []

    newDepartDate.forEach(function(newDate) {
      numDepartDate.push(+newDate)
    })
    newDepartTime.forEach(function(newDate) {
      numDepartTime.push(+newDate)
    })

    // console.log('numDepartDate ', numDepartDate)
    // console.log('numDepartTime ', numDepartTime)
    // console.log('dateTime ', ...numDepartDate, ...numDepartTime)
    // year, month, day, hour, minute, second, and millisecond
    var departDateTime =  Date.UTC(...numDepartDate, ...numDepartTime)
    // console.log('departDateTime ', departDateTime)


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
    console.log(trip)

    axios.put('/ryde/' + this.props.currentRyde, trip).then(result => {
      // console.log('added one way ', result.data)
      console.log('Updated ryde!');
      this.props.toggleRydesTab({ rydesTabIsToggled: false });
      this.setState({
        redirect: true
      })
    }).catch(err => {
      console.log(err);
    });

  }


  render() {
    if(this.state.redirect){
      return <Redirect to='/myrydes' />
    }
    const reoccurringShowHide = this.state.reoccurring ? 'show' : 'hide';
    const twoWayShowHide = this.state.twoWay ? 'show' : 'hide';
    // console.log('currentState: ', this.state)
    if (this.state.rydeLoaded) {
      return (
        <div id="post-a-ryde" className="container">
          <h2>Edit A Ryde</h2>
          <RydeForm
            isEditPage={true}
            rydeName={this.state.rydeName}
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
            onInputChange={this.handleInputChange}
            onPostARydeSubmit={this.handlePostARydeSubmit} />
        </div>
      )
    } else {
      return (
        <div>
          <p>Loading data...</p>
        </div>
      )
    }
  }
}

const EditARyde = connect(mapStateToProps, mapDispatchToProps)(ConnectedEditARyde);


export default EditARyde;
