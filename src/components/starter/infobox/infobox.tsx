import { component$, createContextId, useContextProvider, useContext } from "@builder.io/qwik";
import styles from "./infobox.module.css";
import { repo } from "../../../types/consts";
import { RouteNavigate } from "@builder.io/qwik-city";
import type { Repo } from "../../../types/index";

export const RepoContext = createContextId<Repo>('repo-context');

export interface InfoboxProps {
  repo: Repo;
  nav?: RouteNavigate;
}

export default component$((infoboxProps: InfoboxProps) => {
  useContextProvider(RepoContext, infoboxProps.repo);
  const repoContext = useContext(RepoContext);

  return (
    <div
      class={styles.root}
      onClick$={() => infoboxProps.nav?.(`/repositoryDetails?repo=${repoContext.name}`)}
      key={repo.full_name}
    >
      <div class={styles.content}>
        <div class={styles.title}>{repoContext.name || ''}</div>
        <div class={styles.description}>
          {repoContext.description || ''}
        </div>

        {repoContext.language && (
          <div class={styles.language}>
            <p>{repoContext.language}</p>
          </div>
        )}
        <div class={styles.label}>
          <div class={styles.footer}>
            <div class={styles.item}>Last Updated:</div>
            <div class={styles.value}>
              {repoContext.updated_at
                ? new Date(repoContext.updated_at).toDateString()
                : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
