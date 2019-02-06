import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

const mapStateToProps = ({ connected, hamburgerMenuOpen, loginUrl, logoutUrl, stravaId, athletes }) => ({
  connected,
  hamburgerMenuOpen,
  loginUrl,
  logoutUrl,
  stravaId,
  athletes
})

const mapDispatchToProps = (dispatch) => ({
  onHamburgerClick () {
    dispatch({ type: 'HAMBURGER_CLICK' })
  }
})

const Layout = ({ children, connected, hamburgerMenuOpen, loginUrl, logoutUrl, stravaId, athletes, onHamburgerClick }) => (
  <>
    <nav className='navbar has-shadow'>
      <div className='container'>
        <div className='navbar-brand'>
          <div className='navbar-item'>
            <h1 className='title has-text-weight-normal'>
              <Link to='/'>The Daily Grind Club</Link>
            </h1>
          </div>
          <a className={`navbar-burger ${hamburgerMenuOpen ? 'is-active' : ''}`} onClick={onHamburgerClick}>
            <span />
            <span />
            <span />
          </a>
        </div>
        <div className={`navbar-menu ${hamburgerMenuOpen ? 'is-active' : ''}`}>
          <div className='navbar-end'>
            <div className='navbar-item'>
              {stravaId && !!athletes.length && <Link to='/'>Home</Link>}
            </div>
            <div className='navbar-item'>
              {stravaId && !!athletes.length && <a href={logoutUrl}>Logout</a>}
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main className='section'>
      <div className='container'>
        {!stravaId && <a href={loginUrl}>Login with Strava</a>}
        {stravaId && !athletes.length && <div>You need to join <a href='https://www.strava.com/clubs/thedailygrindclub'>The Daily Grind Club</a> on Strava to use this site.</div>}
        {stravaId && !athletes.length && <div>Already joined? <a href={loginUrl}>Try logging in with Strva again.</a></div>}
        {!!athletes.length && !connected && <div className='columns is-centered is-mobile'>
          <div className='column is-narrow'>
            <div className='tags has-addons'>
              <span className='tag is-danger'>Disconnected!</span>
              <span className='tag'>refresh the page to reconnect</span>
            </div>
          </div>
        </div>}
        {children}
      </div>
    </main>
  </>
)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))
