import React from 'react';
import '../css/publicprofile.css';
import { ProfileDetails } from '../components/ProfileDetails';

export const PublicProfile = props => {
  if (props.clickedUser) {
    return (
      <div className='public-profile-page'>
        <div className='row'>
          <div className='col s12 center-align'>
            <div className='public-profile-backing-pic'></div>
            <div className='pic-circle'>
              <div dangerouslySetInnerHTML={{__html: props.clickedUser.image}} />
            </div>
            <br />
            <h4>{props.clickedUser.name}</h4>
          </div>
        </div>
        <div className='row center-align'>
          <div className='col s10 offset-s1'>
            <ProfileDetails clickedUser={props.clickedUser} />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <h4>Loading...</h4>  /////////// FIX THIS
    )
  }
}

export default PublicProfile;
