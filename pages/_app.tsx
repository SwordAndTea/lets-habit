import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {LayoutHeaderFooter} from "../components/layout/layout";
import {Provider, useDispatch, useSelector} from "react-redux";
import {ReactNode, useEffect, useState} from "react";
import NotificationsSystem, {atalhoTheme, dismissNotification, setUpNotifications} from "reapop";
import store, {RootState} from "../util/store";


setUpNotifications({
  defaultProps: {
    position: 'top-right',
    dismissible: true,
    dismissAfter: 2000,
  }
})

interface NotificationWrapperProps {
  children: ReactNode
}

function NotificationWrapper(props: NotificationWrapperProps) {
  const dispatch = useDispatch();


  const notifications = useSelector((state: RootState) => state.notifications)
  const [loadNotificationSystem, setLoadNotificationSystem] = useState(false);

  useEffect(() => {
    setLoadNotificationSystem(true);
  }, []);

  return (
    <div>
      {loadNotificationSystem && <NotificationsSystem
        // 2. Pass the notifications you want Reapop to display.
        notifications={notifications}
        // 3. Pass the function used to dismiss a notification.
        dismissNotification={(id) => dispatch(dismissNotification(id))}
        // 4. Pass a builtIn theme or a custom theme.
        theme={atalhoTheme}
      />}
      {props.children}
    </div>
  )
}

export default function App({Component, pageProps}: AppProps) {
  // @ts-ignore
  const getLayout = Component.getLayout || ((page) => <LayoutHeaderFooter>{page}</LayoutHeaderFooter>)

  return (
    <Provider store={store}>
      <NotificationWrapper>
        {getLayout(<Component {...pageProps} />)}
      </NotificationWrapper>
    </Provider>
  )
}
