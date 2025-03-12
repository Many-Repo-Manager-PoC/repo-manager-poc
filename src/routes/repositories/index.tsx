import {
    component$,
    useTask$,
    useStore,
  } from "@builder.io/qwik";
  import { useNavigate } from "@builder.io/qwik-city";
  import { type DocumentHead } from "@builder.io/qwik-city";
  import Infobox from "../../components/starter/infobox/infobox";
  import { useGetRepos } from "../../api/getRepositories";
  export { useGetRepos } from "../../api/getRepositories";
  
  
  export default component$(() => {
    const nav = useNavigate();
    const repos = useGetRepos();
  
    const state = useStore({
      count: 0,
      number: 20,
    });
  
    useTask$(({ cleanup }) => {
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
  
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          width: '100%'
        }}>
          {repos.value?.map((repo) => (
            <Infobox repo={repo} nav={nav} key={repo.id}></Infobox>
          ))}
        </div>
      </div>
    );
  });
  
  export const head: DocumentHead = {
    title: "Repositories",
  };
  
  