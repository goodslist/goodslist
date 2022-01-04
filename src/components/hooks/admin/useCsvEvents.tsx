import { useState } from 'react'
import { GetStaticPropsContext } from 'next'
import { CSVReader } from 'react-papaparse'
import React, { Component } from 'react'

type newEvent = {
  content_id: number
  event_name: string
  date: string
  url?: string
  content_id2?: number
  content_id3?: number
}

export const useCsvEvents = () => {
  const [events, setEvents] = useState<newEvent[]>([])

  const handleOnDrop = (data: any) => {
    const newEvents: newEvent[] = []
    data.map((event: any, index: number) => {
      const newEvent: newEvent = {
        content_id: event.data[0],
        event_name: event.data[1],
        date: event.data[2],
        url: event.data[3],
        content_id2: event.data[4],
        content_id3: event.data[5],
      }

      newEvents.push(newEvent)
    })

    //最後に余分な1行が追加されるのでそれを消す
    newEvents.pop()
    // console.log(newContents)
    setEvents(newEvents)
    // console.log('---------------------------')
    // console.log(data)
    // console.log('---------------------------')
    // console.log(data[0].data[0], data[0].data[1], data[0].data[2])
    // console.log(data[8].data[0], data[8].data[1], data[8].data[2])
  }

  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.log(err)
  }

  const handleOnRemoveFile = (data: any) => {
    console.log('---------------------------')
    console.log(data)
    console.log('---------------------------')
  }
  const csvDragDrop: JSX.Element = (
    <CSVReader
      onDrop={handleOnDrop}
      onError={handleOnError}
      addRemoveButton
      removeButtonColor='#659cef'
      onRemoveFile={handleOnRemoveFile}
    >
      <span>Drop CSV file here or click to upload.</span>
    </CSVReader>
  )

  return [csvDragDrop, events] as const
}
