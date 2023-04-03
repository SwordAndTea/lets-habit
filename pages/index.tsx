import {RoutePath} from "../util/const";
import {userPing} from "../api/user";

export default function RootPage() {
  return <></>
}

export async function getServerSideProps(context: object) {
  // @ts-ignore
  return await userPing(context.req.headers.cookie).then(() => {
    return {
      redirect: {
        destination: RoutePath.HomePage,
        permanent: false,
      }
    }
  }).catch(()=>{
    return {
      redirect: {
        destination: RoutePath.LoginPage,
        permanent: false,
      }
    }
  })
}
