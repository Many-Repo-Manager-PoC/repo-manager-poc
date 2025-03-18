export interface Repo {
    id: number;
    full_name: string;
    name: string;
    repo: string;
    html_url: string;
    url: string;
    language: string;
    description: string;
    updated_at: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    homepage: string;
    topics: string[];
    open_issues_count: number;
    license: {
      name: string;
    };
  
  }

  export interface Dependency {
    sbom: {
      spdxVersion: string;
      dataLicense: string;
      SPDXID: string;
      relationshipType: string;
      name: string;
      documentNamespace: string;
      creationInfo: {
        created: string;
        creators: string[];
      };
      packages: {
        items: Package[];
      };
      relationships: {
        dependencies: Dependency[];
      };
    };
  }

  export interface PackageJson {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    repo: string;
  }
  // export interface Item {
  //   name: {
  //     dev: string;
  //     license: string;
  //     dependencies: string[];
  //     integrity: string;
  //     resolved: string;
  //     version: string;
  //     versionInfo: string;
  //   }

    
  // }

  export interface Package {
    name: string;
    downloadLocation: string;
    versionInfo: string;
    filesAnalyzed: boolean;
    packages: {
      items: Package[];
    };
  }
  
  export interface Member {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  }
  
  export interface Commit {
    html_url: string;
    sha: string;
    commit: {
      message: string;
      author: {
        name: string;
        date: string;
      }
  
    };
    author:{
      login:string;
    };
  }