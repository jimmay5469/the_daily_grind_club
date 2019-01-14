import React from 'react'
import _ from 'lodash'
import moment from 'moment'

moment.relativeTimeThreshold('M', 12)
moment.relativeTimeThreshold('d', 30)
moment.relativeTimeThreshold('h', 24)
moment.relativeTimeThreshold('m', 60)
moment.relativeTimeThreshold('s', 60)
moment.relativeTimeThreshold('ss', 1)

const today = moment()
const dayOfWeek = moment(today).isoWeekday()
const dayOfYear = moment(today).dayOfYear()
const startOfDay = moment(today).startOf('day')
const startOfWeek = moment(today).startOf('isoWeek')
const startOfYear = moment(today).startOf('year')

const Duration = (seconds) => {
  const minutes = Math.floor( seconds / 60 )
  const hours = Math.floor( minutes / 60 )

  return (
    <>
      {!!hours && `${hours}h `}{minutes % 60}m
    </>
  )
}

const Athlete = ({id, firstName, lastName, todaySeconds, weekActiveDays, yearActiveDays, latestActivity}) => (
  <tr key={id}>
    <td>{firstName} {lastName}</td>
    <td><input type='checkbox' disabled={true} checked={todaySeconds > 0} />{!!todaySeconds && <>&nbsp;({ Duration(todaySeconds) })</>}</td>
    <td>{weekActiveDays}/{dayOfWeek}</td>
    <td>{yearActiveDays}/{dayOfYear}</td>
    <td>{latestActivity && moment(latestActivity.startDate).add(latestActivity.elapsedTime, 'seconds').fromNow()}</td>
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
                const activities = _.map(athlete.activities, (activity) => ({ ...activity, day: moment(activity.startDateLocal.slice(0, 10)) }))
                const todayActivities = _.filter(activities, ({ day }) => day.isBetween(startOfDay, today, 'day', '[]'))
                const weekActivities = _.filter(activities, ({ day }) => day.isBetween(startOfWeek, today, 'day', '[]'))
                const yearActivities = _.filter(activities, ({ day }) => day.isBetween(startOfYear, today, 'day', '[]'))
                const week = _.groupBy(weekActivities, 'day')
                const year = _.groupBy(yearActivities, 'day')

                return {
                  ...athlete,
                  todaySeconds: _.sumBy(todayActivities, 'movingTime'),
                  weekActiveDays: Object.keys(week).length,
                  yearActiveDays: Object.keys(year).length,
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
