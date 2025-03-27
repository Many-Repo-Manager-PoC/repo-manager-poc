import { routeLoader$ } from "@builder.io/qwik-city";
import metadata from "../../../metadata.json";
import { Octokit } from "octokit";

// gets all repos from the given owner and given list of repos in metadata.json
// eslint-disable-next-line qwik/loader-location
export const useGetRepos = routeLoader$(async (event) => {
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;
  try {
    const octokit = new Octokit({
      auth: accessToken
    });

    // Set initial state in shared map
    event.sharedMap.set('repos', metadata.repositories);
    
    const repositories = await Promise.all(
      metadata.repositories.map(async (repoName) => {
        const { data } = await octokit.rest.repos.get({
          owner: metadata.owner,
          repo: repoName
        });
        return data;
      })
    );
    return repositories;
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
});

// gets a single repo
// eslint-disable-next-line qwik/loader-location
export const useGetRepo = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    try {
      const octokit = new Octokit({
        auth: accessToken
      });
  
      // Set initial state in shared map
      const repo = event.sharedMap.get("repos");
      
      const repository =  await octokit.rest.repos.get({
            owner: metadata.owner,
            repo: repo.name
        });

      return repository;
    } catch (error) {
      console.error("Error fetching repository:", error);
      return [];
    }
  });