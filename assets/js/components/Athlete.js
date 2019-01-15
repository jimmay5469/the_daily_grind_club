import React from 'react'
import moment from 'moment'
import _ from 'lodash'

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

export default ({ athlete: { firstName, lastName, activities } }) => {
  activities = _.map(activities, (activity) => ({ ...activity, day: moment(activity.startDateLocal.slice(0, 10)) }))
  const todayActivities = _.filter(activities, ({ day }) => day.isBetween(startOfDay, today, 'day', '[]'))
  const weekActivities = _.filter(activities, ({ day }) => day.isBetween(startOfWeek, today, 'day', '[]'))
  const yearActivities = _.filter(activities, ({ day }) => day.isBetween(startOfYear, today, 'day', '[]'))
  const activityTypes = _.chain(yearActivities)
    .groupBy('type')
    .map((activities) => ({
      type: activities[0].type,
      seconds: _.sumBy(activities, 'elapsedTime')
    }))
    .sortBy('seconds')
    .reverse()
    .value()

  return (
    <>
      <h2>
        {firstName} {lastName}
      </h2>
      <div>
        Today: <input type='checkbox' disabled={true} checked={todayActivities.length > 0} /> ({Duration(_.sumBy(todayActivities, 'elapsedTime'))})&nbsp;
        Week: {Object.keys(_.groupBy(weekActivities, 'day')).length}/{dayOfWeek} ({Duration(_.sumBy(weekActivities, 'elapsedTime'))})&nbsp;
        Year: {Object.keys(_.groupBy(yearActivities, 'day')).length}/{dayOfYear} ({Duration(_.sumBy(yearActivities, 'elapsedTime'))})&nbsp;
      </div>
      <ul>
        {_.map(activityTypes, ({ type, seconds }) => (
          <li key={type}>
            {type} ({Duration(seconds)})
          </li>
        ))}
      </ul>
    </>
  )
}
