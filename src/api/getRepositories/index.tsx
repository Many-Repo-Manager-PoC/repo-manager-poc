import { type Repo } from "../../types/index";
import { routeLoader$ } from "@builder.io/qwik-city";
import { repo } from "../../types/consts";
import metadata from "../../../metadata.json";


// eslint-disable-next-line qwik/loader-location
export const useGetRepos = routeLoader$(async (event) => {
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;

  try {
    const repositories = await Promise.all(metadata.repositories.map(async (repoName) => {
      const response = await fetch(`https://api.github.com/repos/nabrams/${repoName}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Cloudflare Worker",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      return await response.json();
    }));

    return repositories as Repo[];
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [] as Repo[];
  }
});

  //this gets all the repos from the org
  //would like to be able to pass in the org name as a param or take it from the session
  // eslint-disable-next-line qwik/loader-location
  export const useGetReposForDependencies = routeLoader$(async (event) => {
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


// eslint-disable-next-line qwik/loader-location
export const useGetRepo = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    const repo = event.params.repo;
  
    try {
      const response = await fetch(`https://api.github.com/orgs/kunai-consulting/repos/${repo}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Cloudflare Worker",
          Authorization: `Bearer ${accessToken}`, 
        },
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const currentRepository = await response.json();
      event.sharedMap.set('currentRepository', currentRepository);
      return currentRepository as Repo;
    } catch (error) {
      console.error("Error fetching repos:", error);
      return {} as Repo;
    }
  });