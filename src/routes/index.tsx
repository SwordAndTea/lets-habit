import {component$, Resource} from '@builder.io/qwik';
import {RequestHandler, useEndpoint} from "@builder.io/qwik-city";


export const onGet: RequestHandler<null> = async ({response}) => {
  // use this way to route to default route `/home`, don't know the other way
  throw response.redirect("/login")
}

export default component$(() => {
  return <></>
});

