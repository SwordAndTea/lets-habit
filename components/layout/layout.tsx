import Footer from "./footer";
import Header from "./header";

// @ts-ignore
export const LayoutHeaderFooter = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <div className="flex-1 flex">
        {children}
      </div>
      <Footer/>
    </div>
  )
}

// @ts-ignore
export const LayoutFooterOnly = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex">
        {children}
      </div>
      <Footer/>
    </div>
  )
}


