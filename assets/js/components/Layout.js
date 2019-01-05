import React from 'react'

export default ({ children, loginUrl, logoutUrl, athleteId, athletes }) => (
  <>
    <header>
      <section className='container'>
        {athleteId && <a href={logoutUrl}>Logout</a>}
        <h1 className='phx-logo'>
          The Daily Grind Club
        </h1>
      </section>
    </header>
    <main role='main' className='container'>
      {!athleteId && <a href={loginUrl}>Connect to Strava</a>}
      {athleteId && !athletes.length && <span>You need to join <a href="https://www.strava.com/clubs/thedailygrindclub">The Daily Grind Club</a> on Strava to use this site.</span>}
      {children}
    </main>
  </>
)
