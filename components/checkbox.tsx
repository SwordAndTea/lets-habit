import React, {useState} from "react";

interface CheckboxProps {
  id: string
  checked?: boolean
  className?: string
  checkedClassName?: string
  onChange?: (checked: boolean) => void
}


export function CheckBox(props: CheckboxProps) {
  const [checked, setChecked] = useState(!!props.checked)

  return (
    <label htmlFor={props.id}
           className={`inline-block flex w-6 h-6 rounded-lg cursor-pointer border-2 ${props.className} ${checked ? props.checkedClassName : ""}`}>
      <input id={props.id}
             type="checkbox"
             className="hidden"
             checked={checked}
             onChange={(e) => {
               setChecked(e.target.checked)
               if (props.onChange) {
                 props.onChange(e.target.checked)
               }
             }}
      />
      {checked && <div className="m-auto w-3/5 h-1/3 border-2 border-white border-t-0 border-r-0 -rotate-45"/>}
    </label>
  )


  // return (
  //   <div>
  //     <input id={props.id} type="checkbox" className={`${styles.lhCheckboxInput}`} defaultChecked={props.defaultChecked}/>
  //     <label htmlFor={props.id} className={`${styles.lhCheckboxLabel} ${props.color ? `bg-[${props.color}]` : ""}`}/>
  //   </div>
  // )
}
