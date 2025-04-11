import { component$, useStyles$, useSignal, $ } from "@builder.io/qwik";
import { GithubLicenses } from "../../types/consts";
import { usePostNewUserRepository } from "../../api/postNewRepository";
export { usePostNewUserRepository } from "../../api/postNewRepository";
import { useForm, zodForm$ } from "@modular-forms/qwik";
import { z } from "zod";
import styles from "./createRepositories.css?inline";

const newRepositorySchema = z.object({
  repoName: z.string().min(1, "Repository name is required"),
  repoDescription: z.string().optional(),
  homepage: z.string().url().optional(),
  visibility: z.enum(["public", "private"]).default("public").optional(),
  hasIssues: z.boolean().default(true).optional(),
  hasProjects: z.boolean().default(true).optional(),
  hasWiki: z.boolean().default(true).optional(),
  hasDownloads: z.boolean().default(true).optional(),
  isTemplate: z.boolean().default(false).optional(),
  teamId: z.number().optional(),
  autoInit: z.boolean().default(false).optional(),
  gitignoreTemplate: z.string().optional(),
  licenseTemplate: z.string().optional(),
  allowSquashMerge: z.boolean().default(true).optional(),
  allowMergeCommit: z.boolean().default(true).optional(),
  allowRebaseMerge: z.boolean().default(true).optional(),
  allowAutoMerge: z.boolean().default(false).optional(),
  deleteBranchOnMerge: z.boolean().default(false).optional(),
  useSquashPrTitleAsDefault: z.boolean().default(false).optional(),
  squashMergeCommitTitle: z.string().optional(),
  squashMergeCommitMessage: z.string().optional(),
  mergeCommitTitle: z.string().optional(),
  mergeCommitMessage: z.string().optional()
});

type NewRepositoryForm = z.infer<typeof newRepositorySchema>;

export const NewRepositoryForm = component$(({ repoType }: { repoType: string }) => {
  const isPending = useSignal(false);
  const action = usePostNewUserRepository();
  useStyles$(styles);
  const [, { Form, Field }] = useForm<NewRepositoryForm>({
    loader: {
      value: {
        repoName: "",
        visibility: "public",
        repoDescription: "",
        homepage: "",
        hasIssues: true,
        hasProjects: true,
        hasWiki: true,
        hasDownloads: true,
        isTemplate: false,
        teamId: undefined,
        autoInit: false,
        gitignoreTemplate: "",
        licenseTemplate: "",
        allowSquashMerge: true,
        allowMergeCommit: true,
        allowRebaseMerge: true,
        allowAutoMerge: false,
        deleteBranchOnMerge: false,
        useSquashPrTitleAsDefault: false,
        squashMergeCommitTitle: "",
        squashMergeCommitMessage: "",
        mergeCommitTitle: "",
        mergeCommitMessage: "",
      }
    },
    validate: zodForm$(newRepositorySchema)
  });
  console.log(repoType);
  const handleSubmit = $((values: NewRepositoryForm) => {
    isPending.value = true;
    try {
      const formData = {
        ...values,
        isPrivate: values.visibility === 'private'
      };
      action.submit(formData);
    } finally {
      isPending.value = false;
    }
  });

  return (
    <div class="formContainer">
      <h2 class="formHeader">Step 2: Fill in the details</h2>
      <Form onSubmit$={handleSubmit}>
        <div class="formGroup">
          <Field name="repoName">
            {(field, props) => (
              <>
                <label class="label">Repository Name *</label>
                <input 
                  class="input" 
                  type="text" 
                  {...props} 
                  value={field.value} 
                  required 
                />
                {field.error && <div class="error">{field.error}</div>}
              </>
            )}
          </Field>
        </div>

        <div class="formGroup">
          <Field name="repoDescription">
            {(field, props) => (
              <>
                <label class="label">Description</label>
                <textarea 
                  class="textarea" 
                  {...props} 
                  value={field.value} 
                  rows={3}
                />
              </>
            )}
          </Field>
        </div>

        <div class="formGroup">
          <Field name="homepage">
            {(field, props) => (
              <>
                <label class="label">Homepage URL</label>
                <input 
                  class="input" 
                  type="url" 
                  {...props} 
                  value={field.value} 
                />
              </>
            )}
          </Field>
        </div>

        <div class="formGroup">
          <Field name="visibility">
            {(field, props) => (
              <>
                <label class="label">Visibility</label>
                <select class="select" {...props} value={field.value}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </>
            )}
          </Field>
        </div>

        <div class="formGroup">
          <label class="label">Features</label>
          <div class="checkboxGroup">
            <Field name="hasIssues" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Enable Issues
                </label>
              )}
            </Field>
            <Field name="hasProjects" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Enable Projects
                </label>
              )}
            </Field>
            <Field name="hasWiki" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Create a Wiki
                </label>
              )}
            </Field>
            <Field name="hasDownloads" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Enable Downloads
                </label>
              )}
            </Field>
          </div>
        </div>

        <div class="formGroup">
          <label class="label">Initialize Repository</label>
          <div class="checkboxGroup">
            <Field name="autoInit" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Add README file
                </label>
              )}
            </Field>
            <Field name="isTemplate" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Is this a template repository?
                </label>
              )}
            </Field>
          </div>
        </div>

        <div class="formGroup">
          <Field name="gitignoreTemplate">
            {(field, props) => (
              <>
                <label class="label">Add .gitignore template</label>
                <select class="select" {...props} value={field.value}>
                  <option value="">None</option>
                  <option value="Node">Node</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="Rust">Rust</option>
                </select>
              </>
            )}
          </Field>
        </div>

        <div class="formGroup">
          <Field name="licenseTemplate">
            {(field, props) => (
              <>
                <label class="label" >Add a license</label>
                <select class="select" {...props} value={field.value}>
                  <option value="">None</option>
                  {GithubLicenses.map((license) => (
                    <option key={license.keyword} value={license.keyword}>
                      {license.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </Field>
        </div>

        <div class="formGroup">
          <label class="label">Merge Options</label>
          <div class="checkboxGroup">
            <Field name="allowSquashMerge" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Allow squash merging
                </label>
              )}
            </Field>
            <Field name="allowMergeCommit" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Allow merge commits
                </label>
              )}
            </Field>
            <Field name="allowRebaseMerge" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Allow rebase merging
                </label>
              )}
            </Field>
            <Field name="allowAutoMerge" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Allow auto-merge
                </label>
              )}
            </Field>
            <Field name="deleteBranchOnMerge" type="boolean">
              {(field, props) => (
                <label class="checkboxLabel">
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    {...props} 
                    checked={field.value} 
                  /> Automatically delete head branches
                </label>
              )}
            </Field>
          </div>
        </div>

        <button 
          class="button" 
          type="submit"
          disabled={isPending.value}
        >
          create repository
        </button>

        {action.value?.success && (
          <div class="successMessage">Repository created successfully!</div>
        )}
      </Form>
    </div>
  );
});
