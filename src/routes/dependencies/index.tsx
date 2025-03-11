import {
    component$,
    useVisibleTask$,
    useStore,
  } from "@builder.io/qwik";
  import { type DocumentHead } from "@builder.io/qwik-city";
  import { type Dependency  } from "../../types/index";
  import { routeLoader$ } from "@builder.io/qwik-city";
  import { repo } from "../../types/consts";
  import { type PackageJson } from "../../types/index";


  //this gets all the repos from the org
  //would like to be able to pass in the org name as a param or take it from the session
  export const useGetRepos = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    try {
        const response = await fetch(`https://api.github.com/orgs/kunai-consulting/repos`, {
            headers: {
            Accept: "application/json", 
            "User-Agent": "Cloudflare Worker",
            Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
            const reposData: { name: string }[] = await response.json();
            const repoNames = reposData.map((repo: { name: string }) => repo.name);
            event.sharedMap.set('repos', repoNames);
   
            return repoNames;
        } catch (error) {
            console.error(`Error fetching dependencies for ${repo}:`, error);
            return null;
    }
});

  // this gets the package.json for each repo
  // although the package.json must be at the root of the repo or it will not work
  export const useGetPackageJson = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    await event.resolveValue(useGetRepos) || [];

    try {
      const packageJsons:PackageJson[] = await Promise.all(event.sharedMap.get('repos').map(async (repo: string) => {
        try {
          const response = await fetch(`https://api.github.com/repos/kunai-consulting/${repo}/contents/package.json`, {
            headers: {
              Accept: "application/json",
              "User-Agent": "Cloudflare Worker", 
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const packageJson = await response.json() as {content: string};
          const content:PackageJson = JSON.parse(atob(packageJson.content));
 
          return {
            devDependencies:content.devDependencies,
            name: content.name,
            version: content.version,
            dependencies: content.dependencies,
            repo: repo,
          };
        } catch (error) {
          console.error(`Error fetching dependencies for ${repo}:`, error);
          return {
            name: '',
            version: '',
            dependencies: {},
            devDependencies: {},
            repo: repo,
          } as PackageJson;
        }
      }));

      return packageJsons;
    } catch (error) {
      console.error("Error in useGetPackageJson:", error);
      return [];
    }
  });
  
  export const useGetDependenciesForRepo = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    await event.resolveValue(useGetRepos) || [];
    
    try {
      const allDependencies = await Promise.all(event.sharedMap.get('repos').map(async (repo: string) => {
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

      return allDependencies as Dependency[];
    } catch (error) {
      console.error("Error fetching dependencies:", error);
      return [] as Dependency[];
    }
  });
  
  
  export default component$(() => {
    const repoDependencies = useGetDependenciesForRepo();
    const packageJsons = useGetPackageJson();





    const state = useStore({
        count: 0,
        number: 20,
        repos: [],
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
          {repoDependencies.value?.map((dependency, depIndex) => {
            const repoPackageNames = packageJsons.value[depIndex]?.devDependencies ? Object.keys(packageJsons.value[depIndex].devDependencies) : [];
            console.log("THE DEPENDENCY FOR THIS REPO", dependency);
            // Skip rendering if no dependencies
            if (repoPackageNames.length === 0) return null;

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
                  {[...new Set(repoPackageNames)].map((packageName) => {
                    const packageName_str = packageName as string;
                    //@ts-ignore
                    const packageDetails = dependency.sbom?.packages?.find(
                      (item: { name: string }) => item.name === packageName_str
                    );
                    console.log("PACKAGE DETAILS", packageDetails);
                    return (
                      <div key={packageName_str} style={{
                        backgroundColor: 'white',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}>
                        <div style={{fontWeight: 'bold', color: 'black'}}>
                          {packageName_str}
                        </div>
                        <div style={{color: '#666', fontSize: '0.9rem'}}>
                          { packageDetails?.versionInfo || '-'}
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
  
