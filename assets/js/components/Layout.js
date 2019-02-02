import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

const mapStateToProps = ({ hamburgerMenuOpen, loginUrl, logoutUrl, stravaId, athletes }) => ({
  hamburgerMenuOpen,
  loginUrl,
  logoutUrl,
  stravaId,
  athletes
})

const mapDispatchToProps = (dispatch) => ({
  onHamburgerClick() {
    dispatch({ type: 'HAMBURGER_CLICK' })
  }
})

const Layout = ({ children, hamburgerMenuOpen, loginUrl, logoutUrl, stravaId, athletes, onHamburgerClick }) => (
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
            <span></span>
            <span></span>
            <span></span>
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
        <div className='content'>
          {!stravaId && <a href={loginUrl}>Login with Strava</a>}
          {stravaId && !athletes.length && <div>You need to join <a href='https://www.strava.com/clubs/thedailygrindclub'>The Daily Grind Club</a> on Strava to use this site.</div>}
          {stravaId && !athletes.length && <div>Already joined? <a href={loginUrl}>Try logging in with Strva again.</a></div>}
          {children}
        </div>
      </div>
    </main>
  </>
)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))
