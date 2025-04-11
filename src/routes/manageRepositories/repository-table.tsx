import styles from "./manageRepositories.css?inline";
import { component$, useStyles$, useContext } from "@builder.io/qwik";
import { ServerDataContext } from "../layout";
import { Separator } from "@qwik-ui/headless";

export const RepositoryTable = component$(() => {
  useStyles$(styles);
  const serverData = useContext(ServerDataContext);

  return (
    <div class="container">
      <div class="flex flex-col gap-2">
        {serverData.repos.map((repo) => (
          <div key={repo.id}>
            <div class="flex justify-between items-center p-4">
              <div>
                <h3 class="highlight text-lg font-bold">{repo.name}</h3>
                <p class="text-sm text-white-600 ">{repo.description}</p>
              </div>
              <div class="flex gap-2">
                <button class="border-none bg-blue-500 text-white px-4 py-2 rounded">
                  Edit
                </button>
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
});
