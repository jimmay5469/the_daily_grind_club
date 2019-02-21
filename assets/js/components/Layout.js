import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { flowRight as compose } from 'lodash'

const ensureLoggedIn = compose(
  connect(({ stravaId, loginUrl }) => ({ stravaId, loginUrl })),
  (Component) =>
    (props) => props.stravaId
      ? <Component {...props} />
      : <>
        <nav className='navbar has-shadow'>
          <div className='container'>
            <div className='navbar-brand'>
              <div className='navbar-item'>
                <h1 className='title has-text-weight-normal'>
                  <Link to='/'>The Daily Grind Club</Link>
                </h1>
              </div>
            </div>
          </div>
        </nav>
        <main className='section'>
          <div className='container'>
            <a href={props.loginUrl} className='button is-primary'>
              <span className='icon'>
                <i className='fab fa-strava' />
              </span>
              <span>Login with Strava</span>
            </a>
          </div>
        </main>
      </>
)

const ensureAuthorized = compose(
  connect(({ isAuthorized, loginUrl }) => ({ isAuthorized, loginUrl })),
  (Component) =>
    (props) => props.isAuthorized
      ? <Component {...props} />
      : <>
        <nav className='navbar has-shadow'>
          <div className='container'>
            <div className='navbar-brand'>
              <div className='navbar-item'>
                <h1 className='title has-text-weight-normal'>
                  <Link to='/'>The Daily Grind Club</Link>
                </h1>
              </div>
            </div>
          </div>
        </nav>
        <main className='section'>
          <div className='container'>
            <div>You need to join <a href='https://www.strava.com/clubs/thedailygrindclub'>The Daily Grind Club</a> on Strava to use this site.</div>
            <div>Already joined? <a href={props.loginUrl}>Try logging in with Strva again.</a></div>
          </div>
        </main>
      </>
)

const ensureLoaded = compose(
  connect(({ athletes }) => ({ athletes })),
  (Component) =>
    (props) => props.athletes
      ? <Component {...props} />
      : <div className='hero is-fullheight'>
        <div className='hero-body'>
          <div className='container'>
            <div className='columns is-centered is-mobile'>
              <div className='column is-narrow'>
                <span className='icon is-large'>
                  <i className='fas fa-2x fa-sync-alt' />
                </span>
                <span className='icon is-large'>
                  <i className='fab fa-2x fa-strava' />
                </span>
                <span className='icon is-large'>
                  <i className='far fa-2x fa-calendar-alt' />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
)

const mapStateToProps = ({ connected, hamburgerMenuOpen, logoutUrl }) => ({
  connected,
  hamburgerMenuOpen,
  logoutUrl
})

const mapDispatchToProps = (dispatch) => ({
  onHamburgerClick () {
    dispatch({ type: 'HAMBURGER_CLICK' })
  }
})

const Layout = ({ children, connected, hamburgerMenuOpen, logoutUrl, onHamburgerClick }) => (
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
              <Link to='/'>Home</Link>
            </div>
            <div className='navbar-item'>
              <a href={logoutUrl}>Logout</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    {!connected && <div className='notification is-radiusless is-marginless is-paddingless has-text-centered'><span className='icon'><i className='fas fa-redo-alt' /></span><a href={window.location.href}>Refresh to get the latest activities.</a></div>}
    <main className='section'>
      <div className='container'>
        {children}
      </div>
    </main>
  </>
)

export default compose(
  ensureLoggedIn,
  ensureAuthorized,
  ensureLoaded,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Layout)
