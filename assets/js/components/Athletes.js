import React from 'react'
import _ from 'lodash'
import moment from 'moment'

const today = moment()
const dayOfWeek = moment(today).isoWeekday()
const dayOfYear = moment(today).dayOfYear()
const startOfWeek = moment(today).startOf('isoWeek')
const startOfYear = moment(today).startOf('year')

const Duration = (minutes) => {
  const hours = Math.floor( minutes / 60 )

  return (
    <>
      {!!hours && `${hours}h `}{minutes % 60}m
    </>
  )
}

const Athlete = ({id, firstName, lastName, today, weekActiveDays, yearActiveDays, latestActivity}) => (
  <tr key={id}>
    <td>{firstName} {lastName}</td>
    <td><input type='checkbox' disabled={true} checked={today.minutes > 0} />{!!today.minutes && <>&nbsp;({ Duration(today.minutes) })</>}</td>
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
                const week = _.filter(athlete.activeDays, ({ day }) => moment(day).isBetween(startOfWeek, today, 'day', '[]'))
                const year = _.filter(athlete.activeDays, ({ day }) => moment(day).isBetween(startOfYear, today, 'day', '[]'))

                return Object.assign({}, athlete, {
                  today: _.find(athlete.activeDays, ({ day }) => moment(day).isSame(today, 'day')) || { minutes: 0 },
                  weekActiveDays: week.length,
                  yearActiveDays: year.length,
                  latestActivity: _.get(athlete.activities.reverse(), '[0]')
                })
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
                  <td>{moment(athlete.lastFetch).fromNow()}</td>
                  <td>{moment(athlete.lastVisit).fromNow()}</td>
                </tr>
              ))
              .value()
          }
        </tbody>
      </table>
    }
  </>
)
