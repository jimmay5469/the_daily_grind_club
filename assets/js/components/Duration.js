import React from 'react'

export default ({ seconds }) => {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  return (
    <>
      {!!hours && `${hours}h `}{minutes % 60}m
    </>
  )
}
