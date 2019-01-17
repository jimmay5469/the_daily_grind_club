import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

const mapStateToProps = ({ loginUrl, logoutUrl, stravaId, athletes }) => {
  return {
    loginUrl,
    logoutUrl,
    stravaId,
    athletes
  }
}

const Layout = ({ children, loginUrl, logoutUrl, stravaId, athletes }) => (
  <>
    <header>
      <section className='container'>
        {stravaId && !!athletes.length && <a href={logoutUrl}>Logout</a>}
        <h1 className='phx-logo'>
          <Link to="/">The Daily Grind Club</Link>
        </h1>
      </section>
    </header>
    <main role='main' className='container'>
      {!stravaId && <a href={loginUrl}>Login with Strava</a>}
      {stravaId && !athletes.length && <div>You need to join <a href="https://www.strava.com/clubs/thedailygrindclub">The Daily Grind Club</a> on Strava to use this site.</div>}
      {stravaId && !athletes.length && <div>Already joined? <a href={loginUrl}>Try logging in with Strva again.</a></div>}
      {children}
    </main>
  </>
)

export default withRouter(connect(mapStateToProps)(Layout))
