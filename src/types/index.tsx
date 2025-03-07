export interface Repo {
    id: number;
    full_name: string;
    name: string;
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