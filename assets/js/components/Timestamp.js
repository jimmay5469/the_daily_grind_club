import React from 'react'
import moment from 'moment'

export default class extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 1000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    return moment(this.props.value).fromNow()
  }
}
