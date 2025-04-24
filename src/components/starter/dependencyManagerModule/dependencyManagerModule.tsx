import {
    component$,
    useSignal,
} from "@builder.io/qwik";
import semver from 'semver';
import { useForm, zodForm$ } from "@modular-forms/qwik";
import { z } from "zod";
import { postWorkflowDispatchEvent } from "~/api/postWorkflowDispatchEvent";
import styles from "./dependencyManagerModule.module.css";


interface DependencyProps {
  packageJsons?: any;
  repoName: string;
  repoVersion: string;
}

const updateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  files: z.array(z.string()).min(1, "At least one file must be selected")
});

type UpdateForm = z.infer<typeof updateSchema>;

export default component$<DependencyProps>(({ packageJsons, repoName, repoVersion }) => {
  const formattedRepoName = repoName.split('/').pop();
  const showModal = useSignal(false);
  const selectedRepo = useSignal("");
  const selectedVersion = useSignal("");
  const action = postWorkflowDispatchEvent();
  const [, { Form, Field }] = useForm<UpdateForm>({
    loader: {
      value: {
        title: `Update Package: ${formattedRepoName} from version ${selectedVersion.value} to ${repoVersion}`,
        message: "This is an automatically generated Pull request from The Kunai Github Repositories Manger. Please review and test before merging into main.",
        files: ["package.json"]
      }
    },
    validate: zodForm$(updateSchema),
  });

  const dependentRepos = new Set<[string, string]>();
  semver.minVersion(repoVersion);
  packageJsons?.forEach((packageJson: any) => {
    const { dependencies, devDependencies } = packageJson.packageJson || {};
    
    if (dependencies && Object.keys(dependencies).includes(repoName)) {
      dependentRepos.add([packageJson.repo, dependencies[repoName] as string]);
    }
    
    if (devDependencies && Object.keys(devDependencies).includes(repoName)) {
      dependentRepos.add([packageJson.repo, devDependencies[repoName] as string]);
    }
  });

  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <div class={styles.container}>
        <div key={repoVersion} class={styles.card}>
          <h4 class={styles.heading}>
            {formattedRepoName}
          </h4>
          <h4 class={styles.subheading}>
            Version: {repoVersion}
          </h4>
          <div class={styles.repoList}>
            {Array.from(dependentRepos).map(([repo, version]) => {
              const minVersion = semver.minVersion(repoVersion);
              const needsUpdate = minVersion && semver.lt(version, minVersion.version);
              return (
                <div key={repo} class={styles.repoItem}>
                  <div class={styles.repoHeader}>
                    <div class={styles.repoName}>
                      {repo}
                    </div>
                    <div class={`${styles.versionBadge} ${needsUpdate ? styles.needsUpdate : styles.upToDate}`}>
                      {needsUpdate && '⚠️ '}
                      using version: {version}
                    </div>
                  </div>
                  {needsUpdate && (
                    <button
                      class={styles.updateButton}
                      onClick$={() => {
                        selectedRepo.value = repo;
                        selectedVersion.value = version;
                        showModal.value = true;
                      }}
                    >
                      Update to current version
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal.value && (
        <div class={styles.modalOverlay}>
          <div class={styles.modalContent}>
            <Form onSubmit$={async (values) => {
              const updatedPackageJson = packageJsons.find((p: any) => p.repo === selectedRepo.value);
              if (updatedPackageJson) {
                const { dependencies, devDependencies } = updatedPackageJson.packageJson;
                if (dependencies && dependencies[repoName]) {
                  dependencies[repoName] = repoVersion;
                }
                if (devDependencies && devDependencies[repoName]) {
                  devDependencies[repoName] = repoVersion;
                }
              }

              await action.submit({
                repo_name: selectedRepo.value,
                package_version: repoVersion,
                pr_title: `Update Package: ${formattedRepoName} from version ${selectedVersion.value} to ${repoVersion}`,
                pr_body: values.message,
                package_name: repoName,
              });
              showModal.value = false;
            }}>
              <h4 class={styles.subheading}>Update Details</h4>
              <div class={styles.repoList}>
                <Field name="title">
                  {(field, props) => (
                    <div class={styles.repoItem}>
                      <label class={styles.repoName}>Title</label>
                      <input {...props} type="text" defaultValue={`Update Package: ${formattedRepoName} from version ${selectedVersion.value} to ${repoVersion}`} class={styles.repoItem} />
                      {field.error && <div class={styles.errorText}>{field.error}</div>}
                    </div>
                  )}
                </Field>
                <Field name="message">
                  {(field, props) => (
                    <div class={styles.repoItem}>
                      <label class={styles.repoName}>Message</label>
                      <textarea {...props} value={field.value} class={styles.repoItem} />
                      {field.error && <div class={styles.errorText}>{field.error}</div>}
                    </div>
                  )}
                </Field>
                <Field name="files" type="string[]">
                  {(field) => (
                    <div class={styles.repoItem}>
                      <label class={styles.repoName}>Files to be Updated:</label>
                      <div class={styles.repoFile}>
                        <div>package.json</div>
                        <div>package-lock.json</div>
                      </div>
                      {field.error && <div class={styles.errorText}>{field.error}</div>}
                    </div>
                  )}
                </Field>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" class={styles.updateButton}>Submit Update</button>
                <button type="button" class={styles.updateButton} onClick$={() => showModal.value = false}>Cancel</button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
});