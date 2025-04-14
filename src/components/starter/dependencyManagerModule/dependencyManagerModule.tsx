import {
    component$,
  } from "@builder.io/qwik";
  
  interface DependencyProps {
    packageJsons?: any;
    repoName: string;
    repoVersion: string;
  }
  
  export default component$<DependencyProps>(({ packageJsons,repoName,repoVersion }) => {
    const repoPackageNames = new Map<string, { version: string, sourceRepo: string }>();
    const repoDevDependencies = new Set<string>();

    packageJsons?.forEach((packageJson: any) => {
      if (packageJson.packageJson?.dependencies) {
        Object.entries(packageJson.packageJson.dependencies).forEach(([name, version]) => {
          if (name === repoName) {
            repoPackageNames.set(name, { version: version as string, sourceRepo: packageJson.repo });
          }
        });
      }
      if (packageJson.packageJson?.devDependencies) {
        Object.entries(packageJson.packageJson.devDependencies).forEach(([name, version]) => {
          if (name === repoName) {
            repoPackageNames.set(name, { version: version as string, sourceRepo: packageJson.repo });
            repoDevDependencies.add(name);
          }
        });
      }
    });


  
    return (
      <div class="container container-center">
        <div role="presentation" class="ellipsis"></div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div key={repoVersion} style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '300px',
            maxWidth: '400px'
          }}>
            <h4 style={{
              margin: '0 0 1rem 0',
              color: 'black'
            }}>
              {repoName}
            </h4>
            <h4 style={{
              margin: '0 0 1rem 0',
              color: 'grey'
            }}>Version: {repoVersion}</h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {Array.from(repoPackageNames.entries()).map(([name, { version, sourceRepo }]) => {
                const packageName_str = name.startsWith('com') ? name.split('/').pop() : name;
                const isDev = repoDevDependencies.has(name);
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
                        {sourceRepo}
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <div style={{
                          fontSize: '0.8rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: version < repoVersion ? '#fff8e1' : '#e8f5e9',
                          color: version < repoVersion ? '#f57c00' : '#2e7d32',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {version < repoVersion && '⚠️ '}
                          using version: {version}
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
        </div>
      </div>
    );
  });