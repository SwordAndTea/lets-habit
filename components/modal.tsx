import React from "react";
import {SpinWaitIndicatorIcon} from "./icons";

interface ModalProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  maskClassName?: string
  containerClassName?: string
  onCancel?: () => void
  cancelBtnStyle?: "primary" | "alter" | "waiting"
  onConfirm?: () => void
  confirmBtnStyle?: "primary" | "alter" | "waiting"
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
        {props.children}
        <div className="flex justify-end space-x-3 mt-4">
          {onCancel && (
            <button
              className={cancelBtnStyle == "alter" ? "alter-btn w-24 h-10" : (cancelBtnStyle == "waiting" ? "wait-btn w-24 h-10" : "primary-btn w-24 h-10")}
              onClick={onCancel}
              disabled={cancelBtnStyle == "waiting"}
            >
              {cancelBtnStyle == "waiting" && <SpinWaitIndicatorIcon className="wait-btn-indicator"/>}
              <span>Cancel</span>
            </button>
          )}
          {onConfirm && (
            <button
              className={confirmBtnStyle == "alter" ? "alter-btn w-24 h-10" : (confirmBtnStyle == "waiting" ? "wait-btn w-24 h-10" : "primary-btn w-24 h-10")}
              onClick={onConfirm}
              disabled={confirmBtnStyle == "waiting"}
            >
              {confirmBtnStyle == "waiting" && <SpinWaitIndicatorIcon className="wait-btn-indicator"/>}
              <span>Confirm</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
