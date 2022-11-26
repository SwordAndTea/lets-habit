import {DateToDateStr, GenGradientColor} from "../../util/color";

interface HeatmapData {
  date: Date
  value: number
}

interface HeatmapProps {
  width: number
  height: number
  startDate: Date
  endDate: Date
  data: HeatmapData[] | null
  color: string /*hex rgb color*/
}

// Heatmap return a calender heat map
// TODO:
//  1. add hover popup message
//  2. calculate viewBox value
export default function Heatmap(props: HeatmapProps) {
  let startDay = props.startDate.getDay()
  let endDay = props.endDate.getDay()
  let numberOfDays = (props.endDate.getTime() - props.startDate.getTime()) / (24 * 3600 * 1000)
  let middleColumnNum = (numberOfDays - (7-startDay) - endDay) / 7
  let totalColumnNum = middleColumnNum + (startDay > 0 ? 1 : 0) + (endDay < 6 ? 1 : 0)

  let verticalSpace = 2
  let horizontalSpace = 2
  let rectSideLength = 16
  let gradientColorCount = 5
  let lightColorCount = 3
  let gradientColor = GenGradientColor(props.color, lightColorCount, gradientColorCount)

  // map data into dict get get max value
  let dataMap = new Map()
  let maxValue = 0
  if (props.data != null) {
    for (let d of props.data) {
      dataMap.set(DateToDateStr(d.date), d.value)
      if (d.value > maxValue) {
        maxValue = d.value
      }
    }
  }

  let columns = []
  let currenDate = new Date(props.startDate.getTime())
  for (let i = 0; i < totalColumnNum; i++) {
    let rows = []
    let startIndex = 0
    let endIndex = 7

    if (i == 0) {
      startIndex = startDay
    } else if (i == totalColumnNum - 1) {
      endIndex = endDay + 1
    }

    for (let j = startIndex; j < endIndex; j++) {
      let dataStr = DateToDateStr(currenDate)
      let value = dataMap.get(dataStr)
      let rgb = {
        r: 190,
        g: 190,
        b: 190
      } // default gray color

      if (value !== undefined && maxValue != 0) {
        let index = Math.floor(value / maxValue)
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
    width={props.width}
    height={props.height}
  >
    {columns}
  </svg>
}


