import {
    component$,
  } from "@builder.io/qwik";
  
  interface DependencyProps {
    packageJsons?: any;
    repoName: string;
    repoVersion: string;
  }
  
  export default component$<DependencyProps>(({ packageJsons,repoName,repoVersion }) => {
    const dependentRepos = new Set<[string, string]>();
    
    packageJsons?.forEach((packageJson: any) => {
      const { dependencies, devDependencies } = packageJson.packageJson || {};
      
      // Check regular dependencies
      if (dependencies && Object.keys(dependencies).includes(repoName)) {
        dependentRepos.add([packageJson.repo, dependencies[repoName] as string]);
      }
      
      // Check dev dependencies
      if (devDependencies && Object.keys(devDependencies).includes(repoName)) {
        dependentRepos.add([packageJson.repo, devDependencies[repoName] as string]);
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
              {Array.from(dependentRepos).map(([repo, version]) => {
                const needsUpdate = version < repoVersion;
                return (
                  <div key={repo} style={{
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
                        {repo}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: needsUpdate ? '#fff8e1' : '#e8f5e9',
                        color: needsUpdate ? '#f57c00' : '#2e7d32',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {needsUpdate && '⚠️ '}
                        using version: {version}
                      </div>
                    </div>
                    {needsUpdate && (
                      <button
                        style={{
                          marginTop: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          width: '100%'
                        }}
                        onClick$={() => {
                          // TODO: Implement update functionality
                          console.log(`Updating ${repo} to version ${repoVersion}`);
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
      </div>
    );
  });