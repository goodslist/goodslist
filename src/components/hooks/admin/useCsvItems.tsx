import { useState } from 'react'
import { GetStaticPropsContext } from 'next'
import { CSVReader } from 'react-papaparse'
import React, { Component } from 'react'

type newItem = {
  item_id: number
  group: number
  order: number
  item_name: string
  version?: string
  color?: string
  size?: string
  price: number
}

export const useCsvItems = () => {
  const [items, setItems] = useState<newItem[]>([])

  const handleOnDrop = (data: any) => {
    const newItems: newItem[] = []
    data.map((item: any, index: number) => {
      const newItem: newItem = {
        item_id: item.data[0],
        group: item.data[1],
        order: item.data[2],
        item_name: item.data[3],
        version: item.data[4],
        color: item.data[5],
        size: item.data[6],
        price: item.data[7],
      }

      newItems.push(newItem)
    })

    //最後に余分な1行が追加されるのでそれを消す
    newItems.pop()
    // console.log(newContents)
    setItems(newItems)
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

  return [csvDragDrop, items] as const
}
