import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import Duration from './Duration'
import Timestamp from './Timestamp'
import {
  getTodayActivities,
  getWeekActivities,
  getYearActivities
} from '../utils/activityList'

const today = moment()
const dayOfWeek = moment(today).isoWeekday()
const dayOfYear = moment(today).dayOfYear()

export default ({ athlete, athlete: { firstName, lastName, activities } = {} }) => {
  if (!athlete) {
    return (
      <div>
        Athlete not found!
      </div>
    )
  }

  const todayActivities = getTodayActivities(activities)
  const weekActivities = getWeekActivities(activities)
  const yearActivities = getYearActivities(activities)
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
        Today: <input type='checkbox' disabled={true} checked={todayActivities.length > 0} /> (<Duration seconds={_.sumBy(todayActivities, 'elapsedTime')} />)&nbsp;
        Week: {Object.keys(_.groupBy(weekActivities, 'day')).length}/{dayOfWeek} (<Duration seconds={_.sumBy(weekActivities, 'elapsedTime')} />)&nbsp;
        Year: {Object.keys(_.groupBy(yearActivities, 'day')).length}/{dayOfYear} (<Duration seconds={_.sumBy(yearActivities, 'elapsedTime')} />)
      </div>
      <br />
      <h3>Activity Types</h3>
      {_.map(activityTypes, ({ type, seconds }) => (
        <div key={type}>
        {type} (<Duration seconds={seconds} />)
        </div>
      ))}
      <br />
      <h3>Latest Activities</h3>
      {yearActivities.slice(-5).reverse().map((activity) => (
        <div key={activity.id}>
          {activity.type} -&nbsp;
          <strong>{activity.name}</strong> -&nbsp;
          <Timestamp value={activity.startDate} />&nbsp;
          (<Duration seconds={activity.elapsedTime} />)
        </div>
      ))}
    </>
  )
}
