import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import moment from 'moment'
import Duration from './Duration'
import Timestamp from './Timestamp'
import ColorHash from 'color-hash'
import {
  getTodayActivities,
  getWeekActivities,
  getYearActivities,
  getCurrentStreak
} from '../utils/activityList'

const colorHash = new ColorHash({ saturation: 1 })

const mapStateToProps = ({ athletes }) => {
  const athleteList = _.chain(athletes)
    .map((athlete) => {
      const todayActivities = getTodayActivities(athlete.activities)
      const weekActivities = getWeekActivities(athlete.activities)
      const yearActivities = getYearActivities(athlete.activities)

      return {
        ...athlete,
        latestActivity: _.get(yearActivities.reverse(), '[0]'),
        todaySeconds: _.sumBy(todayActivities, 'movingTime'),
        weekActiveDays: Object.keys(_.groupBy(weekActivities, 'day')).length,
        streak: getCurrentStreak(athlete.activities),
        yearSeconds: _.sumBy(yearActivities, 'movingTime'),
        activityTypes: _.chain(yearActivities)
          .groupBy('type')
          .map((activities, type) => ({
            type,
            seconds: _.sumBy(activities, 'movingTime')
          }))
          .sortBy('seconds')
          .reverse()
          .value()
      }
    })
    .sortBy(['latestActivity.startDate'])
    .reverse()
    .value()

  return {
    athleteList,
    activityTypes: _.chain(athleteList)
      .map((athlete) => athlete.activityTypes.map((activityType) => ({ ...activityType, athlete })))
      .flatten()
      .groupBy('type')
      .map((athleteActivity, type) => ({
        type,
        topAthlete: _.maxBy(athleteActivity, 'seconds'),
        totalSeconds: _.sumBy(athleteActivity, 'seconds')
      }))
      .sortBy('totalSeconds')
      .reverse()
      .value(),
    dayOfWeek: moment().isoWeekday()
  }
}

const AthleteListRoute = ({
  athleteList,
  activityTypes,
  dayOfWeek
}) => (
  <div className='columns'>
    <div className='column'>
      {!!athleteList.length && <h3 className='title is-4'>Latest Activity</h3>}
      {athleteList.map(({ stravaId, firstName, lastName, latestActivity, todaySeconds, weekActiveDays, streak, yearSeconds, activityTypes }) => (
        <div key={stravaId}>
          <div className='stripe'>
            {_.map(activityTypes, ({ type, seconds }) => (
              <div key={type} style={{ width: `${100 * seconds / yearSeconds}%`, backgroundColor: colorHash.hex(type) }} />
            ))}
          </div>
          <div className='box is-radiusless'>
            <div className='columns is-mobile'>
              <div className='column'>
                <strong><Link to={`/athletes/${stravaId}`} className='has-text-dark'>{firstName} {lastName}</Link></strong>
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
                        : <span className='tag is-dark'>No</span>
                      }
                    </div>
                  </div>
                  <div className='control'>
                    <div className='tags has-addons'>
                      <span className='tag'>Week</span>
                      {weekActiveDays === dayOfWeek
                        ? <span className='tag is-success'>{weekActiveDays}/{dayOfWeek}</span>
                        : <span className='tag is-dark'>{weekActiveDays}/{dayOfWeek}</span>
                      }
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
        </div>
      ))
      }
    </div>
    <div className='column is-narrow'>
      {!!activityTypes.length && <h3 className='title is-4'>Activity Types</h3>}
      {activityTypes.map(({ type, topAthlete: { athlete, seconds }, totalSeconds }) => (
        <div key={type} className='box is-radiusless is-shadowless is-paddingless'>
          <div>
            <div className='type-swatch' style={{ backgroundColor: colorHash.hex(type) }} /> <strong>{_.words(type).join(' ')}</strong> (<Duration seconds={totalSeconds} />)
          </div>
          <div>
          Leader: {athlete.firstName} {athlete.lastName} (<Duration seconds={seconds} />)
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default connect(mapStateToProps)(AthleteListRoute)
