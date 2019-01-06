import React from 'react'
import _ from 'lodash'
import moment from 'moment'

const today = moment()
const dayOfWeek = moment(today).isoWeekday()
const dayOfYear = moment(today).dayOfYear()
const startOfWeek = moment(today).startOf('isoWeek')
const startOfYear = moment(today).startOf('year')

const athlete = ({stravaId, firstName, lastName, today, weekActiveDays, yearActiveDays, weekMinutes, yearMinutes}) => (
  <div key={stravaId}>
    <strong>{firstName} {lastName}</strong>&nbsp;
    Today: <input type='checkbox' disabled={true} checked={today.minutes > 0} /> ({Math.floor( today.minutes / 60 )}h {today.minutes % 60}m)&nbsp;
    Week: {weekActiveDays}/{dayOfWeek} ({Math.floor( weekMinutes / 60 )}h {weekMinutes % 60}m)&nbsp;
    Year: {yearActiveDays}/{dayOfYear} ({Math.floor( yearMinutes / 60 )}h {yearMinutes % 60}m)&nbsp;
  </div>
)

export default ({ athletes }) => (
  <>
    {
      _.chain(athletes)
        .map((athlete) => {
          const week = _.filter(athlete.activeDays, ({ day }) => moment(day).isBetween(startOfWeek, today, 'day', '[]'))
          const year = _.filter(athlete.activeDays, ({ day }) => moment(day).isBetween(startOfYear, today, 'day', '[]'))

          return Object.assign({}, athlete, {
            today: _.find(athlete.activeDays, ({ day }) => moment(day).isSame(today, 'day')) || { minutes: 0 },
            weekActiveDays: week.length,
            yearActiveDays: year.length,
            weekMinutes: _.sumBy(week, 'minutes'),
            yearMinutes: _.sumBy(year, 'minutes')
          })
        })
        .sortBy(['weekActiveDays', 'weekMinutes'])
        .reverse()
        .map(athlete)
        .value()
    }
  </>
)
