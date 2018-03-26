import React, { Component } from 'react';
import '../css/listcard.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Ryders from './Ryders';
import { liftMyRydesDryves, liftCurrentRyde, liftClickedUser } from '../redux/actions/index';

const mapDispatchToProps = dispatch => {
  return {
    liftMyRydesDryves: data => dispatch(liftMyRydesDryves(data)),
    liftCurrentRyde: data => dispatch(liftCurrentRyde(data)),
    liftClickedUser: data => dispatch(liftClickedUser(data))
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    rydesTabIsToggled: state.rydesTabIsToggled
  }
}

class ConnectedListCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      driver: '',
      driverRating: 4.5,
      disappear: '',
    }
  }

  handleExpansionToggle(e) {
    // Expand section
    let newHeight = this.refs.details.style.maxHeight === '600px' ? '0px' : '600px';
    this.refs.details.style.maxHeight = newHeight;
    // Rotate arrow
    let newRotation = e.target.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
    e.target.style.transform = newRotation;
  }

  handleRydeAdd(e) {
    let newRotation = e.target.style.transform === 'rotate(45deg)' ? 'rotate(0deg)' : 'rotate(45deg)';
    e.target.style.transform = newRotation;
    // Post addition to the database
    axios.put('/myrydes', { userId: this.props.user._id, tripId: this.props.ryde._id })
      .then( (result) => {
        if (this.props.myRydesPage) {
          // If this handler gets called from the MyRydes page, we know the user is removing a trip.
          // Call axios for the user's new list of rydes and lift to state to trigger a re-render.
          // This causes a flicker. Just use refs to hide the listcard div instead?
          axios.get('/myrydes/' + this.props.user._id)
            .then( (result) => {
              if (result.data && result.data.length > 0) {
                this.props.liftMyRydesDryves(result.data);
              } else {
                this.props.liftMyRydesDryves([]);
              }
            });
        }
      });
  }

  componentDidMount()  {
    if(this.props.user) {
      if(!this.props.dryvesTab && (this.props.ryde.ridersId.includes(this.props.user._id) || this.props.ryde.pendingRiders.includes(this.props.user._id))) {
        this.refs.addRemoveButton.style.transform = 'rotate(45deg)';
      }
    }

  }

  handleCompleted = () =>{
    let rydeId = this.props.ryde._id
    let userId = this.props.user._id
    axios.post('/complete', {rydeId,userId}).then(result =>{
      this.setState({
        disappear: 'disappear'
      })
    })
  }

  handleDeleted = () =>{
    let rydeId = this.props.ryde._id
    let userId = this.props.user._id
    axios.post('/delete', {rydeId,userId}).then(result =>{
      this.setState({
        disappear: 'disappear shrink',
      })
    })
  }

  render() {
    let ryde = this.props.ryde;
    let reocurringDaysJSX, actionButton, riders;
    let current = Date.now();
    let departDate = this.props.ryde.departDate
    // console.log(current, departDate);
    if (!this.props.user) {
      // If the user is not logged in, always show the plus sign, linking to login
      actionButton = (
        <div className='col s2 list-card-add right-align'>
          <a href='#login-modal' className="modal-trigger "><i className='material-icons large'>add</i></a>
        </div>
      )
    } else if (this.props.myRydesPage && !this.props.rydesTabIsToggled) {
      // The user is logged in, on the MyRydes page, toggled to Dryves
      // total hack otherwise edit/delete will be rotated for god knows why
      if (this.refs.addRemoveButton) {
        this.refs.addRemoveButton.style.transform = 'rotate(0deg)';
      }
      // console.log('completed: ', (current>=departDate),(new Date(current)).toUTCString(),(new Date(departDate)).toUTCString(), this.props.ryde.rydeName);
      let completed = (current >= departDate ? (<button className="rydeGreenBtn btn colBtn" onClick={this.handleCompleted}>Completed</button>):(<button onClick={this.handleDeleted} className="red lighten-1 btn colBtn">Delete</button>))
      actionButton = (
        <div className='col s12 m12 l2'>
          <Link to='/editaryde' onClick={ () => this.props.liftCurrentRyde(ryde._id) }><button className="rydeBlueBtn btn colBtn">Edit</button></Link>
          {completed}
        </div>
      )

    } else {
      // The user is logged in, but isn't on the Dryves tab of the MyRydes page. Could be discover or My Rydes -> Rydes.
      actionButton = (
        <div className='col s2 list-card-add right-align action-button' ref='addRemoveButton' onClick={ (e) => this.handleRydeAdd(e) }>
          <i className='material-icons large'>add</i>
        </div>
      )
    }

    //console.log(ryde.reoccurringDays )
    if (ryde.reoccurring) {
      reocurringDaysJSX = (
        <span className='list-card-recurring-days'>
          <input type='checkbox' checked={ryde.reoccurringDays[0] ? 'checked' : null} disabled />
          <label>Sun</label>
          <input type='checkbox' checked={ryde.reoccurringDays[1] ? 'checked' : null} disabled />
          <label>Mon</label>
          <input type='checkbox' checked={ryde.reoccurringDays[2] ? 'checked' : null} disabled />
          <label>Tues</label>
          <input type='checkbox' checked={ryde.reoccurringDays[3] ? 'checked' : null} disabled />
          <label>Wed</label>
          <input type='checkbox' checked={ryde.reoccurringDays[4] ? 'checked' : null} disabled />
          <label>Thurs</label>
          <input type='checkbox' checked={ryde.reoccurringDays[5] ? 'checked' : null} disabled />
          <label>Fri</label>
          <input type='checkbox' checked={ryde.reoccurringDays[6] ? 'checked' : null} disabled />
          <label>Sat</label>
        </span>
      )
    }

    if (this.props.myRydesPage && !this.props.rydesTabIsToggled) {
      riders = ( <Ryders ryde={this.props.ryde} /> );
    }

    let rawDate = new Date(ryde.departDate);
    let date = rawDate.getFullYear() + '-' + (rawDate.getMonth() + 1) + '-' + rawDate.getDate();
    let time = rawDate.getHours() + ':' + rawDate.getMinutes();
    let openSeats = ryde.seats - ryde.ridersId.length;
    let startCity = ryde.startAddress.city.charAt(0).toUpperCase() + ryde.startAddress.city.slice(1);
    let endCity = ryde.endAddress.city.charAt(0).toUpperCase() + ryde.endAddress.city.slice(1);

    function capitalizer(string) {
      let splitString = string.split(' ');
      splitString = splitString.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      return splitString.join(' ');
    }

    //let rydeName = capitalizer(ryde.rydeName);
    let startAddress = capitalizer(ryde.startAddress.street);
    let endAddress = capitalizer(ryde.endAddress.street);
    let driverRating = ryde.driver.dryverRatingAvg ? ryde.driver.dryverRatingAvg : 'Unrated';


    return (
      <div className={'list-card-div ' + this.state.disappear}>
        <div className={'row list-card-header '+ this.state.disppear}>
          <div className="col s6 list-card-trip-name">
              <h4 className='list-card-h3'>{ryde.rydeName}</h4>
          </div>
          <div className="col s6 list-card-price">
            <div>
              <div><span>{openSeats}</span> Open Seats</div>
              <h4>${ryde.cost}</h4>
            </div>
          </div>
        </div>
        <div className={'row list-card-main '+this.state.disappear}>
          <div className='col s12 m5 list-card-driver'>
            <div className="col s4">
              <div className='list-card-driver-pic'>
                <Link to={'/profile/' + ryde.driverId}>
                  <div className="ryder-profile-pic">
                    <div dangerouslySetInnerHTML={{__html: ryde.driver.image}} />
                  </div>
                </Link>
              </div>
            </div>
            <div className="col s8">
              <div className='list-card-driver-details'>
                <h5>
                  <Link to={'/profile/' + ryde.driver._id} onClick={() => liftClickedUser(ryde.driver._id)} >
                    {ryde.driver.name}
                  </Link>
                </h5>
                <li><i className="material-icons">star</i> {driverRating} / 5</li>
              </div>
            </div>
          </div>
          <div className={'col s12 m5 list-card-summary '+this.state.disappear}>
            <table>
              <tbody>
                <tr><td className='right-align'><span className='bold'>From</span>:</td><td>{startAddress + ', ' + startCity + ', ' + ryde.startAddress.state}</td></tr>
                <tr><td className='right-align'><span className='bold'>To</span>:</td><td>{endAddress + ', ' + endCity + ', ' + ryde.endAddress.state}</td></tr>
                <tr><td className='right-align'><span className='bold'>Date</span>:</td><td>{date}</td></tr>
                <tr><td className='right-align'><span className='bold'>Time</span>:</td><td>{time}</td></tr>
              </tbody>
            </table>
          </div>
          {actionButton}
        </div>
        <div className={'list-card-details '+this.state.disappear} ref='details'>
          <div className='row'>
            <div className='col s12'>
              <div className="row list-card-extradetails">
                <div className="col s12 m3">
                  <div>
                    <h5>Preferences:</h5>
                    <p>{ryde.pets ? 'Pets Allowed' : 'No Pets'}</p>
                    <p>{ryde.smoking ? 'Smoking Allowed' : 'No Smoking'}</p>
                  </div>
                </div>
                <div className="col s12 m9">
                  {ryde.reoccurring ? <h5>Reocurring Days:</h5> : <h5>Not A Reocurring Ryde</h5>}
                  {reocurringDaysJSX}
                </div>
              </div>

            </div>
          </div>
          {riders}
        </div>
        <button className='list-card-expand-button' onClick={ (e) => this.handleExpansionToggle(e) }></button>
      </div>
    )
  }
}

const ListCard = connect(mapStateToProps, mapDispatchToProps)(ConnectedListCard);

export default ListCard;
