import Footer from "./footer";
import Header from "./header";
import {useDispatch, useSelector} from "react-redux";
import NotificationsSystem, {atalhoTheme, dismissNotification} from 'reapop'
import {useEffect, useState} from "react";

// @ts-ignore
export const LayoutHeaderFooter = ({children}) => {
  const dispatch = useDispatch();

  // @ts-ignore
  const notifications = useSelector((state) => state.notifications)

  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {!isSSR && <NotificationsSystem
        // 2. Pass the notifications you want Reapop to display.
          notifications={notifications}
        // 3. Pass the function used to dismiss a notification.
          dismissNotification={(id) => dispatch(dismissNotification(id))}
        // 4. Pass a builtIn theme or a custom theme.
          theme={atalhoTheme}
      />}
      <Header />
      <div className="relative flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}

// @ts-ignore
export const LayoutFooterOnly = ({children}) => {
  const dispatch = useDispatch();

  // @ts-ignore
  const notifications = useSelector((state) => state.notifications)

  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {!isSSR && <NotificationsSystem
        // 2. Pass the notifications you want Reapop to display.
          notifications={notifications}
        // 3. Pass the function used to dismiss a notification.
          dismissNotification={(id) => dispatch(dismissNotification(id))}
        // 4. Pass a builtIn theme or a custom theme.
          theme={atalhoTheme}
      />}
      <div className="relative flex">
        {children}
      </div>
      <Footer />
    </div>
  )
}


