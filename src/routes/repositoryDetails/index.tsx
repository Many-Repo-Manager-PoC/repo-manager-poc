import {
  component$,
  useContext,
} from "@builder.io/qwik";
import { useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { ServerDataContext } from "../layout";
import Dependency from "../../components/starter/dependency/dependency";
import Topics from "../../components/starter/topics/topics";


export default component$(() => {
  const location = useLocation();
  const repoName = location.url.searchParams.get('repo');
  const serverData = useContext(ServerDataContext);
  const nav = useNavigate();
  const repo = serverData.repos.find(r => r.name === repoName);
  const repoDependencies = serverData.dependencies;
  const packageJsons = serverData.packageJsons;

  // Filter dependencies for current repo
  const currentRepoDependencies = repo ? 
    repoDependencies?.filter((_, index) => {
      return packageJsons[index]?.repo === repoName;
    }) : [];

  const currentPackageJson = repo ?
    packageJsons?.find(pkg => pkg.name === repoName) : null;

  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <h1>
        <span class="highlight">Repository</span> Details
      </h1>

      {repo ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%'
          }}>
            <h2 style={{
              color: 'black',
              fontSize: '2rem',
              marginBottom: '1rem'
            }}>{repo.name}</h2>

            <div style={{
              color: '#333',
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}>
              {repo.description || 'No description available'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '500',
            color: '#57606a',
            marginRight: '0.5rem'
          }}>
            Tags:
          </span>
          <Topics repo={repo} nav={nav} />
        </div>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1rem'
            }}>
              {repo.language && (
                <div style={{
                  color: 'rgb(50 64 96)',
                  backgroundColor: 'rgb(230, 242, 232)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}>
                  {repo.language}
                </div>
              )}

              <div style={{
                backgroundColor: '#fff3e0',
                color: '#e65100',
                padding: '4px 8px',
                borderRadius: '4px',
              }}>
                {repo.license?.name || 'No License'}
              </div>

              <div style={{
                backgroundColor: '#f5f5f5',
                color: '#666',
                padding: '4px 8px',
                borderRadius: '4px',
              }}>
                Last Updated: {new Date(repo.updated_at).toDateString()}
              </div>

              <div style={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '4px 8px',
                borderRadius: '4px',
              }}>
                ✰ {repo.stargazers_count}
              </div>
              <div style={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '4px 8px',
                borderRadius: '4px',
              }}>
                ⚠ {repo.open_issues_count}
              </div>
            </div>

            <a 
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: 'rgb(50 64 96)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              View on GitHub
            </a>
          </div>
          {currentRepoDependencies.length > 0 && (
            <h2 style={{
              color: 'white', 
              marginTop: '2rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Dependencies
            </h2>
          )}

          <Dependency dependencies={currentRepoDependencies} packageJsons={[currentPackageJson]} />
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h2 style={{color: 'white'}}>Repository Not Found</h2>
          <p style={{color: 'white'}}>Unable to load repository details</p>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Repository Details",
};
