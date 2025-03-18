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
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div class={styles.content} style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <div class={styles.title} style={{ color: 'black' }}>{repoContext.name || ''}</div>
        <div class={styles.description} style={{
          flex: '1 0 auto'
        }}>
          {repoContext.description || ''}
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {repoContext.language && (
            <div style={{
              color: 'rgb(50 64 96)',
              backgroundColor: 'rgb(230, 242, 232)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              {repoContext.language}
            </div>
          )}

          <div style={{
            backgroundColor: '#fff3e0',
            color: '#e65100',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            {repoContext.license?.name || 'No License'}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '1rem'
        }}>
          <div style={{
            backgroundColor: '#f5f5f5',
            color: '#666',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            Last Updated: {repoContext.updated_at ? new Date(repoContext.updated_at).toDateString() : ''}
          </div>
          <div style={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '2px 2px',
                borderRadius: '2px',
                marginRight: '8px'
              }}>
                ✰ {repoContext.stargazers_count}
              </div>
              <div style={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '2px 6px',
                borderRadius: '2px',
              }}>
                ⚠ {repoContext.open_issues_count}
              </div>
        </div>
      </div>
    </div>
  );
});
