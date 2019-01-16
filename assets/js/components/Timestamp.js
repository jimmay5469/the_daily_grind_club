import React from 'react'
import moment from 'moment'

export default ({ value }) => moment(value).fromNow()
