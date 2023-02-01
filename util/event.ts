import {BaseSyntheticEvent} from "react";

export function GetEventPath(event: BaseSyntheticEvent) {
  let srcTarget = event.target;
  let curTarget = event.currentTarget;

  let path = [];
  while (srcTarget.parentNode !== null && srcTarget != curTarget) {
    path.push(srcTarget);
    srcTarget = srcTarget.parentNode;
  }
  path.push(curTarget)
  return path;
}
