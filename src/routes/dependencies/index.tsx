import {
  component$,
  useContext,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { ServerDataContext } from "../layout";
import DependencyModule from "~/components/starter/dependencyModule/dependencyModule";
import type { Dependency as DependencyType } from "~/types";

export default component$(() => {
  const serverData = useContext(ServerDataContext);
  const repoDependencies = serverData.dependencies;
  console.log("THESE ARE THE REPO DEPENDENCIES", repoDependencies);
  const packageJsons = serverData.packageJsons;

  return (
    <div>
      <h1>
        <span class="highlight">Repo</span> Dependencies
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', padding: '1rem' }}>
        {repoDependencies.map((dependency: DependencyType, index: number) => (
          <DependencyModule
            key={dependency.repo}
            repoDependencies={dependency}
            packageJsons={[packageJsons[index]]}
          />
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dependencies",
};
