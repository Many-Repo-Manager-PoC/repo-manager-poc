import { component$, Slot, useStyles$, createContextId, useContextProvider } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import { useGetRepos } from "../api/getRepositories";
export { useGetRepos } from "../api/getRepositories";
import { useGetDependenciesForRepo } from "../api/getDependencies";
export { useGetDependenciesForRepo } from "../api/getDependencies";
import { useGetPackageJson } from "../api/getPackageJson";
export { useGetPackageJson } from "../api/getPackageJson";

import Header from "~/components/starter/header/header";
import Footer from "~/components/starter/footer/footer";
import styles from "./styles.css?inline";
import type { Repo, Dependency, PackageJson } from "~/types";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

// Define the type for server data
export interface ServerData {
  date: string;
  repos: Repo[];
  dependencies: Dependency[];
  packageJsons: PackageJson[];
}

// Create the context ID outside the component
export const ServerDataContext = createContextId<ServerData>('server-data');

export const useServerTimeLoader = routeLoader$(async (event) => {
  const repos = await event.resolveValue(useGetRepos);
  const dependencies = await event.resolveValue(useGetDependenciesForRepo);
  const packageJsons = await event.resolveValue(useGetPackageJson);

  return {
    date: new Date().toISOString(),
    repos,
    dependencies,
    packageJsons
  };
});

export default component$(() => {
  useStyles$(styles);
  const serverData = useServerTimeLoader();

  // Provide the server data through context
  //@ts-ignore
  useContextProvider(ServerDataContext, serverData.value);

  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  );
});
