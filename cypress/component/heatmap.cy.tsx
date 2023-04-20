import Heatmap from "../../components/heatmap";
import {CalculatedStartDay} from "../../util/date";


describe('heatmap.cy.tsx', () => {
  it('heatmap render', () => {
    let startDate = CalculatedStartDay()
    cy.viewport(1000, 200)
    cy.mount(<Heatmap color="#ffffff" data={[]} startDate={startDate} endDate={new Date()}/>)
  })
})
