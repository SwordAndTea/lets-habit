import {GenColorPalette} from "../util/color";
import {DateToDateStr} from "../util/date";
import React, {useRef, useState} from "react";

interface HeatmapData {
  date: Date
  value: number
}

interface HeatmapProps extends React.SVGAttributes<SVGElement> {
  startDate: Date
  endDate: Date
  data: HeatmapData[] | null
  color: string /*hex rgb color*/
  fillAll?: boolean
  singleColor?: boolean
  elementSideLength?: number
}

// Heatmap return a calendar heat map
// TODO:
//  1. add hover popup message
export default function Heatmap(props: HeatmapProps) {
  let {startDate, endDate, data, color, fillAll, singleColor, ...svgProps} = props
  let startDay = startDate.getDay()
  let endDay = endDate.getDay()
  let numberOfDays = (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000)
  let middleColumnNum = (numberOfDays - (7 - startDay) - endDay) / 7
  let totalColumnNum = middleColumnNum + (startDay > 0 ? 1 : 0) + 1

  let verticalSpace = 2
  let horizontalSpace = 2
  let rectSideLength = props.elementSideLength !== undefined ? props.elementSideLength : 10
  let viewBoxWidth = totalColumnNum * rectSideLength + (totalColumnNum + 1) * horizontalSpace
  let viewBoxHeight = 7 * rectSideLength + (7 + 1) * verticalSpace

  const cardWidth = 80
  const cardHeight = 20
  const [showCard, setShowCard] = useState(false)
  const [cardDate, setCardDate] = useState("")
  const [cardTop, setCarTop] = useState(0)
  const [cardLeft, setCarLeft] = useState(0)

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

  //
  let gradientColor: string[] = []
  if (!singleColor) {
    gradientColor = GenColorPalette(color).filter((value, index, array) => {
      return index >= 1 && index <= array.length - 2 //only pick half gradient color
    })
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
      let dateStr = DateToDateStr(currenDate)
      let value = dataMap.get(dateStr)
      let rgb = "#D3D3D3" // default gray color

      // calculate color if current date has a value
      if (fillAll) {
        rgb = color
      } else if (value !== undefined && value > 0 && maxValue != 0) {
        if (singleColor) {
          rgb = color
        } else {
          let index = Math.ceil(value * gradientColor.length / maxValue) - 1
          rgb = gradientColor[index]
        }
      }

      rows.push(
        <rect
          key={dateStr}
          x="0"
          y={verticalSpace + j * rectSideLength + j * verticalSpace}
          width={rectSideLength}
          height={rectSideLength}
          rx="2"
          ry="2"
          fill={rgb}
          className={"bg-gray hover:stroke-1 hover:stroke-gray-900"}
          data-date={dateStr}
          data-col={i}
          data-row={j}
        />
      )
      currenDate.setDate(currenDate.getDate() + 1)
    }

    columns.push(
      <g
        key={`column-${i}`}
        transform={`translate(${horizontalSpace + i * (rectSideLength + horizontalSpace)}, 0)`}
      >
        {rows}
      </g>)
  }

  const cardSpace = rectSideLength + horizontalSpace

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      onMouseOver={(e) => {
        // @ts-ignore
        if (e.target.nodeName == "svg") {
          setShowCard(false)
        }
        // @ts-ignore
        if (e.target.nodeName == "rect") {
          let target = e.target as SVGRectElement
          setShowCard(true)
          setCardDate(target.getAttribute("data-date") as string)
          let col = parseInt(target.getAttribute("data-col") as string, 10)
          let row = parseInt(target.getAttribute("data-row") as string, 10)
          let left = horizontalSpace + col * (rectSideLength + horizontalSpace) + cardSpace
          let right = left + cardWidth
          if (right > viewBoxWidth - horizontalSpace) {
            left = left - cardWidth - cardSpace - horizontalSpace
          }
          setCarLeft(left)
          let top = verticalSpace + row * rectSideLength + row * verticalSpace - (cardHeight/2-rectSideLength/2)
          let bottom = top + cardHeight
          if (top < verticalSpace) {
            top = verticalSpace
          } else if (bottom > viewBoxHeight - verticalSpace) {
            top = top - (bottom - viewBoxHeight + verticalSpace)
          }
          setCarTop(top)
        }
      }}
      {...svgProps}
      onMouseLeave={()=>{
        setShowCard(false)
      }}
    >
      {columns}
      {showCard && (
        <foreignObject className="bg-gray-700 rounded" x={cardLeft} y={cardTop} width={cardWidth} height={cardHeight}>
          <span className={"block w-full h-full flex justify-center items-center text-xs text-white"}>{cardDate}</span>
        </foreignObject>
      )}
    </svg>
  )
}


