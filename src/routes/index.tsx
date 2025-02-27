import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useSignIn } from "~/routes/plugin@auth";


export default component$(() => {
  const signIn = useSignIn();

  return (
    <>

      <div role="presentation" class="ellipsis"></div>
      <div role="presentation" class="ellipsis ellipsis-purple"></div>

      <div class="container container-center container-spacing-xl">
        <h2 style="padding-bottom: 1rem;">
          Kunai Repositories Manager
        </h2>

        <h3 style="padding-bottom: 1rem;">
          Sign in with <span class="highlight">GitHub</span>
        </h3>

        <button style="padding-bottom: 1rem;" onClick$={() => signIn.submit({ providerId: 'github' })}>Sign In</button>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
