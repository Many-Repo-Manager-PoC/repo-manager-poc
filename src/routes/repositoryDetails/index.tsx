import {
  component$,
  useContext,
  useStyles$,
} from "@builder.io/qwik";
import { useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { ServerDataContext } from "../layout";
import Dependency from "../../components/starter/dependency/dependency";
import Topics from "../../components/starter/topics/topics";
import { Modal, Label } from '@qwik-ui/headless';
import styles from "./repositoryDetails.css?inline";

export default component$(() => {
  const location = useLocation();
  const repoName = location.url.searchParams.get('repo');
  const serverData = useContext(ServerDataContext);
  const nav = useNavigate();
  const repo = serverData.repos.find(r => r.name === repoName);
  const repoDependencies = serverData.dependencies;
  const packageJsons = serverData.packageJsons;
  useStyles$(styles);

  // Filter dependencies for current repo
  const currentRepoDependencies = repo ? 
    repoDependencies?.filter((_, index) => {
      return packageJsons[index]?.repo === repoName;
    }) : [];

  const currentPackageJson = repo ?
    packageJsons?.find(pkg => pkg.name === repoName) : null;

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
                <Topics repo={repo} nav={nav} />
              </div>

              <Modal.Root>
                <Modal.Trigger>Manage Tags</Modal.Trigger>
                <Modal.Panel class={`modal-panel modalPanel`}>
                  <Modal.Title>Edit Profile</Modal.Title>
                  <Modal.Description>
                    You can update your profile here. Hit the save button when finished.
                  </Modal.Description>
                  <Label>
                    Name
                    <input type="text" placeholder="John Doe" />
                  </Label>
                  <Label>
                    Email
                    <input type="text" placeholder="johndoe@gmail.com" />
                  </Label>
                  <footer>
                    <Modal.Close class="modal-close">Cancel</Modal.Close>
                    <Modal.Close class="modal-close">Save Changes</Modal.Close>
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

            <Dependency dependencies={currentRepoDependencies} packageJsons={[currentPackageJson]} />
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
