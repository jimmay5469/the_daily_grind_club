import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

const mapStateToProps = ({ connected, hamburgerMenuOpen, loginUrl, logoutUrl, stravaId, isAuthorized }) => ({
  connected,
  hamburgerMenuOpen,
  loginUrl,
  logoutUrl,
  stravaId,
  isAuthorized
})

const mapDispatchToProps = (dispatch) => ({
  onHamburgerClick () {
    dispatch({ type: 'HAMBURGER_CLICK' })
  }
})

const Layout = ({ children, connected, hamburgerMenuOpen, loginUrl, logoutUrl, stravaId, isAuthorized, onHamburgerClick }) => (
  <>
    <nav className='navbar has-shadow'>
      <div className='container'>
        <div className='navbar-brand'>
          <div className='navbar-item'>
            <h1 className='title has-text-weight-normal'>
              <Link to='/'>The Daily Grind Club</Link>
            </h1>
          </div>
          {stravaId && isAuthorized && <a className={`navbar-burger ${hamburgerMenuOpen ? 'is-active' : ''}`} onClick={onHamburgerClick}>
            <span />
            <span />
            <span />
          </a>}
        </div>
        {stravaId && isAuthorized && <div className={`navbar-menu ${hamburgerMenuOpen ? 'is-active' : ''}`}>
          <div className='navbar-end'>
            <div className='navbar-item'>
              <Link to='/'>Home</Link>
            </div>
            <div className='navbar-item'>
              <a href={logoutUrl}>Logout</a>
            </div>
          </div>
        </div>}
      </div>
    </nav>
    {stravaId && isAuthorized && !connected && <div className='notification is-radiusless is-marginless is-paddingless has-text-centered'><span className='icon'><i className='fas fa-redo-alt' /></span><a href={window.location.href}>Refresh to get the latest activities.</a></div>}
    <main className='section'>
      <div className='container'>
        {!stravaId && <a href={loginUrl} className='button is-primary'>
          <span className='icon'>
            <i className='fab fa-strava' />
          </span>
          <span>Login with Strava</span>
        </a>}
        {stravaId && !isAuthorized && <div>You need to join <a href='https://www.strava.com/clubs/thedailygrindclub'>The Daily Grind Club</a> on Strava to use this site.</div>}
        {stravaId && !isAuthorized && <div>Already joined? <a href={loginUrl}>Try logging in with Strva again.</a></div>}
        {children}
      </div>
    </main>
  </>
)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))
