import { component$, useStyles$, useSignal } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { NewRepositoryForm } from "./new-repository-form";
import { SelectRepositoryType } from "./select-repository-type";
import styles from "./createRepositories.css?inline";



export default component$(() => {
  const selectedType = useSignal<string>('');
  useStyles$(styles);

  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <h1>
        <span class="highlight">Create</span> a Repository
      </h1>
      <SelectRepositoryType selectedType={selectedType} />
      {selectedType.value && (
        <div>
          {selectedType.value === 'user' ? (
            <NewRepositoryForm key={selectedType.value} repoType="user" />
          ) : selectedType.value === 'organization' ? (
            <NewRepositoryForm key={selectedType.value} repoType="organization" />
          ) : null}
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Create Repository",
  meta: [
    {
      name: "description",
      content: "Create a new repository",
    },
  ],
};
