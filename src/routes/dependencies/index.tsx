import {
    component$,
    useVisibleTask$,
    useStore,
  } from "@builder.io/qwik";
  import { type DocumentHead } from "@builder.io/qwik-city";
  import { type Dependency  } from "../../types/index";
  import { routeLoader$ } from "@builder.io/qwik-city";
  import { repos } from "../../types/consts";
  import packageLock from '../../../package-lock.json';
  
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
      return validDependencies as Dependency[];
    } catch (error) {
      console.error("Error fetching dependencies:", error);
      return [] as Dependency[];
    }
  });
  
  
  export default component$(() => {
    const dependencies =  useGetDependencies();
    const packageNames = dependencies.value?.map(dependency => 
        // @ts-ignore
      dependency.sbom?.packages?.map((pkg:Package) => pkg.name) || []
    ) || [];
    console.log('Package names by dependency:', packageNames);
    // console.log(dependencies.value[2].sbom?.packages[2].name);
    const devDependencyNames = Object.keys(packageLock.packages[''].devDependencies);
    console.log("devDependencyNames", devDependencyNames);

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
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {dependencies.value?.map((dependency, depIndex) => {
            const repoPackageNames = packageNames[depIndex] || [];
            const overlappingPackages = repoPackageNames.filter((name: string) => 
              devDependencyNames.includes(name)
            );

            return (
              <div key={dependency.sbom?.SPDXID} style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '300px',
                maxWidth: '400px'
              }}>
                <h3 style={{
                  margin: '0 0 1rem 0',
                  color: 'black'
                }}>
                  {dependency.sbom?.name?.split('/').pop() || '-'}
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {overlappingPackages.map((packageName: string) => {
                    const packageDetails = dependency.sbom?.packages?.items?.find(
                      item => item.name === packageName
                    );
                    return (
                      <div key={packageName} style={{
                        backgroundColor: 'white',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}>
                        <div style={{fontWeight: 'bold', color: 'black'}}>
                          {packageName}
                        </div>
                        <div style={{color: '#666', fontSize: '0.9rem'}}>
                          {packageDetails?.versionInfo || '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  });
  
  export const head: DocumentHead = {
    title: "Dependencies",
  };
  
  