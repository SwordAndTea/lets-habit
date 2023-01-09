import {useRouter} from "next/router";
import {useEffect} from "react";

export default function RootPage() {
  const route = useRouter()

  useEffect(()=> {
    route.replace("/home")
  })

  return <></>
}
