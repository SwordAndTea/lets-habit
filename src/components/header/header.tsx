import {component$, useStylesScoped$} from '@builder.io/qwik';
import styles from './header.css?inline';

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <header class="flex bg-white">
      <div class="w-full bg-orange-300">
        {/*TODO: replace a better header layout*/}
        <p class="h-32 text-4xl leading-9 text-center">LH</p>
      </div>
    </header>
  );
});
