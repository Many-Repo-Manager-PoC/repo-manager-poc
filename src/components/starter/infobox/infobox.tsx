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
    <div class={styles.root} onClick$={() => infoboxProps.nav?.(repo.html_url)} key={repo.full_name}>
    <div class={styles.content}>

        <div class={styles.title}>{repo.name || 'hi'}</div>
        <div class={styles.description}>{repo.description || ''}</div>


        {repo.language && (
          <div class={styles.language}>
            <div class="flex-1 space-y-1">
              <p>{repo.language}</p>
            </div>
          </div>
        )}
        <div class={styles.label}>
          <div class={styles.footer}>
            <div class={styles.item}>Last Updated:</div>
            <div class={styles.value}>
              {repo.updated_at ? new Date(repo.updated_at).toDateString() : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
