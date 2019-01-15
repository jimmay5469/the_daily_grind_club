import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Link } from 'react-router-dom';
import Duration from './Duration'
import {
  getTodayActivities,
  getWeekActivities,
  getYearActivities
} from '../utils/activityList'

const today = moment()
const dayOfWeek = moment(today).isoWeekday()
const dayOfYear = moment(today).dayOfYear()

const Athlete = ({id, firstName, lastName, todaySeconds, weekActiveDays, yearActiveDays, latestActivity}) => (
  <tr key={id}>
    <td><Link to={`/athlete/${id}`}>{firstName} {lastName}</Link></td>
    <td><input type='checkbox' disabled={true} checked={todaySeconds > 0} />{!!todaySeconds && <>&nbsp;({ Duration(todaySeconds) })</>}</td>
    <td>{weekActiveDays}/{dayOfWeek}</td>
    <td>{yearActiveDays}/{dayOfYear}</td>
    <td>{latestActivity && moment(latestActivity.startDate).fromNow()}</td>
  </tr>
)

export default ({ athletes, isAdmin }) => (
  <>
    {!!athletes.length &&
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Today</th>
            <th>Week</th>
            <th>Year</th>
            <th>Latest Activity</th>
          </tr>
        </thead>
        <tbody>
          {
            _.chain(athletes)
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
              .map(Athlete)
              .value()
          }
        </tbody>
      </table>
    }
    {isAdmin &&
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Last Fetch</th>
            <th>Last Visit</th>
          </tr>
        </thead>
        <tbody>
          {
            _.chain(athletes)
              .sortBy(['lastVisit'])
              .reverse()
              .map((athlete) => (
                <tr key={athlete.id}>
                  <td>{athlete.firstName} {athlete.lastName}</td>
                  <td>{athlete.lastFetch && moment(athlete.lastFetch).fromNow()}</td>
                  <td>{athlete.lastVisit && moment(athlete.lastVisit).fromNow()}</td>
                </tr>
              ))
              .value()
          }
        </tbody>
      </table>
    }
  </>
)
