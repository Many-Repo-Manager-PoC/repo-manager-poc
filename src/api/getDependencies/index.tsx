import { type Dependency } from "../../types/index";
import { routeLoader$ } from "@builder.io/qwik-city";

import metadata from "../../../metadata.json";
// import { useGetRepos } from "../../api/getRepositories";
// export { useGetRepos } from "../../api/getRepositories";
import { useGetRepo } from "../../api/getRepositories";
export { useGetRepo } from "../../api/getRepositories";

//this gets the dependencies for each repo
// eslint-disable-next-line qwik/loader-location
export const useGetDependenciesForRepo = routeLoader$(async (event) => {
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;
  const repos = metadata.dependencyPaths;
  const urls = repos.map((repo: string) => `https://api.github.com/repos/${metadata.owner}/${repo}/dependency-graph/sbom`);

  const allDependencies = await Promise.all(urls.map(async (url: string, index: number) => {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Cloudflare Worker",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error(`HTTP error for ${repos[index]}! status: ${response.status}`);
        return {
          repo: repos[index],
          dependencies: null,
          error: `HTTP error: ${response.status}`
        };
      }
      
      const dependencies = await response.json();
      return {
        repo: repos[index],
        dependencies,
        error: null
      };
      
    } catch (error) {
      console.error(`Error fetching dependencies for ${repos[index]}:`, error);
      return {
        repo: repos[index],
        dependencies: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }));

  return allDependencies as {
    repo: string;
    dependencies: Dependency[] | null;
    error: string | null;
  }[];
});

//this gets the dependencies for a single repo
// eslint-disable-next-line qwik/loader-location
export const useGetDependenciesForSingleRepo = routeLoader$(async (event) => {
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;
  await event.resolveValue(useGetRepo) || [];

  const currentRepository = await event.sharedMap.get('currentRepository');
  const repo = currentRepository?.name;
  if (!repo) {
    console.error('No repository name found in current state');
    return null;
  }
  
//   const repo = await event.sharedMap.get('currentRepository');
  try {
    const response = await fetch(`https://api.github.com/repos/${metadata.owner}/${repo}/dependency-graph/sbom`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Cloudflare Worker",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const dependencies = await response.json();
    return dependencies as Dependency[];
    
  } catch (error) {
    console.error(`Error fetching dependencies for ${repo}:`, error);
    return [] as Dependency[];
  }
});