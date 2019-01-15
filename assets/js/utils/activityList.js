import _ from 'lodash'
import moment from 'moment'

const today = moment()
const startOfDay = moment(today).startOf('day')
const startOfWeek = moment(today).startOf('isoWeek')
const startOfYear = moment(today).startOf('year')

function getActivitiesWithDay(activities) {
  return _.map(activities, (activity) => ({ ...activity, day: moment(activity.startDateLocal.slice(0, 10)) }))
}

export function getTodayActivities(activities) {
  activities = getActivitiesWithDay(activities)
  return _.filter(activities, ({ day }) => day.isBetween(startOfDay, today, 'day', '[]'))
}

export function getWeekActivities(activities) {
  activities = getActivitiesWithDay(activities)
  return _.filter(activities, ({ day }) => day.isBetween(startOfWeek, today, 'day', '[]'))
}

export function getYearActivities(activities) {
  activities = getActivitiesWithDay(activities)
  return _.filter(activities, ({ day }) => day.isBetween(startOfYear, today, 'day', '[]'))
}
