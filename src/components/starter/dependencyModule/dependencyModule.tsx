import {
  component$,
} from "@builder.io/qwik";
import styles from "./dependencyModule.module.css";
import type { Dependency,PackageJson } from "~/types";


interface DependencyProps {
  repoDependencies?: Dependency;
  repoDetails?: boolean;
  packageJsons?: PackageJson | null;
}

const getContainerStyles = (repoDetails: boolean) => ({
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '2rem',
  justifyContent: 'center',
  padding: repoDetails ? '0' : '2rem',
  margin: repoDetails ? '0' : '1rem'
});

export default component$<DependencyProps>(({ repoDependencies, repoDetails, packageJsons }) => {
  const reponame = repoDependencies?.dependencies?.sbom?.name?.split('/').pop() || packageJsons?.repo;
  const repoVersion = packageJsons?.packageJson?.version;
  const repoProdDependencies = Object.fromEntries(
    Object.entries(packageJsons?.packageJson?.dependencies || {})
  );
  const repoDevDependencies = Object.fromEntries(
    Object.entries(packageJsons?.packageJson?.devDependencies || {})
  );
  const repoPackageNames = [...Object.entries(repoProdDependencies), ...Object.entries(repoDevDependencies)];

  if ([...new Set(repoPackageNames)].length === 0) {
    return null;
  }

  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <div style={getContainerStyles(repoDetails || false)}>
        <div key={repoDependencies?.dependencies?.sbom?.SPDXID} class={styles.dependencyCard}>
          <h4 class={styles.title}>
            {reponame}
          </h4>
          <h5 class={styles.title}>Version: {repoVersion}</h5>
          <div class={styles.dependenciesList}>
            {[...new Set(repoPackageNames)].map(([packageName, version]) => {
              const packageName_str = packageName.startsWith('com') ? packageName.split('/').pop() : packageName;
              const isDev = Object.keys(repoDevDependencies).includes(packageName_str as string);
              return (
                <div key={packageName_str} class={styles.packageItem}>
                  <div class={styles.packageHeader}>
                    <div class={styles.packageName}>
                      {packageName_str}
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      <div class={styles.versionBadge}>
                        version: {version as string}
                      </div>
                      <div class={`${styles.typeBadge} ${isDev ? styles.dev : styles.prod}`}>
                        {isDev ? 'dev' : 'prod'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
