import {
  component$,
  useSignal,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { type DocumentHead } from "@builder.io/qwik-city";
import type { Repo } from "~/types";

export default component$(() => {
  const loc = useLocation();
  const repo = useSignal<Repo | null>(null);

  // Parse repo from URL parameter
  if (loc.url.searchParams.has('repo')) {
    try {
      repo.value = JSON.parse(decodeURIComponent(loc.url.searchParams.get('repo')!));
    } catch (e) {
      console.error('Failed to parse repo data:', e);
    }
  }

  return (
    <div class="container">
      {repo.value ? (
        <div>
          <h1>
            <span class="highlight">Dependency Details</span>
          </h1>
          <h2 style={{
            textAlign: 'center'
          }}>
             {repo.value.name || ''}
          </h2>

          <div style={{ marginTop: '2rem' }}>
            <h3>Description</h3>
            <p>{repo.value.description || 'No description available'}</p>
          </div>

          {repo.value.language && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Primary Language</h3>
              <p>{repo.value.language}</p>
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <h3>Last Updated</h3>
            <p>{new Date(repo.value.updated_at).toLocaleDateString()}</p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <a 
              href={repo.value.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                padding: '1rem 2rem',
                background: '#4a5568',
                color: 'white',
                borderRadius: '0.5rem',
                display: 'inline-block'
              }}
            >
              View on GitHub
            </a>
          </div>
        </div>
      ) : (
        <div>
          <h1>Repository Not Found</h1>
          <p>Unable to load repository details</p>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Repository Details",
};
