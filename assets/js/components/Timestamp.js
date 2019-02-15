import React from 'react'
import moment from 'moment'

moment.relativeTimeThreshold('M', 12)
moment.relativeTimeThreshold('d', 30)
moment.relativeTimeThreshold('h', 24)
moment.relativeTimeThreshold('m', 60)
moment.relativeTimeThreshold('s', 60)
moment.relativeTimeThreshold('ss', 1)

export default class extends React.Component {
  componentDidMount () {
    this.interval = setInterval(() => this.forceUpdate(), 1000)
  }
  componentWillUnmount () {
    clearInterval(this.interval)
  }
  render () {
    const today = moment().startOf('day')
    const timestamp = moment(this.props.value)
    if (today.isSame(timestamp, 'day')) {
      return timestamp.fromNow()
    } else {
      return timestamp.startOf('day').from(today).replace('a day ago', 'yesterday')
    }
  }
}
