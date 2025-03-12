import { component$ } from "@builder.io/qwik";
import styles from "./infobox.module.css";
import { repo } from "../../../types/consts";
import { RouteNavigate } from "@builder.io/qwik-city";
import type { Repo } from "../../../types/index";

export interface InfoboxProps {
  repo: Repo;
  nav?: RouteNavigate;
}

export default component$((infoboxProps: InfoboxProps) => {
  return (
    <div
      class={styles.root}
      onClick$={() => infoboxProps.nav?.(`/repositoryDetails?repo=${encodeURIComponent(JSON.stringify(infoboxProps.repo))}`)}
      key={repo.full_name}
    >
      <div class={styles.content}>
        <div class={styles.title}>{infoboxProps.repo.name || ''}</div>
        <div class={styles.description}>
          {infoboxProps.repo.description || ''}
        </div>

        {infoboxProps.repo.language && (
          <div class={styles.language}>
            <p>{infoboxProps.repo.language}</p>
          </div>
        )}
        <div class={styles.label}>
          <div class={styles.footer}>
            <div class={styles.item}>Last Updated:</div>
            <div class={styles.value}>
              {infoboxProps.repo.updated_at
                ? new Date(infoboxProps.repo.updated_at).toDateString()
                : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
