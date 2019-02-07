import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import moment from 'moment'
import Duration from './Duration'
import Timestamp from './Timestamp'
import {
  getTodayActivities,
  getWeekActivities,
  getYearActivities,
  getCurrentStreak
} from '../utils/activityList'

const mapStateToProps = ({ athletes }) => ({
  athleteList: _.chain(athletes)
    .map((athlete) => {
      const todayActivities = getTodayActivities(athlete.activities)
      const weekActivities = getWeekActivities(athlete.activities)
      const yearActivities = getYearActivities(athlete.activities)

      return {
        ...athlete,
        latestActivity: _.get(yearActivities.reverse(), '[0]'),
        todaySeconds: _.sumBy(todayActivities, 'movingTime'),
        weekActiveDays: Object.keys(_.groupBy(weekActivities, 'day')).length,
        streak: getCurrentStreak(athlete.activities)
      }
    })
    .sortBy(['latestActivity.startDate'])
    .reverse()
    .value(),
  dayOfWeek: moment().isoWeekday()
})

const AthleteListRoute = ({
  athleteList,
  dayOfWeek
}) => (
  <div className='columns is-centered'>
    <div className='column is-three-fifths'>
      {!!athleteList.length && <h3 className='title is-4'>Latest Activity</h3>}
      {!!athleteList.length &&
      athleteList.map(({ stravaId, firstName, lastName, latestActivity, todaySeconds, weekActiveDays, streak }) => (
        <div key={stravaId} className='box'>
          <div className='columns is-mobile'>
            <div className='column'>
              <Link to={`/athletes/${stravaId}`}>{firstName} {lastName}</Link>
            </div>
            <div className='column has-text-right'>
              {latestActivity && <Timestamp value={latestActivity.startDate} />}
            </div>
          </div>
          <div className='columns'>
            <div className='column'>
              <div className='field is-grouped is-grouped-multiline'>
                <div className='control'>
                  <div className='tags has-addons'>
                    <span className='tag'>Today</span>
                    {todaySeconds > 0
                      ? <span className='tag is-success'><Duration seconds={todaySeconds} /></span>
                      : <span className='tag is-danger'>No</span>
                    }
                  </div>
                </div>
                <div className='control'>
                  <div className='tags has-addons'>
                    <span className='tag'>Week</span>
                    {weekActiveDays === dayOfWeek && <span className='tag is-success'>{weekActiveDays}/{dayOfWeek}</span>}
                    {weekActiveDays === 0 && <span className='tag is-danger'>{weekActiveDays}/{dayOfWeek}</span>}
                    {weekActiveDays !== dayOfWeek && weekActiveDays !== 0 && <span className='tag is-warning'>{weekActiveDays}/{dayOfWeek}</span>}
                  </div>
                </div>
                {!!streak && <div className='control'>
                  <div className='tags has-addons'>
                    <span className='tag'>Streak</span>
                    <span className='tag is-success'>{streak}</span>
                  </div>
                </div>}
              </div>
            </div>
          </div>
        </div>
      ))
      }
    </div>
  </div>
)

export default connect(mapStateToProps)(AthleteListRoute)
