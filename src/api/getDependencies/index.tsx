  import { type Dependency  } from "../../types/index";
  import { routeLoader$ } from "@builder.io/qwik-city";
  import { useGetReposForDependencies } from "../getRepositories";
  export { useGetReposForDependencies } from "../getRepositories";

  //this gets the dependencies for each repo
  // eslint-disable-next-line qwik/loader-location
  export const useGetDependenciesForRepo = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    await event.resolveValue(useGetReposForDependencies) || [];
    
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