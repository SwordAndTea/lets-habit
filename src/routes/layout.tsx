import {component$, Slot,} from '@builder.io/qwik';

export default component$(() => {
  return (
    <main>
      <Slot/> {/* <== Child layout/route inserted here */}
    </main>
  );
});
