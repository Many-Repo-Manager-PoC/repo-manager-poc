import {
    component$,
    useVisibleTask$,
    useStore,
  } from "@builder.io/qwik";
  import { type DocumentHead } from "@builder.io/qwik-city";
  import { type Repo } from "../../types/index";
  import { routeLoader$ } from "@builder.io/qwik-city";
  import { repos } from "../../types/consts";
  
  
  export const useGetDependencies = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    
    try {
      const allDependencies = await Promise.all(repos.map(async (repo) => {
        try {
          const response = await fetch(`https://api.github.com/repos/kunai-consulting/${repo}/dependency-graph/sbom`, {
            headers: {
              Accept: "application/json", 
              "User-Agent": "Cloudflare Worker",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const dependencies = await response.json();
          return dependencies;
        } catch (error) {
          console.error(`Error fetching dependencies for ${repo}:`, error);
          return null;
        }
      }));

      const validDependencies = allDependencies.filter(dep => dep !== null);
      return validDependencies as Repo[];
    } catch (error) {
      console.error("Error fetching dependencies:", error);
      return [] as Repo[];
    }
  });
  
  
  export default component$(() => {

    const dependencies = useGetDependencies();
    console.log(dependencies.value);
  
    const state = useStore({
      count: 0,
      number: 20,
    });
  
    useVisibleTask$(({ cleanup }) => {
      const timeout = setTimeout(() => (state.count = 1), 500);
      cleanup(() => clearTimeout(timeout));
  
      const internal = setInterval(() => state.count++, 7000);
      cleanup(() => clearInterval(internal));
    });
  
    return (
      <div class="container container-center">
        <div role="presentation" class="ellipsis"></div>
        <h1>
          <span class="highlight">Repo</span> Dependencies
        </h1>
  
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <table style={{
            width: '80%',
            maxWidth: '1200px',
            borderCollapse: 'collapse', 
            marginTop: '2rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#e0e0e0',
                borderBottom: '2px solid #ddd'
              }}>
                <th style={{padding: '1rem'}}>Name</th>
                <th style={{padding: '1rem'}}>Version</th>
                <th style={{padding: '1rem'}}>Packages</th>
              </tr>
            </thead>
            <tbody>
              {dependencies.value?.map((repo) => (
                <tr key={repo.id} style={{
                  borderBottom: '1px solid #ddd'
                }}>
                  <td style={{padding: '1rem', color: 'black'}}>{repo.sbom?.name?.split('/').pop() || '-'}</td>
                  <td style={{padding: '1rem', color: 'black'}}>{repo.sbom?.version || '-'}</td>
                  <td style={{padding: '1rem', color: 'black'}}>{repo.sbom?.packages?.items || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  });
  
  export const head: DocumentHead = {
    title: "Dependencies",
  };
  
  