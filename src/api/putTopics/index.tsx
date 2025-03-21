import metadata from "../../../metadata.json";
import { routeAction$ } from '@builder.io/qwik-city';
 
// replaces all the topics for a given repo
// eslint-disable-next-line qwik/loader-location
export const usePutTopics = routeAction$(async (data, event) => {
  // This will only run on the server when the user submits the form (or when the action is called programmatically)
  const session = event.sharedMap.get("session");
  const accessToken = session?.user?.accessToken;
  const repo = data.repo;
  const topics = data.topics;
  try {
    const response = await fetch(`https://api.github.com/repos/${metadata.owner}/${repo}/topics`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "User-Agent": "Cloudflare Worker",
        Authorization: `Bearer ${accessToken}`, 
      },
      body: JSON.stringify({
          names: topics
      })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return {
        success: true,
      };

  } catch (error) {
    console.error("Error fetching repos:", error);
  }

});

// replaces all the topics for a given set of repos
// eslint-disable-next-line qwik/loader-location
export const usePutBulkTopics = routeAction$(async (data, event) => {
    // This will only run on the server when the user submits the form (or when the action is called programmatically)
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    const repos = data.repos as string[];
    const reposTopics = data.reposTopics as Record<string, string[]>;
    console.log("BULK UPDATE DATA:", {repos, reposTopics}); // Debug log

    try {
      await Promise.all(repos.map(async (repo) => {
        console.log(`Updating repo ${repo} with topics:`, reposTopics[repo]); // Debug log
        const response = await fetch(`https://api.github.com/repos/${metadata.owner}/${repo}/topics`, {
          method: "PUT",
          headers: {
            Accept: "application/json", 
            "User-Agent": "Cloudflare Worker",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            names: reposTopics[repo]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error for ${repo}:`, errorText); // Debug log
          throw new Error(`HTTP error for ${repo}! status: ${response.status} - ${errorText}`);
        }

        return response;
      }));

      return {
        success: true
      };

    } catch (error) {
      console.error("Error updating repo topics:", error);
    }
  });
