import {
  component$,
  useContext,
  useStyles$,
  useSignal,
} from "@builder.io/qwik";
import { useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { ServerDataContext } from "../layout";
import DependencyModule from "../../components/starter/dependencyModule/dependencyModule";
import DependencyManagerModule from "../../components/starter/dependencyManagerModule/dependencyManagerModule";
import Topics from "../../components/starter/topics/topics";
import { Modal } from '@qwik-ui/headless';
import styles from "./repositoryDetails.css?inline";

import { usePutTopics } from "../../api/putTopics";
export { usePutTopics } from "../../api/putTopics";

export default component$(() => {
  useStyles$(styles);
  const location = useLocation();
  const repoName = location.url.searchParams.get('repo');
  const serverData = useContext(ServerDataContext);
  const nav = useNavigate();
  const repo = serverData.repos?.find(r => r.name === repoName);
  const currentRepoPackageJson = serverData.packageJsons?.find(p => p.repo === repoName) || null;
  
  // Initialize tags signal with repo topics or empty array
  const tags = useSignal<string[]>(repo?.topics || []);
  const action = usePutTopics();
  const currentPackageJson = serverData.packageJsons?.find(p => p.repo === repoName)?.packageJson || null;

  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <h1>
        <span class="highlight">Repository</span> Details
      </h1>

      {repo ? (
        <div>
          <div style={{
            border: '2px solid orange',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: 'transparent',
            marginBottom: '20px',
            marginTop: '20px',
            minWidth: '300px',
            maxWidth: '400px',
            margin: '20px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h2 class="repoTitle">{repo.name}</h2>

            <div class="repoDescription" style={{ color: 'white' }}>
              {repo.description || 'No description available'}
            </div>
          </div>

          <div class="tagsContainer">
            <div class="tagsHeader">
              <div class="tagsLabel">
                <span class="tagsLabelText">
                  Tags:
                </span>
                <Topics topics={tags.value} nav={nav} />
              </div>

              <Modal.Root>
                <Modal.Trigger class="modalTrigger">Manage Tags</Modal.Trigger>
                <Modal.Panel class={`modal-panel modalPanel`}>
                  <Modal.Title class="modalTitle">Add/Remove Tags</Modal.Title>
                  <Modal.Description class="modalDescription">
                    Select tag(s) to remove from the repository:
                  </Modal.Description>
                  <div class="tagsList">
                    {tags.value.map((topic) => (
                      <div key={topic} class="tagItem">
                        <span>{topic}</span>
                        <input type="checkbox" class="removeTag" />
                      </div>
                    ))}
                  </div>

                  <Modal.Description class="modalDescription">
                    Enter tags to add to Repository:
                  </Modal.Description>
                  <input
                    type="text"
                    placeholder="Enter tags separated by commas"
                    class="modalPanel tagInput"
                  />

                  <footer>
                    <Modal.Close type="button" class="modalClose">Cancel</Modal.Close>
                    <Modal.Close
                      onClick$={() => {
                        const inputEl = document.querySelector('.tagInput') as HTMLInputElement;
                        const newTags = inputEl?.value.split(',').map(t => t.trim()).filter(Boolean);
                        const checkedBoxes = document.querySelectorAll('.removeTag:checked');
                        const tagsToRemove = Array.from(checkedBoxes).map(box =>
                          (box.parentElement?.querySelector('span')?.textContent || '')
                        );
                        const remainingTags = tags.value.filter(t => !tagsToRemove.includes(t));
                        tags.value = [...new Set([...remainingTags, ...newTags])];
                        action.submit({
                          repo: repo.name,
                          topics: tags.value
                        });
                      }}
                      type="button"
                      class="modalClose"
                    >
                      Save Changes
                    </Modal.Close>
                  </footer>
                </Modal.Panel>
              </Modal.Root>
            </div>
          </div>

          <div class="detailsContainer">
            <div class="detailsBox">
              <div class="badgesContainer">
                {repo.language && (
                  <div class="languageBadge">
                    {repo.language}
                  </div>
                )}

                <div class="licenseBadge">
                  {repo.license?.name || 'No License'}
                </div>

                <div class="dateBadge">
                  Last Updated: {new Date(repo.updated_at).toDateString()}
                </div>

                <div class="statBadge">
                  ✰ {repo.stargazers_count}
                </div>

                <div class="statBadge">
                  ⚠ {repo.open_issues_count}
                </div>
              </div>

              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                class="githubLink"
              >
                View on GitHub
              </a>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <div style={{ flex: 1 }}>
                <h2 class="dependenciesTitle" style={{ margin: 0 }}>
                  Dependencies
                </h2>
                <DependencyModule 
                  repoDetails={true}
                  packageJsons={currentRepoPackageJson}
                />
              </div>

              {repo.topics?.includes('design-system') && (
                <div style={{ flex: 1 }}>
                  <h2 class="dependenciesTitle" style={{ margin: 0 }}>
                    Dependency Manager
                  </h2>
                  <DependencyManagerModule 
                    packageJsons={serverData.packageJsons}
                    repoName={currentPackageJson?.name || ''}
                    repoVersion={currentPackageJson?.version || ''}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div class="notFound">
          <h2 class="notFoundText">Repository Not Found</h2>
          <p class="notFoundText">Unable to load repository details</p>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Repository Details",
};
