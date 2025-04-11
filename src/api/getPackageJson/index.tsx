  import { routeLoader$ } from "@builder.io/qwik-city";
  import { useGetDependenciesForRepo } from "../getDependencies";
  export { useGetDependenciesForRepo } from "../getDependencies";
  import metadata from "../../../metadata.json";
  import { Octokit } from "octokit";

  // this gets the package.json for all repos in metadata.json
  // although the package.json must be at the root of the repo or it will not work
  // eslint-disable-next-line qwik/loader-location
  export const useGetPackageJson = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    try {
      const octokit = new Octokit({
        auth: accessToken
      });

      const paths = metadata.dependencyPaths;
      await event.resolveValue(useGetDependenciesForRepo);

      const packageJsons: Array<{
        repo: string;
        packageJson: any;
        error: string | null;
      }> = await Promise.all(
        paths.map(async (path: string[]) => {
            const { data } = await octokit.rest.repos.getContent({
              owner: metadata.owner,
              repo: path[0],
              path: path[1],
              mediaType: {
                format: "object"
              }
            });
            const content = atob((data as { content: string }).content || "");
            const packageJson = JSON.parse(content);
            return {
              repo: path[0],
              packageJson,
              error: null
            };

        })
      );

      return packageJsons;
    } catch (error) {
      console.error("Error fetching package.json:", error);
      return [];
    }
  });