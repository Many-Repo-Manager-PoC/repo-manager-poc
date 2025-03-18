  import { routeLoader$ } from "@builder.io/qwik-city";
  import { type PackageJson } from "../../types/index";
  import { useGetDependenciesForRepo } from "../getDependencies";
  export { useGetDependenciesForRepo } from "../getDependencies";
  import metadata from "../../../metadata.json";
  
  // this gets the package.json for a single repo
  // although the package.json must be at the root of the repo or it will not work
  // eslint-disable-next-line qwik/loader-location
  export const useGetPackageJson = routeLoader$(async (event) => {
    const session = event.sharedMap.get("session");
    const accessToken = session?.user?.accessToken;
    const repos = metadata.dependencyPaths;
    await event.resolveValue(useGetDependenciesForRepo) || [];

    try {
      const packageJsons:PackageJson[] = await Promise.all(repos.map(async (repo: string) => {
        try {
          const response = await fetch(`https://api.github.com/repos/${metadata.owner}/${repo}/contents/package.json`, {
            headers: {
              Accept: "application/json",
              "User-Agent": "Cloudflare Worker", 
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const packageJson = await response.json() as {content: string};
          const content:PackageJson = JSON.parse(atob(packageJson.content));
 
          return {
            devDependencies:content.devDependencies,
            name: content.name,
            version: content.version,
            dependencies: content.dependencies,
            repo: repo,
          };
        } catch (error) {
          console.error(`Error fetching dependencies for ${repo}:`, error);
          return {
            name: '',
            version: '',
            dependencies: {},
            devDependencies: {},
            repo: repo,
          } as PackageJson;
        }
      }));

      return packageJsons;
    } catch (error) {
      console.error("Error in useGetPackageJson:", error);
      return [];
    }
  });
