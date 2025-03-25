import metadata from "../../../metadata.json";
import { routeAction$ } from '@builder.io/qwik-city';
 
// Creates a new repository in the organization
// eslint-disable-next-line qwik/loader-location
export const usePostNewRepository = routeAction$(async (data, event) => {
  // This will only run on the server when the user submits the form (or when the action is called programmatically)
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;
  console.log("HEY TOURE HERE AT THE API");
  console.log(accessToken);
  console.log(data);
  

  try {
    const response = await fetch(`https://api.github.com/orgs/${metadata.owner}/repos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "User-Agent": "Cloudflare Worker",
        Authorization: `Bearer ${accessToken}`, 
      },
      body: JSON.stringify({
          owner: metadata.owner,
          name: data.repoName,
          description: data.repoDescription,
          homepage: data.homepage,
          private: data.isPrivate,
          visibility: data.visibility,
          has_issues: data.hasIssues,
          has_projects: data.hasProjects,
          has_wiki: data.hasWiki,
          has_downloads: data.hasDownloads,
          is_template: data.isTemplate,
          team_id: data.teamId,
          auto_init: data.autoInit,
          gitignore_template: data.gitignoreTemplate,
          license_template: data.licenseTemplate,
          allow_squash_merge: data.allowSquashMerge,
          allow_merge_commit: data.allowMergeCommit,
          allow_rebase_merge: data.allowRebaseMerge,
          allow_auto_merge: data.allowAutoMerge,
          delete_branch_on_merge: data.deleteBranchOnMerge,
          use_squash_pr_title_as_default: data.useSquashPrTitleAsDefault,
          squash_merge_commit_title: data.squashMergeCommitTitle,
          squash_merge_commit_message: data.squashMergeCommitMessage,
          merge_commit_title: data.mergeCommitTitle,
          merge_commit_message: data.mergeCommitMessage,
          custom_properties: data.customProperties,
      })
    });
    console.log("HEY did the call happen?",response);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return {
      success: true
    };

  } catch (error) {
    console.error("Error creating repository:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }

});



// Creates a new repository for a user
// eslint-disable-next-line qwik/loader-location
export const usePostNewUserRepository = routeAction$(async (data, event) => {
    // This will only run on the server when the user submits the form (or when the action is called programmatically)
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    console.log("HEY TOURE HERE AT THE API");
    console.log(accessToken);
    console.log(data);
  
    try {
      const response = await fetch(`https://api.github.com/user/repos`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "User-Agent": "Cloudflare Worker",
          Authorization: `Bearer ${accessToken}`, 
        },
        body: JSON.stringify({
            name: data.repoName,
            description: data.repoDescription,
            homepage: data.homepage,
            private: data.isPrivate,
            has_issues: data.hasIssues,
            has_projects: data.hasProjects,
            has_wiki: data.hasWiki,
            has_discussions: data.hasDiscussions,
            team_id: data.teamId,
            auto_init: data.autoInit,
            gitignore_template: data.gitignoreTemplate,
            license_template: data.licenseTemplate,
            has_downloads: data.hasDownloads,
            is_template: data.isTemplate,
            allow_squash_merge: data.allowSquashMerge,
            allow_merge_commit: data.allowMergeCommit,
            allow_rebase_merge: data.allowRebaseMerge,
            allow_auto_merge: data.allowAutoMerge,
            delete_branch_on_merge: data.deleteBranchOnMerge,
            use_squash_pr_title_as_default: data.useSquashPrTitleAsDefault,
            squash_merge_commit_title: data.squashMergeCommitTitle,
            squash_merge_commit_message: data.squashMergeCommitMessage,
            merge_commit_title: data.mergeCommitTitle,
            merge_commit_message: data.mergeCommitMessage,
        })
      });
  
      console.log("HEY did the call happen?",response);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      return {
          success: true,
        };
  
    } catch (error) {
      console.error("Error creating repository:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  
  });