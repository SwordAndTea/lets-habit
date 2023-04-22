import Select from "../../components/select";

describe('select.cy.tsx', () => {
  it('select', () => {
    cy.mount((
      <div className="flex" style={{width:500, height:500}}>
        <Select
          className="m-auto"
          options={["option1", "option2", "option3"]}
          defaultValue="option1"
        />
      </div>
    ))
  })
})
