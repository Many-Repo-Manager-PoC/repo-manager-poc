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
import Topics from "../../components/starter/topics/topics";

export default component$(() => {
  const nav = useNavigate();
  const serverData = useContext(ServerDataContext);
  const searchQuery = useSignal('');
  const selectedTopic = useSignal('');
  const allTopics = [...new Set(serverData.repos.flatMap((repo: Repo) => repo.topics || []))];

  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <h1>
        <span class="highlight">All</span> Repositories
      </h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: 'white',
            marginRight: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            Tags:
          </span>
          <div onClick$={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'SPAN') {
              selectedTopic.value = target.textContent || '';
            }
          }}>
            <Topics topics={allTopics} />
          </div>
          <input
            type="text"
            value={searchQuery.value}
            onInput$={(ev) => searchQuery.value = (ev.target as HTMLInputElement).value}
            placeholder="Search repositories..."
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #d0d7de',
              width: '100%',
              maxWidth: '400px',
              backgroundColor: '#f6f8fa'
            }}
          />
          <button
            onClick$={() => {
              selectedTopic.value = '';
              searchQuery.value = '';
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '3rem',
              padding: '0.2rem',
              color: 'white',
              fontWeight: '100'
            }}
            title="Clear filters"
          >
             ↻
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          width: '100%'
        }}>
          {serverData.repos
            .filter((repo: Repo) => 
              repo.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
              (!selectedTopic.value || (repo.topics && repo.topics.includes(selectedTopic.value)))
            )
            .map((repo: Repo) => (
              <div key={repo.id} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem'
              }}>
                <Infobox repo={repo} nav={nav} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Repositories",
};
