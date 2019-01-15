import React from 'react'
import { Link } from "react-router-dom";

export default ({ children, loginUrl, logoutUrl, athleteId, athletes }) => (
  <>
    <header>
      <section className='container'>
        {athleteId && !!athletes.length && <a href={logoutUrl}>Logout</a>}
        <h1 className='phx-logo'>
          <Link to="/">The Daily Grind Club</Link>
        </h1>
      </section>
    </header>
    <main role='main' className='container'>
      {!athleteId && <a href={loginUrl}>Login with Strava</a>}
      {athleteId && !athletes.length && <div>You need to join <a href="https://www.strava.com/clubs/thedailygrindclub">The Daily Grind Club</a> on Strava to use this site.</div>}
      {athleteId && !athletes.length && <div>Already joined? <a href={loginUrl}>Try logging in with Strva again.</a></div>}
      {children}
    </main>
  </>
)
