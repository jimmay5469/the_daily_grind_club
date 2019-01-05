import React from 'react'
import _ from 'lodash'
import moment from 'moment'

const dayOfYear = moment().dayOfYear()

const athlete = ({stravaId, firstName, lastName, activeDays}) =>{
  const totalMinutes = _.sumBy(activeDays, 'minutes')

  return (
    <div key={stravaId}>
      <strong>{firstName} {lastName}</strong>: {activeDays.length}/{dayOfYear} days this year ({Math.floor( totalMinutes / 60 )} hours {totalMinutes % 60} minutes)
    </div>
  )
}

export default ({ athletes }) => (
  <>
    {_.map(athletes, athlete)}
  </>
)
