import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {LayoutFooterOnly} from "../components/layout/layout";
import store from "../app/store";
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
  return (
    <Provider store={store}>
      <LayoutFooterOnly>
        <Component {...pageProps} />
      </LayoutFooterOnly>
    </Provider>

  )
}
