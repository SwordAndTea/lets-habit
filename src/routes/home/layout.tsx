import {component$, Slot,} from '@builder.io/qwik';
import Header from '../../components/header/header';

export default component$(() => {
  return (
    <main>
      <Header />
      <section>
        <Slot /> {/* <== This is where the route will be inserted */}
      </section>
    </main>
  );
});
