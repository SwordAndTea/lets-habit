import {Tooltip} from "../../components/tooltip";

describe('tooltip.cy.tsx', () => {
  it('tooltip', () => {
    cy.mount((
      <div className="flex" style={{width:500, height:500}}>
        <Tooltip text="test" direction="top" className="m-auto">
          <div className="w-4 h-4 bg-black"></div>
        </Tooltip>
        <Tooltip text="test" direction="right" className="m-auto">
          <div className="w-4 h-4 bg-black"></div>
        </Tooltip>
        <Tooltip
          text="this is long long long long long long long text"
          direction="top"
          className="m-auto"
          tipContainerClassName="w-[200px]"
        >
          <div className="w-4 h-4 bg-black"></div>
        </Tooltip>
        <Tooltip text="test" direction="bottom" className="m-auto">
          <div className="w-4 h-4 bg-black"></div>
        </Tooltip>
        <Tooltip text="test" direction="left" className="m-auto">
          <div className="w-4 h-4 bg-black"></div>
        </Tooltip>

      </div>
    ))
    // cy.reload()
  })
})
