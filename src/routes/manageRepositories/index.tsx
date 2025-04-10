import { component$, useStyles$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import styles from "./manageRepositories.css?inline";
import { RepositoryTable } from "./repository-table";


export default component$(() => {
  useStyles$(styles);

  return (
    <>
    <div>
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <h1>
        <span class="highlight">Manage</span> Repositories
      </h1>
      <RepositoryTable />
      </div>
    </div>
  </>
  );
});

export const head: DocumentHead = {
  title: "Manage Repositories",
  meta: [
    {
      name: "description",
      content: "Manage Repositories",
    },
  ],
};
