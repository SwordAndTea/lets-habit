import {GenGradientColor} from "../util/color";
import {DateToDateStr} from "../util/date";
import React from "react";

interface HeatmapData {
  date: Date
  value: number
}

interface HeatmapProps extends React.SVGAttributes<SVGElement> {
  startDate: Date
  endDate: Date
  data: HeatmapData[] | null
  color: string /*hex rgb color*/
}

// Heatmap return a calendar heat map
// TODO:
//  1. add hover popup message
export default function Heatmap(props: HeatmapProps) {
  let {startDate, endDate, data, color, ...svgProps} = props
  let startDay = startDate.getDay()
  let endDay = endDate.getDay()
  let numberOfDays = (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000)
  let middleColumnNum = (numberOfDays - (7 - startDay) - endDay) / 7
  let totalColumnNum = middleColumnNum + (startDay > 0 ? 1 : 0) + (endDay < 6 ? 1 : 0)

  let verticalSpace = 2
  let horizontalSpace = 2
  let rectSideLength = 16
  let gradientColorCount = 9
  let lightColorCount = 4
  let gradientColor = GenGradientColor(color, lightColorCount, gradientColorCount)
  gradientColor = gradientColor.filter((value, index) => {
    return index % 2 == 0 //only pick half gradient color
  })
  let viewBoxWidth = totalColumnNum * rectSideLength + (totalColumnNum - 1) * horizontalSpace
  let viewBoxHeight = 7 * rectSideLength + (7 - 1) * verticalSpace

  // map data into dict get get max value
  let dataMap = new Map()
  let maxValue = 0
  if (data != null) {
    for (let d of data) {
      dataMap.set(DateToDateStr(d.date), d.value)
      if (d.value > maxValue) {
        maxValue = d.value
      }
    }
  }

  let columns = []
  let currenDate = new Date(startDate.getTime())
  for (let i = 0; i < totalColumnNum; i++) {
    let rows = []
    let startIndex = 0
    let endIndex = 7

    if (i == 0) {
      startIndex = startDay
    } else if (i == totalColumnNum - 1) {
      endIndex = endDay + 1
    }

    // construct rects
    for (let j = startIndex; j < endIndex; j++) {
      let dataStr = DateToDateStr(currenDate)
      let value = dataMap.get(dataStr)
      let rgb = {
        r: 238,
        g: 238,
        b: 238
      } // default gray color

      // calculate color if current date has a value
      if (value !== undefined && maxValue != 0) {
        let index = Math.floor(value * gradientColor.length / maxValue) - 1
        rgb = gradientColor[index]
      }

      rows.push(
        <rect
          key={dataStr}
          x="0"
          y={(j + 1) * rectSideLength + j * verticalSpace}
          width={rectSideLength}
          height={rectSideLength}
          rx="2"
          ry="2"
          fill={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
          className={"bg-gray"}
        />
      )
      currenDate.setDate(currenDate.getDate() + 1)
    }

    columns.push(
      <g
        key={`column-${i}`}
        transform={`translate(${i * (rectSideLength + horizontalSpace)}, 0)`}
      >
        {rows}
      </g>)
  }

  return <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
    {...svgProps}
  >
    {columns}
  </svg>
}


