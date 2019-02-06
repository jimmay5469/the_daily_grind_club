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
  getYearActivities
} from '../utils/activityList'

const mapStateToProps = ({ athletes }) => ({
  athleteList: _.chain(athletes)
    .map((athlete) => {
      const todayActivities = getTodayActivities(athlete.activities)
      const weekActivities = getWeekActivities(athlete.activities)
      const yearActivities = getYearActivities(athlete.activities)

      return {
        ...athlete,
        todaySeconds: _.sumBy(todayActivities, 'movingTime'),
        weekActiveDays: Object.keys(_.groupBy(weekActivities, 'day')).length,
        yearActiveDays: Object.keys(_.groupBy(yearActivities, 'day')).length,
        latestActivity: _.get(yearActivities.reverse(), '[0]')
      }
    })
    .sortBy(['latestActivity.startDate'])
    .reverse()
    .value(),
  dayOfWeek: moment().isoWeekday(),
  dayOfYear: moment().dayOfYear()
})

const AthleteListRoute = ({
  athleteList,
  dayOfWeek,
  dayOfYear
}) => (
  <>
    {!!athleteList.length &&
      <table>
        <thead>
          <tr>
            <th />
            <th>Today</th>
            <th>Week</th>
            <th>Year</th>
            <th>Latest Activity</th>
          </tr>
        </thead>
        <tbody>
          {athleteList.map(({ stravaId, firstName, lastName, todaySeconds, weekActiveDays, yearActiveDays, latestActivity }) => (
            <tr key={stravaId}>
              <td><Link to={`/athletes/${stravaId}`}>{firstName} {lastName}</Link></td>
              <td><input type='checkbox' disabled checked={todaySeconds > 0} />{!!todaySeconds && <>&nbsp;(<Duration seconds={todaySeconds} />)</>}</td>
              <td>{weekActiveDays}/{dayOfWeek}</td>
              <td>{yearActiveDays}/{dayOfYear}</td>
              <td>{latestActivity && <Timestamp value={latestActivity.startDate} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    }
  </>
)

export default connect(mapStateToProps)(AthleteListRoute)
