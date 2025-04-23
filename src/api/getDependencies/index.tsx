import { type Dependency } from "../../types/index";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Octokit } from "octokit";
import metadata from "../../../metadata.json";

//this gets the dependencies for each repo
// eslint-disable-next-line qwik/loader-location
export const useGetDependenciesForRepo = routeLoader$(async (event) => {
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;
  console.log(accessToken);

  try {
    const octokit = new Octokit({
      auth: accessToken
    });

    const repos = metadata.repositories;

    const allDependencies = await Promise.all(repos.map(async (repo: string) => {
      try {
        const response = await octokit.rest.dependencyGraph.exportSbom({
            owner: metadata.owner,
            repo: repo
        })
        return {
          repo: repo,
          dependencies: response.data,
          error: null
        };

      } catch (error) {
        console.error(`Error fetching dependencies for ${repo}:`, error);
        return {
          repo: repo,
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

  } catch (error) {
    console.error("Error initializing Octokit:", error);
    return [] as {
      repo: string;
      dependencies: Dependency[] | null;
      error: string | null;
    }[];
  }
});
