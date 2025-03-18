import {
    component$,
    useTask$,
    useStore,
    useContext,
  } from "@builder.io/qwik";
  import { type DocumentHead } from "@builder.io/qwik-city";
  import { ServerDataContext } from "../layout";

    
  export default component$(() => {
    const serverData = useContext(ServerDataContext);
    const repoDependencies = serverData.dependencies;
    const packageJsons = serverData.packageJsons;

    const state = useStore({
        count: 0,
        number: 20,
        repos: [],
      });

  
    useTask$(({ cleanup }) => {
      const timeout = setTimeout(() => (state.count = 1), 500);
      cleanup(() => clearTimeout(timeout));
  
      const internal = setInterval(() => state.count++, 7000);
      cleanup(() => clearInterval(internal));
    });
  
    return (
      <div class="container container-center">
        <div role="presentation" class="ellipsis"></div>
        <h1>
          <span class="highlight">Repo</span> Dependencies
        </h1>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {repoDependencies?.map((dependency, depIndex) => {
            const packageJson = packageJsons[depIndex];
            const repoPackageNames = packageJson?.devDependencies ? Object.keys(packageJson.devDependencies) : [];
            const repoDependencyNames = packageJson?.dependencies ? Object.keys(packageJson.dependencies) : [];
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
                  {packageJson?.name || dependency.sbom?.name?.split('/').pop() || '-'}
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
                            ? packageJson?.devDependencies?.[packageName_str] 
                            : packageJson?.dependencies?.[packageName_str] || 
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
    );
  });
  
  export const head: DocumentHead = {
    title: "Dependencies",
  };  
