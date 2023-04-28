import {RoutePath} from "../util/const";
import {getUserInfo} from "../api/user";
import {GetServerSideProps} from "next";

export default function RootPage() {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getUserInfo(context.req.headers.cookie).then((resp) => {
    if (resp.headers["set-cookie"]) {
      context.res.setHeader('set-cookie', resp.headers["set-cookie"])
    }
    if (resp.data.data.user.user_register_type == "email" && !resp.data.data.user.email_active) {
      return {
        redirect: {
          destination: RoutePath.EmailActivateSendPage,
          permanent: false,
        }
      }
    }
    return {
      redirect: {
        destination: `${RoutePath.HomePage}?page=1`,
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
