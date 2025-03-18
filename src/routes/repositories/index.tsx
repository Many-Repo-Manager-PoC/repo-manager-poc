import {
    component$,
    useContext,
  } from "@builder.io/qwik";
  import { useNavigate } from "@builder.io/qwik-city";
  import { type DocumentHead } from "@builder.io/qwik-city";
  import Infobox from "../../components/starter/infobox/infobox";
  import { ServerDataContext } from "../layout";
  import type { Repo } from "../../types/index";
  
  export default component$(() => {
    const nav = useNavigate();
    const serverData = useContext(ServerDataContext);

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
          {/* @ts-ignore */}
          {serverData.repos.map((repo: Repo) => {
            return (
              <Infobox repo={repo} nav={nav} key={repo.id}></Infobox>
            );
          })}
        </div>
      </div>
    );
  });
  
  export const head: DocumentHead = {
    title: "Repositories",
  };
