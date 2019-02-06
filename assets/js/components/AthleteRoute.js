import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import Duration from './Duration'
import Timestamp from './Timestamp'
import {
  getTodayActivities,
  getWeekActivities,
  getYearActivities
} from '../utils/activityList'

const mapStateToProps = ({ athletes }, { match: { params: { id } } }) => {
  const athlete = _.find(athletes, { 'stravaId': Number(id) })
  const activities = athlete ? athlete.activities : []
  const yearActivities = getYearActivities(activities)

  return {
    athlete,
    todayActivities: getTodayActivities(activities),
    weekActivities: getWeekActivities(activities),
    yearActivities,
    activityTypes: _.chain(yearActivities)
      .groupBy('type')
      .map((activities) => ({
        type: activities[0].type,
        seconds: _.sumBy(activities, 'movingTime')
      }))
      .sortBy('seconds')
      .reverse()
      .value(),
    dayOfWeek: moment().isoWeekday(),
    dayOfYear: moment().dayOfYear()
  }
}

const AthleteRoute = ({
  athlete,
  todayActivities,
  weekActivities,
  yearActivities,
  activityTypes,
  dayOfWeek,
  dayOfYear
}) => {
  if (!athlete) {
    return (
      <div>
        Athlete not found!
      </div>
    )
  }

  return (
    <>
      <div className='columns'>
        <div className='column'>
          <h2 className='title is-3'>{athlete.firstName} {athlete.lastName}</h2>
          <div>
        Today: <input type='checkbox' disabled checked={todayActivities.length > 0} /> (<Duration seconds={_.sumBy(todayActivities, 'movingTime')} />)&nbsp;
        Week: {Object.keys(_.groupBy(weekActivities, 'day')).length}/{dayOfWeek} (<Duration seconds={_.sumBy(weekActivities, 'movingTime')} />)&nbsp;
        Year: {Object.keys(_.groupBy(yearActivities, 'day')).length}/{dayOfYear} (<Duration seconds={_.sumBy(yearActivities, 'movingTime')} />)
          </div>
        </div>
      </div>
      <div className='columns'>
        <div className='column'>
          <h3 className='title is-4'>Activity Types</h3>
          {_.map(activityTypes, ({ type, seconds }) => (
            <div key={type}>
              {type} (<Duration seconds={seconds} />)
            </div>
          ))}
        </div>
      </div>
      <div className='columns'>
        <div className='column'>
          <h3 className='title is-4'>Latest Activities</h3>
          {yearActivities.slice(-5).reverse().map((activity) => (
            <div key={activity.id}>
              {activity.type} -&nbsp;
              <strong>{activity.name}</strong> -&nbsp;
              <Timestamp value={activity.startDate} />&nbsp;
          (<Duration seconds={activity.movingTime} />)
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps)(AthleteRoute)
