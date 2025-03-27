import metadata from "../../../metadata.json";
import { routeAction$ } from '@builder.io/qwik-city';
import { Octokit } from "octokit";

// replaces all the topics for a single repo
// eslint-disable-next-line qwik/loader-location
export const usePutTopics = routeAction$(async (data, event) => {
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;
  const repo = data.repo as string;
  const topics = data.topics as string[];

  try {
    const octokit = new Octokit({
      auth: accessToken
    });

    await octokit.rest.repos.replaceAllTopics({
      owner: metadata.owner,
      repo: repo,
      names: topics,
    });

    return {
      success: true
    };

  } catch (error) {
    console.error("Error updating topics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
});

// replaces all the topics for a given set of repos
// eslint-disable-next-line qwik/loader-location
export const usePutBulkTopics = routeAction$(async (data, event) => {
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;
  const repos = data.repos as string[];
  const reposTopics = data.reposTopics as Record<string, string[]>;

  try {
    const octokit = new Octokit({
      auth: accessToken
    });

    await Promise.all(repos.map(async (repo) => {
      console.log(`Updating repo ${repo} with topics:`, reposTopics[repo]); // Debug log
      
      await octokit.rest.repos.replaceAllTopics({
        owner: metadata.owner,
        repo: repo,
        names: reposTopics[repo],
      });
    }));

    return {
      success: true
    };

  } catch (error) {
    console.error("Error updating repo topics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
});
