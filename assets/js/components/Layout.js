import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

const mapStateToProps = ({ connected, loginUrl, logoutUrl, stravaId, athletes }) => {
  return {
    connected,
    loginUrl,
    logoutUrl,
    stravaId,
    athletes
  }
}

const Layout = ({ children, connected, loginUrl, logoutUrl, stravaId, athletes }) => (
  <div>
    <nav className='navbar has-shadow'>
      <div className='navbar-brand'>
        <div className='navbar-item'>
          <h1 className='title has-text-weight-normal'>
            <Link to='/'>The Daily Grind Club</Link>
          </h1>
        </div>
        <a className='navbar-burger'>
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>
      <div className='navbar-menu'>
        <div className='navbar-end'>
          <div className='navbar-item'>
            {stravaId && !!athletes.length && <a href={logoutUrl}>Logout</a>}
          </div>
        </div>
      </div>
    </nav>
    <main role='main' className='container'>
      {!stravaId && <a href={loginUrl}>Login with Strava</a>}
      {stravaId && !athletes.length && <div>You need to join <a href='https://www.strava.com/clubs/thedailygrindclub'>The Daily Grind Club</a> on Strava to use this site.</div>}
      {stravaId && !athletes.length && <div>Already joined? <a href={loginUrl}>Try logging in with Strva again.</a></div>}
      {children}
    </main>
  </div>
)

export default withRouter(connect(mapStateToProps)(Layout))
