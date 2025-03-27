import {
  component$,
  useContext,
  useStyles$,
  useSignal,
} from "@builder.io/qwik";
import { useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { ServerDataContext } from "../layout";
// import Dependency from "../../components/starter/dependencyModule/dependencyModule";
import Topics from "../../components/starter/topics/topics";
import { Modal } from '@qwik-ui/headless';
import styles from "./repositoryDetails.css?inline";

import { usePutTopics } from "../../api/putTopics";
export { usePutTopics } from "../../api/putTopics";

export default component$(() => {
  const location = useLocation();
  const repoName = location.url.searchParams.get('repo');
  const serverData = useContext(ServerDataContext);
  const nav = useNavigate();
  
  // Find the repository and its dependencies
  const repo = serverData.repos?.find(r => r.name === repoName);
  const repoDependencies = serverData.dependencies || [];
  const packageJsons = serverData.packageJsons || [];
  
  // Initialize tags signal with repo topics or empty array
  const tags = useSignal<string[]>(repo?.topics || []);
  const action = usePutTopics();

  useStyles$(styles);

  // Filter dependencies for current repo
  const currentRepoDependencies = repo ? 
    repoDependencies.filter((_, index) => packageJsons[index]?.repo === repoName) : [];

//   const currentPackageJson = repo ?
//     packageJsons.find(pkg => pkg.repo === repoName) : null;

  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <h1>
        <span class="highlight">Repository</span> Details
      </h1>

      {repo ? (
        <div>
          <h2 class="repoTitle">{repo.name}</h2>

          <div class="repoDescription">
            {repo.description || 'No description available'}
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

            {currentRepoDependencies.length > 0 && (
              <h2 class="dependenciesTitle">
                Dependencies
              </h2>
            )}

            {/* <Dependency dependencies={currentRepoDependencies} packageJsons={[currentPackageJson]} /> */}
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
