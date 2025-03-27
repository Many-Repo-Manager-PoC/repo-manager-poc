import { component$ } from "@builder.io/qwik";
import { RouteNavigate } from "@builder.io/qwik-city";
import type { Repo } from "../../../types";

interface TopicsProps {
  repo?: Repo;
  topics?: string[];
  nav?: RouteNavigate;
}

export default component$<TopicsProps>(({ repo, topics }) => {
  const allTopics = [...(repo?.topics || []), ...(topics || [])];

  return (
    <div key={repo?.id} style={{
      padding: '0.75rem',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {allTopics.map((topic) => (
          <span key={topic} style={{
            color: '#0969da',
            fontSize: '0.75rem',
            backgroundColor: '#f6f8fa',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            border: '1px solid #d0d7de'
          }}>
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
});