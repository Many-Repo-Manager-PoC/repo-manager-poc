import {
  component$,
} from "@builder.io/qwik";
// import { ServerDataContext } from "~/routes/layout";
import type { Dependency } from "~/types";
interface DependencyProps {
  repoDependencies: Dependency;
  packageJsons?: any;
  repoDetails?: boolean;
}

export default component$<DependencyProps>(({ repoDependencies,repoDetails }) => {
  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'center',
        padding: repoDetails ? 0 : '2rem'
      }}>
        {(() => {
  
          const reponame = repoDependencies.dependencies.sbom?.name?.split('/').pop() || '-';
          const repoPackageNames = repoDependencies.dependencies.sbom?.packages?.map((p) => p.name);

          // const repoDependencies1 = packageJsons?.packageJson?.dependencies;
          // const repoDevDependencies2 = packageJsons?.packageJson?.devDependencies;

          return (
            <div key={repoDependencies.dependencies.sbom?.SPDXID} style={{
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minWidth: '300px',
              maxWidth: '400px'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                color: 'black'
              }}>
                {reponame}
                {/* {repoDependencies.dependencies.sbom?.name?.split('/').pop() || '-'} */}
              </h3>
              <div>
              {reponame}
                </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {[...new Set(repoPackageNames)].map((packageName) => {
                  const packageName_str = packageName.startsWith('com') ? packageName.split('/').pop() : packageName;
                  // const devDependencies = repoDependencies.devDependencies.sbom?.packages?.find(
                  //   (item: { name: string }) => item.name === packageName_str
                  // );

                  const packageDetails = repoDependencies.dependencies.sbom?.packages?.find(
                    (item: { name: string }) => item.name === packageName_str
                  );

        
                  // const isDev = packageJsons?.some(pkgJson => pkgJson.devDependencies?.[packageName_str] !== undefined);
                  const version = repoPackageNames.includes(packageName_str || "") ? packageDetails?.versionInfo : null;
                  // TODO: REMOVE THIS HARDCODED 
                  const isDev = true;
                  return (
                    <div key={packageName_str} style={{
                      backgroundColor: 'white',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{fontWeight: 'bold', color: 'black'}}>
                          {packageName_str}
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                          <div style={{
                            fontSize: '0.8rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#e8f5e9',
                            color: '#2e7d32'
                          }}>
                            version: {version}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isDev ? '#e0f7fa' : '#f3e5f5',
                            color: isDev ? '#00838f' : '#7b1fa2'
                          }}>
                            {isDev ? 'dev' : 'prod'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
});
