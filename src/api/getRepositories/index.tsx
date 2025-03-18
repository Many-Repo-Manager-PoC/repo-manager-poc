import { type Repo } from "../../types/index";
import { routeLoader$ } from "@builder.io/qwik-city";
import metadata from "../../../metadata.json";

// gets all repos from the given owner and given list of repos in metadata.json
// eslint-disable-next-line qwik/loader-location
export const useGetRepos = routeLoader$(async (event) => {
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;

  // Set initial state in shared map
  event.sharedMap.set('repos', metadata.repositories);
  const urls = metadata.repositories.map((repoName) => `https://api.github.com/repos/${metadata.owner}/${repoName}`);



  try {
    const repositories = await Promise.all(urls.map(async (url) => {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Cloudflare Worker",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();

    /// these 3 lines are for getting the repo names from the repose 
    //   const reposData: { name: string }[] = await response.json();
    //   const repoNames = reposData.map((repo: { name: string }) => repo.name);
    //   event.sharedMap.set('repos', repoNames);
    }));

    return repositories as Repo[];
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [] as Repo[];
  }
});

// gets a single repo
// eslint-disable-next-line qwik/loader-location
export const useGetRepo = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    const repo = event.sharedMap.get("repos");
  
    try {
      const response = await fetch(`https://api.github.com/repos/${metadata.owner}/${repo.name}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Cloudflare Worker",
          Authorization: `Bearer ${accessToken}`, 
        },
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const currentRepository = await response.json();
      event.sharedMap.set('currentRepository', currentRepository);

      return currentRepository as string[]; // Return repo name as string array
    } catch (error) {
      console.error("Error fetching repos:", error);
      return [] as string[]; // Return empty string array on error
    }
  });