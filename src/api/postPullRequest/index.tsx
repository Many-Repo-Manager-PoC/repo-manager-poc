import metadata from "../../../metadata.json";
import { routeAction$ } from '@builder.io/qwik-city';
import { Octokit } from "octokit";

// post pull request with updated input files
// eslint-disable-next-line qwik/loader-location
export const postPullRequest = routeAction$(async (data, event) => {
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;  
  const repo = data.repo as string;


  try {
    const octokit = new Octokit({
      auth: accessToken
    });

    await octokit.rest.pulls.create({
        owner: metadata.owner,
        repo: repo,
        head: 'main',
        base: 'main',
        title: data.title as string,
        body: data.message as string,
        files: data.files as string[],
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