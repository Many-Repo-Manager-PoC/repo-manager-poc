import { component$, useStyles$ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import styles from "./createRepositories.css?inline";

export const SelectRepositoryType = component$(({ selectedType }: { selectedType: Signal<string> }) => {
  useStyles$(styles);

  return (
    <div class="formContainer">
      <h2 class="formHeader">Step 1: Select a repository type</h2>
      <div class="formGroup">
        <select 
          class="select" 
          name="repositoryType" 
          value={selectedType.value}
          onChange$={(e) => {
            const value = (e.target as HTMLSelectElement).value;
            selectedType.value = value;
          }}
        >
          <option value="">Select a type...</option>
          <option value="user">User Repository</option>
          <option value="organization">Organization Repository</option>
        </select>
      </div>
    </div>
  );
});
