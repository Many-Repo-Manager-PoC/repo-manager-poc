import {
  component$,
  useContext,
  useSignal,
  useStyles$,
} from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { type DocumentHead } from "@builder.io/qwik-city";
import Infobox from "../../components/starter/infobox/infobox";
import { ServerDataContext } from "../layout";
import type { Repo } from "../../types/index";
import Topics from "../../components/starter/topics/topics";
import styles from "./repositories.css?inline";


export default component$(() => {
  const nav = useNavigate();
  const serverData = useContext(ServerDataContext);
  const searchQuery = useSignal('');
  const selectedTopic = useSignal('');
  const allTopics = [...new Set(serverData.repos.flatMap((repo: Repo) => repo.topics || []))];
  useStyles$(styles);
  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <h1>
        <span class="highlight">All</span> Repositories
      </h1>

      <div class="container">
        <div class="filterContainer">
          <span class="tagsLabel">
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
            class="searchInput"
          />
          <button
            onClick$={() => {
              selectedTopic.value = '';
              searchQuery.value = '';
            }}
            class="clearButton"
            title="Clear filters"
          >
             ↻
          </button>
        </div>

        <div class="repoGrid">
          {serverData.repos
            .filter((repo: Repo) => 
              repo.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
              (!selectedTopic.value || (repo.topics && repo.topics.includes(selectedTopic.value)))
            )
            .map((repo: Repo) => (
              <div key={repo.id} class="repoItem">
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
