import React from 'react';
import { Input } from 'react-materialize';


const RydeForm = props => {
  const hideSwitchOnEdit = props.isEditPage ? 'switch hide' : 'switch show'
  const submitPostEdit = props.isEditPage ? 'Edit Your Ryde' : 'Post Your Ryde'
  const showReoccurringOnEdit = props.reoccurring || props.reoccurringShowHide === 'show' ? 'show' : 'hide'

  let seats = props.seats.toString();

  let labels = [
    props.isEditPage ? "Address" : "",
    props.isEditPage ? "City" : "",
    props.isEditPage ? "State" : "",
    props.isEditPage ? "Zipcode" : "",
    props.isEditPage ? "Ryde name" : "",
    props.isEditPage ? "Trip cost (per person)" : "",
    props.isEditPage ? "Cost breakdown" : "",
    props.isEditPage ? "Departure date" : "",
    props.isEditPage ? "Departure time" : "",
    props.isEditPage ? "Car type" : "",
    props.isEditPage ? "Available seats" : ""
  ]

  return (
    <div className="gray-container">
      <form onSubmit={props.onPostARydeSubmit}>
        <h5>Starting Point</h5>
        <div className="row">
          <div className="col s12 m5">
            {labels[0]}<input type="text" placeholder="Address" onChange={props.onInputChange} name="startStreet" value={props.startStreet} autoComplete="start-street" />
          </div>
          <div className="col s12 m3">
            {labels[1]}<input type="text" placeholder="City" onChange={props.onInputChange} name="startCity" value={props.startCity} required autoComplete="start-city" />
          </div>

          <div className="col s12 m2">
            {labels[2]}<Input type='select' onChange={props.onInputChange} name="startState" value={props.startState} required autoComplete="start-state">
              <option value="" disabled>State</option>
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

          <div className="col s12 m2">
            {labels[3]}<input type="text" placeholder="ZipCode" onChange={props.onInputChange} name="startZip" value={props.startZip} autoComplete="start-zip" />
          </div>
        </div>

        <h5>Destination</h5>
        <div className="row">
          <div className="col s12 m5">
            {labels[0]}<input type="text" placeholder="Address" onChange={props.onInputChange} name="endStreet" value={props.endStreet} autoComplete="end-street" />
          </div>
          <div className="col s12 m3">
            {labels[1]}<input type="text" placeholder="City" onChange={props.onInputChange} name="endCity" value={props.endCity} required autoComplete="end-city" />
          </div>

          <div className="col s12 m2">
            {labels[2]}<Input type='select' onChange={props.onInputChange} name="endState" value={props.endState} required autoComplete="end-state">
              <option value="" disabled>State</option>
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

          <div className="col s12 m2">
            {labels[3]}<input type="text" placeholder="ZipCode" onChange={props.onInputChange} name="endZip" value={props.endZip} autoComplete="end-zip" />
          </div>
        </div>

        <h5>Ryde Details</h5>
        <div className="row">
          <div className="col s12 m5">
            {labels[4]}<input type="text" placeholder="Ryde Name" onChange={props.onInputChange} name="rydeName" value={props.rydeName} required autoComplete="ryde-name" />
          </div>
          <div className="col s12 m3">
            {labels[5]}<input type="number" placeholder="Trip Cost (per person)" onChange={props.onInputChange} name="cost" value={props.cost} required autoComplete="ryde-cost" />
          </div>
          <div className="col s12 m4">
            {labels[6]}<input type="text" placeholder="Trip Cost Breakdown (optional)" onChange={props.onInputChange} name="costBreakdown" value={props.costBreakdown} autoComplete="ryde-cost" />
          </div>
        </div>

        <div className="row">

          <div className="col s12 m6 l4">
            {labels[7]}<Input type="date" className="datepicker" options={{format: 'yyyy-mm-dd'}} placeholder="Date To Depart" onChange={props.onInputChange} name="departDate" value={props.departDate} required />
            <div className="input-field col s12 seat-selector-cont">
              {labels[8]}<Input type="time" className="timepicker" options={{twelvehour: false}} placeholder="Time To Depart" onChange={props.onInputChange} name="departTime" value={props.departTime} required />
            </div>
          </div>

          <div className="col s12 m6 l4">
            {labels[9]}<input type="text" placeholder="Car Type" className="car-type-input" name="carType" onChange={props.onInputChange} value={props.carType} required />
            <div className="input-field col s12 seat-selector-cont">
              {labels[10]}<Input type='select' label="" name='seats' onChange={props.onInputChange} defaultValue={seats} required>
                <option value="" disabled >How Many Seats Available?</option>
                <option value="1">1 Seat</option>
                <option value="2">2 Seats</option>
                <option value="3">3 Seats</option>
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="6">6 Seats</option>
                <option value="7">7 Seats</option>
                <option value="8">8 Seats</option>
                <option value="9">9 Seats</option>
                <option value="10">10 Seats</option>
                <option value="11">11 Seats</option>
                <option value="12">12 Seats</option>
              </Input>
            </div>
          </div>

          <div className="col s12 m12 l4">
            <div className="smoking-pets">
              <p>
                <input type="checkbox" checked={props.smoking ? 'checked' : null} onChange={props.onInputChange} name="smoking" id="smoking" />
                <label htmlFor="smoking">Smoking Allowed</label>
              </p>
              <p>
                <input type="checkbox" checked={props.pets ? 'checked' : null} onChange={props.onInputChange} name="tripPets" id="tripPets" />
                <label htmlFor="tripPets">Pets Allowed</label>
              </p>
            </div>
            <div className={hideSwitchOnEdit}>
              <label>
                One Way
                <input type="checkbox" onChange={props.onTwoWayChange} />
                <span className="lever"></span>
                Two Way
              </label>
            </div>
            <div className={props.twoWayShowHide}>
              <Input type="date" className="datepicker" options={{format: 'yyyy-mm-dd'}} placeholder="Return Date To Depart" onChange={props.onInputChange} name="returnDepartDate" value={props.returnDate} />
              <Input type="time" className="timepicker" options={{twelvehour: false}} placeholder="Return Time To Depart" onChange={props.onInputChange} name="returnDepartTime" value={props.returnTime} />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s12 m8 push-m2">
            <div className="extra-option">
              <div className='switch show'>
                <label>
                  One Time Trip
                  <input type="checkbox" value={props.reoccurring} onChange={props.onReoccurringChange} />
                  <span className="lever"></span>
                  Reoccurring Trip
                </label>
              </div>

              <div id="sun-sat" className={showReoccurringOnEdit}>
                <p>
                  <input type="checkbox" onChange={props.onInputChange} name="reoccurringSun" checked={props.reoccurringSun ? 'checked' : null} id="sunday" />
                  <label htmlFor="sunday">Sun</label>
                </p>
                <p>
                  <input type="checkbox" onChange={props.onInputChange} name="reoccurringMon" checked={props.reoccurringMon ? 'checked' : null} id="monday" />
                  <label htmlFor="monday">Mon</label>
                </p>
                <p>
                  <input type="checkbox" onChange={props.onInputChange} name="reoccurringTues" checked={props.reoccurringTues ? 'checked' : null} id="tuesday" />
                  <label htmlFor="tuesday">Tues</label>
                </p>
                <p>
                  <input type="checkbox" onChange={props.onInputChange} name="reoccurringWed" checked={props.reoccurringWed ? 'checked' : null} id="wednesday" />
                  <label htmlFor="wednesday">Wed</label>
                </p>
                <p>
                  <input type="checkbox" onChange={props.onInputChange} name="reoccurringThurs" checked={props.reoccurringThurs ? 'checked' : null} id="thursday" />
                  <label htmlFor="thursday">Thurs</label>
                </p>
                <p>
                  <input type="checkbox" onChange={props.onInputChange} name="reoccurringFri" checked={props.reoccurringFri ? 'checked' : null} id="friday" />
                  <label htmlFor="friday">Fri</label>
                </p>
                <p>
                  <input type="checkbox" onChange={props.onInputChange} name="reoccurringSat" checked={props.reoccurringSat ? 'checked' : null} id="saturday" />
                  <label htmlFor="saturday">Sat</label>
                </p>
              </div>
            </div>
          </div>
        </div>

        <input type="submit" value={submitPostEdit} className="rydeGreenBtn btn" />
      </form>
    </div>
  )
}

export default RydeForm;
