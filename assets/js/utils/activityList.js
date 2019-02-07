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

export function getCurrentStreak (activities) {
  activities = getActivitiesWithDay(activities)
  const todayIsActive = getTodayActivities(activities).length > 0
  const today = moment().startOf('day')
  const days = _.chain(activities).thru(getYearActivities).map(({ day }) => day.format()).uniq().value()
  const streakWithoutToday = getStreak(moment(today).subtract(1, 'days'), days)

  if (todayIsActive) {
    return streakWithoutToday + 1
  } else {
    return streakWithoutToday
  }
}

function getStreak (from, days) {
  if (_.includes(days, from.format())) {
    return getStreak(moment(from).subtract(1, 'days'), days) + 1
  } else {
    return 0
  }
}
