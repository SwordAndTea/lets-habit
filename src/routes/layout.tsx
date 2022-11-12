import {component$, Slot, useClientEffect$, useStore,} from '@builder.io/qwik';
import Footer from "~/components/footer/footer";

export default component$(() => {
  const state = useStore({
    theme: "light"
  })
  useClientEffect$(()=>{
    const theme = window.localStorage.getItem("theme")
    if (theme != null) {
      state.theme = theme
    }
  })
  return (
    <main class={state.theme}>
      <Slot/> {/* <== Child layout/route inserted here */}
      <Footer />
    </main>
  );
});
