import {
  component$,
} from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const nav = useNavigate();

  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <h1>
        <span class="highlight">Dashboard</span>
      </h1>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2rem',
        width: '100%'
      }}>
        <button 
          onClick$={() => nav('/dependencies')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          View Dependencies
        </button>

        <button
          onClick$={() => nav('/repositories')} 
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          View Repositories
        </button>

        <button
          onClick$={() => nav('/createRepositories')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          Create Repository
        </button>
        <button
          onClick$={() => nav('/manageRepositories')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          Manage Repositories
        </button>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard",
};
