import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import Heatmap from "./heatmap"

describe("TestHeatmap", () => {
  it('should create a heatmap',  () => {
    let startDay = new Date()
    let endDay = new Date()
    startDay.setDate(startDay.getDate() - 360)
    endDay.setDate(endDay.getDate() + 5)
    let date1 = new Date()
    let date2 = new Date()
    date2.setDate(date1.getDate() - 1)
    let date3 = new Date()
    date3.setDate(date1.getDate() - 2)
    let date4 = new Date()
    date4.setDate(date1.getDate() - 3)
    let date5 = new Date()
    date5.setDate(date1.getDate() - 4)

    render(<Heatmap
      startDate={startDay}
      endDate={endDay}
      data={[
        {date: date1, value: 1},
        {date: date2, value: 2},
        {date: date3, value: 3},
        {date: date4, value: 4},
        {date: date5, value: 5}
      ]}
      color={"#f78e3d"}
      width="100%"
      height={200}
      role={"heatmap"}
    />)

    const heading = screen.getByRole("heatmap")

    expect(heading).toBeInTheDocument()
  });
})
