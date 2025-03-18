import {
  component$,
  useContext,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { ServerDataContext } from "../layout";
import Dependency from "~/components/starter/dependency/dependency";

export default component$(() => {
  const serverData = useContext(ServerDataContext);
  const repoDependencies = serverData.dependencies;
  const packageJsons = serverData.packageJsons;

  return (
    <div>
      <h1>
        <span class="highlight">Repo</span> Dependencies
      </h1>
      <Dependency
        dependencies={repoDependencies}
        packageJsons={packageJsons}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dependencies",
};
