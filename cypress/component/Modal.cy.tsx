import {Modal} from "../../components/modal";
import {useState} from "react";

describe('Modal.cy.tsx', () => {
  it('playground', () => {
    let TestModalView = () => {
      const [showModal, setShowModel] = useState(false)
      return (
        <div className="flex" style={{width:500, height:500}}>
          <button className="m-auto" onClick={()=>{setShowModel(true)}}>
            show modal
          </button>
          {showModal && (
            <Modal onClick={()=>{setShowModel(false)}}>
              <div className="w-20 h-20"></div>
            </Modal>
          )}
        </div>
      )
    }

    cy.mount((
      <TestModalView />
    ))
  })
})
