import {useRouter} from "next/router";
import {useEffect} from "react";
import {RoutePath} from "../util/const";

export default function RootPage() {
  const route = useRouter()

  useEffect(()=> {
    route.replace(RoutePath.HomePage)
  })

  return <></>
}
