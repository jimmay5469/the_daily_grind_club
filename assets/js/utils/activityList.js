import _ from 'lodash'
import moment from 'moment'

function getActivitiesWithDay (activities) {
  return _.map(activities, (activity) => ({ ...activity, day: moment(activity.startDateLocal.slice(0, 10)) }))
}

export function getTodayActivities (activities) {
  activities = getActivitiesWithDay(activities)
  return _.filter(activities, ({ day }) => day.isBetween(moment().startOf('day'), moment(), 'day', '[]'))
}

export function getWeekActivities (activities) {
  activities = getActivitiesWithDay(activities)
  return _.filter(activities, ({ day }) => day.isBetween(moment().startOf('isoWeek'), moment(), 'day', '[]'))
}

export function getYearActivities (activities) {
  activities = getActivitiesWithDay(activities)
  return _.filter(activities, ({ day }) => day.isBetween(moment().startOf('year'), moment(), 'day', '[]'))
}
