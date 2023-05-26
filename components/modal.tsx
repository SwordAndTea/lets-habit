import React from "react";

interface ModalProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  maskClassName?: string
  containerClassName?: string
  onCancel?: () => void
  cancelBtnStyle?: "primary" | "alter"
  onConfirm?: () => void
  confirmBtnStyle?: "primary" | "alter"
  onMaskClick?: () => void
}

export function Modal(props: ModalProps) {
  const {
    maskClassName,
    containerClassName,
    onCancel,
    cancelBtnStyle,
    onConfirm,
    confirmBtnStyle,
    onMaskClick,
    ...otherProps
  } = props

  let finalClickMaskHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMaskClick) {
      onMaskClick()
    }
  }

  return (
    /*mask*/
    <div
      className={`fixed z-50 top-0 right-0 bottom-0 left-0 flex bg-gray-500/50 ${maskClassName}`}
      onClick={finalClickMaskHandler}
      {...otherProps}
    >
      {/*container*/}
      <div
        className={`relative m-auto flex flex-col p-4 rounded-xl bg-white overflow-hidden animate-pop-in ${containerClassName}`}>
        {/*{closable && (*/}
        {/*  <button className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gray-300 flex" onClick={onClose}>*/}
        {/*    <PlusIcon fill="gray" className="m-auto rotate-45 w-3 h-3"/>*/}
        {/*  </button>*/}
        {/*)}*/}
        {props.children}
        <div className="flex justify-end space-x-3 mt-4">
          {onCancel && (
            <button
              className={cancelBtnStyle == "alter" ? "alter-btn" : "primary-btn"}
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          {onConfirm && (
            <button
              className={confirmBtnStyle == "alter" ? "alter-btn" : "primary-btn"}
              onClick={onConfirm}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
