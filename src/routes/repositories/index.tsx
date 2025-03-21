import {
  component$,
  useContext,
  useSignal,
  useStyles$,
  $,
} from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { type DocumentHead } from "@builder.io/qwik-city";
import Infobox from "../../components/starter/infobox/infobox";
import { ServerDataContext } from "../layout";
import type { Repo } from "../../types/index";
import Topics from "../../components/starter/topics/topics";
import styles from "./repositories.css?inline";
import { Modal } from '@qwik-ui/headless';
import { usePutBulkTopics } from "../../api/putTopics";
export { usePutBulkTopics } from "../../api/putTopics";

export default component$(() => {
  const nav = useNavigate();
  const serverData = useContext(ServerDataContext);
  const searchQuery = useSignal('');
  const selectedTopic = useSignal('');
  const allTopics = [...new Set(serverData.repos.flatMap((repo: Repo) => repo.topics))];
  const repoTopicsMap = serverData.repos.reduce((acc: {[key: string]: string[]}, repo: Repo) => {
    acc[repo.name] = repo.topics;
    return acc;
  }, {});
  const selectedRepos = useSignal<string[]>([]);
  const isShow = useSignal<boolean>(false);
  const action = usePutBulkTopics();

  useStyles$(styles);

  const handleSelectAll = $(() => {
    const filteredRepos = serverData.repos
      .filter(repo => {
        const matchesSearch = !searchQuery.value || 
          repo.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesTopic = !selectedTopic.value || 
          repo.topics.includes(selectedTopic.value);
        return matchesSearch && matchesTopic;
      })
      .map(repo => repo.name);
    selectedRepos.value = filteredRepos;
  });

  const handleDeselectAll = $(() => {
    selectedRepos.value = [];
  });

  const handleTopicClick = $((e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'SPAN') {
      selectedTopic.value = target.textContent || '';
    }
  });

  const handleClearFilters = $(() => {
    selectedTopic.value = '';
    searchQuery.value = '';
  });

  const handleCheckboxChange = $((e: Event, repoName: string) => {
    const checkbox = e.target as HTMLInputElement;
    if (checkbox.checked) {
      selectedRepos.value = [...selectedRepos.value, repoName];
    } else {
      selectedRepos.value = selectedRepos.value.filter(r => r !== repoName);
    }
  });

  const handleSaveChanges = $(() => {
    const updatedRepoTopics: {[key: string]: string[]} = {};
    const inputEl = document.querySelector('.tagInput') as HTMLInputElement;
    const newTags = inputEl?.value.split(',').map(t => t.trim()).filter(Boolean);
    const checkedBoxes = document.querySelectorAll('.removeTag:checked');
    const tagsToRemove = Array.from(checkedBoxes).map(box => 
      (box.parentElement?.querySelector('span')?.textContent || '')
    );

    for (const repoName of selectedRepos.value) {
      const currentTags = repoTopicsMap[repoName];
      const updatedTags = [...new Set([...currentTags.filter(t => !tagsToRemove.includes(t)), ...newTags])];
      updatedRepoTopics[repoName] = updatedTags;
    }

     action.submit({
      repos: selectedRepos.value,
      reposTopics: updatedRepoTopics
    });
  });

  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <h1>
        <span class="highlight">All</span> Repositories
      </h1>

      <div class="container">
        <div class="filterContainer">
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <button onClick$={() => isShow.value = true} class="modalTrigger">
              Manage Tags
            </button>
            {isShow.value && (
              <>
                <button onClick$={handleSelectAll} class="modalTrigger">
                  Select All
                </button>
                <button onClick$={handleDeselectAll} class="modalTrigger">
                  Deselect All  
                </button>
                {selectedRepos.value.length > 0 && (
                  <Modal.Root>
                    <Modal.Trigger class="modalTrigger">Edit Tags</Modal.Trigger>
                    <Modal.Panel class={`modal-panel modalPanel`}>
                      <Modal.Title class="modalTitle">Add/Remove Tags</Modal.Title>
                      <Modal.Description>
                        Repositories to be edited:
                        <ul>
                          {selectedRepos.value.map(repo => (
                            <li key={repo}>{repo}</li>
                          ))}
                        </ul>
                      </Modal.Description>
                      <Modal.Description class="modalDescription">
                        Select tag(s) to remove from selected repositories:
                      </Modal.Description>
                      <div class="tagsList">
                        {selectedRepos.value.reduce((allTopics, repoName) => {
                          const repoTopics = repoTopicsMap[repoName] || [];
                          return [...new Set([...allTopics, ...repoTopics])];
                        }, [] as string[]).map((topic) => (
                          <div key={topic} class="tagItem">
                            <span>{topic}</span>
                            <input type="checkbox" class="removeTag" />
                          </div>
                        ))}
                      </div>

                      <Modal.Description class="modalDescription">
                        Enter tags to add to selected repositories:
                      </Modal.Description>
                      <input
                        type="text"
                        placeholder="Enter tags separated by commas" 
                        class="modalPanel tagInput"
                      />

                      <footer>
                        <Modal.Close type="button" class="modalClose">Cancel</Modal.Close>
                        <Modal.Close
                          onClick$={handleSaveChanges}
                          type="button"
                          class="modalClose"
                        >
                          Save Changes
                        </Modal.Close>
                      </footer>
                    </Modal.Panel>
                  </Modal.Root>
                )}
              </>
            )}
          </div>
          <span class="tagsLabel">
            Tags:
          </span>
          <div onClick$={handleTopicClick}>
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
            onClick$={handleClearFilters}
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
                {isShow.value && (
                  <input 
                    type="checkbox" 
                    class="repoCheckbox"
                    checked={selectedRepos.value.includes(repo.name)}
                    onChange$={(e) => handleCheckboxChange(e, repo.name)}
                  />
                )}
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
