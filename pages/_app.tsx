import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {LayoutHeaderFooter} from "../components/layout/layout";
import store from "../util/store";
import {Provider} from "react-redux";
import {setUpNotifications} from 'reapop'

// set up notification, notification container is in the layout
setUpNotifications({
  defaultProps: {
    position: 'top-right',
    dismissible: true,
    dismissAfter: 2000,
  }
})

export default function App({Component, pageProps}: AppProps) {
  // @ts-ignore
  const getLayout = Component.getLayout || ((page) => <LayoutHeaderFooter>{page}</LayoutHeaderFooter>)

  return (
    <Provider store={store}>
      {getLayout(<Component {...pageProps} />)}
    </Provider>

  )
}
