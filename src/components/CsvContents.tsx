import { GetStaticPropsContext } from 'next'
import { CSVReader } from 'react-papaparse'
import React, { Component } from 'react'

type newContent = {
  content_name: string
  content_name_hira: string
  content_name_kana: string
}
export default class ContentsCSVReader extends Component {
  handleOnDrop = (data: any) => {
    const contents: newContent[] = []
    data.map((content: any, index: number) => {
      const newContent: newContent = {
        content_name: content.data[0],
        content_name_hira: content.data[1],
        content_name_kana: content.data[2],
      }

      contents.push(newContent)
    })

    //最後に余分な1行が追加されるのでそれを消す
    contents.pop()
    console.log(contents)
    // console.log('---------------------------')
    // console.log(data)
    // console.log('---------------------------')
    // console.log(data[0].data[0], data[0].data[1], data[0].data[2])
    // console.log(data[8].data[0], data[8].data[1], data[8].data[2])
  }

  handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.log(err)
  }

  handleOnRemoveFile = (data: any) => {
    console.log('---------------------------')
    console.log(data)
    console.log('---------------------------')
  }

  render() {
    return (
      <CSVReader
        onDrop={this.handleOnDrop}
        onError={this.handleOnError}
        addRemoveButton
        removeButtonColor='#659cef'
        onRemoveFile={this.handleOnRemoveFile}
      >
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
    )
  }
}
