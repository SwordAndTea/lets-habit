import {CommonServerGetSideUserProp} from "../util/user";

export default function RootPage() {
  return <></>
}

export const getServerSideProps = CommonServerGetSideUserProp(true, true)
