import metadata from "../../../metadata.json";
import { routeAction$ } from '@builder.io/qwik-city';
import { Octokit } from "octokit";

// Dispatches a workflow event to update a package to its latest version and create a pull request
// eslint-disable-next-line qwik/loader-location
export const postWorkflowDispatchEvent = routeAction$(async (data, event) => {
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;  
  const repo = data.repo as string;

  try {
    const octokit = new Octokit({
      auth: accessToken
    });

    await octokit.rest.actions.createWorkflowDispatch({
      owner: metadata.owner,
      repo: repo,
      workflow_id: 'update-dependencies.yml',
      ref: 'main',
      inputs: {
        repo_name: data.repo_name as string,
        package_name: data.package_name as string,
        package_version: data.package_version as string,
        pr_title: data.pr_title as string,
        pr_body: data.pr_body as string,
        owner: metadata.owner,
        gh_access_token: accessToken
      }
    });

    return {
      success: true
    };

  } catch (error) {
    console.error("Error dispatching workflow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
});