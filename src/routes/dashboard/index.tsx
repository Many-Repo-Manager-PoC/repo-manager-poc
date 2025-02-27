import {
    component$,
    useVisibleTask$,
    useStore,
    useStylesScoped$,
  } from "@builder.io/qwik";
  import { type DocumentHead } from "@builder.io/qwik-city";
  import styles from "./dashboard.css?inline";
  import Infobox from "../../components/starter/infobox/infobox";
  import { repo } from "../../types/consts";
  export default component$(() => {
    useStylesScoped$(styles);
  
    const state = useStore({
      count: 0,
      number: 20,
    });
  
    useVisibleTask$(({ cleanup }) => {
      const timeout = setTimeout(() => (state.count = 1), 500);
      cleanup(() => clearTimeout(timeout));
  
      const internal = setInterval(() => state.count++, 7000);
      cleanup(() => clearInterval(internal));
    });
  
    return (
      <div class="container container-center">
        <div role="presentation" class="ellipsis"></div>
        <h1>
          <span class="highlight">All</span> Repositories
        </h1>
  
  <Infobox repo={repo}></Infobox>

      </div>
    );
  });
  
  export const head: DocumentHead = {
    title: "Dashboard",
  };
  