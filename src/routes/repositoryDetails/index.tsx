import {
  component$,
  useContext,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { ServerDataContext } from "../layout";

export default component$(() => {
  const location = useLocation();
  const repoName = location.url.searchParams.get('repo');
  const serverData = useContext(ServerDataContext);

  const repo = serverData.repos.find(r => r.name === repoName);
  const repoDependencies = serverData.dependencies;
  const packageJsons = serverData.packageJsons;

  // Filter dependencies for current repo
  const currentRepoDependencies = repo ? 
    repoDependencies?.filter((_, index) => {
      return packageJsons[index]?.name === repoName;
    }) : [];

  const currentPackageJson = repo ?
    packageJsons?.find(pkg => pkg.name === repoName) : null;

  return (
    <>
      <div class="container">
        {repo ? (
          <div>
            <h1>
              <span class="highlight">Dependency Details</span>
            </h1>
            <h2 style={{
              textAlign: 'center'
            }}>
              {repo.name || ''}
            </h2>

            <div style={{ marginTop: '2rem' }}>
              <h3>Description</h3>
              <p>{repo.description || 'No description available'}</p>
            </div>

            {repo.language && (
              <div style={{ marginTop: '1rem' }}>
                <h3>Primary Language</h3>
                <p>{repo.language}</p>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <h3>Last Updated</h3>
              <p>{new Date(repo.updated_at).toLocaleDateString()}</p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <a 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  padding: '1rem 2rem',
                  background: '#4a5568',
                  color: 'white',
                  borderRadius: '0.5rem',
                  display: 'inline-block'
                }}
              >
                View on GitHub
              </a>
            </div>
          </div>
        ) : (
          <div>
            <h1>Repository Not Found</h1>
            <p>Unable to load repository details</p>
          </div>
        )}
      </div>

      <div class="container container-center">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {currentRepoDependencies?.map((dependency: any) => {
              const repoPackageNames = currentPackageJson?.devDependencies ? Object.keys(currentPackageJson.devDependencies) : [];
              const repoDependencyNames = currentPackageJson?.dependencies ? Object.keys(currentPackageJson.dependencies) : [];
              const allPackageNames = [...repoPackageNames, ...repoDependencyNames];

              if (allPackageNames.length === 0) return null;

              return (
                <div key={dependency.sbom?.SPDXID} style={{
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
                    {currentPackageJson?.name || dependency.sbom?.name?.split('/').pop() || '-'}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    {[...new Set(allPackageNames)].map((packageName) => {
                      const packageName_str = packageName as string;
                      const packageDetails = dependency.sbom?.packages?.items?.find(
                        (item: { name: string }) => item.name === packageName_str
                      );
                      const isDev = repoPackageNames.includes(packageName_str);

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
                          <div style={{color: '#666', fontSize: '0.9rem', marginTop: '4px'}}>
                            {isDev 
                              ? currentPackageJson?.devDependencies?.[packageName_str] 
                              : currentPackageJson?.dependencies?.[packageName_str] || 
                                packageDetails?.versionInfo || 
                                '-'
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
          })}
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Repository Details",
};
