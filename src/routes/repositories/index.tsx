import {
    component$,
    useVisibleTask$,
    useStore,
  } from "@builder.io/qwik";
  import { useNavigate } from "@builder.io/qwik-city";
  import { type DocumentHead } from "@builder.io/qwik-city";
  import Infobox from "../../components/starter/infobox/infobox";
  import { type Repo } from "../../types/index";
  import { routeLoader$ } from "@builder.io/qwik-city";
  
  
  export const useGetRepos = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
  
    try {
      const response = await fetch(`https://api.github.com/orgs/kunai-consulting/repos`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Cloudflare Worker",
          Authorization: `Bearer ${accessToken}`, 
        },
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const repositories = await response.json();
      return repositories as Repo[];
    } catch (error) {
      console.error("Error fetching repos:", error);
      return [] as Repo[];
    }
  });
  
  
  export default component$(() => {
    const nav = useNavigate();
    const repos = useGetRepos();
  
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
  
  