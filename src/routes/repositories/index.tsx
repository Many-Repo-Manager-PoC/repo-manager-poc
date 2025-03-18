import {
    component$,
    useContext,
    useSignal,
  } from "@builder.io/qwik";
  import { useNavigate } from "@builder.io/qwik-city";
  import { type DocumentHead } from "@builder.io/qwik-city";
  import Infobox from "../../components/starter/infobox/infobox";
  import { ServerDataContext } from "../layout";
  import type { Repo } from "../../types/index";
  
  export default component$(() => {
    const nav = useNavigate();
    const serverData = useContext(ServerDataContext);
    const searchQuery = useSignal('');

    return (
      <div class="container container-center">
        <div role="presentation" class="ellipsis"></div>
        <h1 style={{ paddingBottom: '2rem' }}>
          <span class="highlight">All</span> Repositories
        </h1>

        <div style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <input
            type="text"
            value={searchQuery.value}
            onInput$={(ev) => searchQuery.value = (ev.target as HTMLInputElement).value}
            placeholder="Search repositories..."
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              width: '100%',
              maxWidth: '400px',
              backgroundColor: 'white'
            }}
          />
        </div>
  
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          width: '100%'
        }}>
          {/* @ts-ignore */}
          {serverData.repos
            .filter((repo: Repo) => 
              repo.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            )
            .map((repo: Repo) => {
              return (
                <Infobox repo={repo} nav={nav} key={repo.id}></Infobox>
              );
            })
          }
        </div>
      </div>
    );
  });
  
  export const head: DocumentHead = {
    title: "Repositories",
  };
