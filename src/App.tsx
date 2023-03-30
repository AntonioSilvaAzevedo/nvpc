import { useEffect, useState } from "react";

interface Repo {
  name: string;
  description: string;
  updated_at: string;
  language: string;
}

export function App() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://api.github.com/users/AntonioSilvaAzevedo/repos")
      .then((res) => res.json())
      .then((data) => setRepos(data));
  }, []);

  const filteredRepos =
    search.length > 0
      ? repos.filter((repos) => repos.name.includes(search))
      : [];

  return (
    <div className="p-8 ">
      <input
        className="custom-input"
        type="text"
        name="search"
        placeholder="Buscar..."
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />

      {search.length > 0 ? (
        <div className="bg-white rounded-lg shadow w-96 p-4">
          <ul className="divide-y divide-gray-200 p-2 ">
            {filteredRepos.map((repo) => (
              <>
                <li className="py-1" key={repo.name}>
                  <div className=" flex space-x-3">
                    <h3 className=" text-sm font-medium text-blue-500">
                      {repo.name}
                    </h3>
                  </div>
                  <p className=" text-sm text-gray-500">
                    Descrição:
                    {repo.description}
                  </p>
                  <p className=" text-sm font-normal text-orange-500">
                    {repo.language}
                  </p>
                </li>
              </>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow w-96 p-4">
          <ul className="divide-y divide-gray-200 p-2 ">
            {repos.map((repo) => (
              <li className="py-1" key={repo.name}>
                <div className=" flex space-x-3">
                  <h3 className=" text-sm font-medium text-blue-500">
                    {repo.name}
                  </h3>
                </div>
                <p className=" text-sm text-gray-500">
                  Descrição:
                  {repo.description}
                </p>
                <p className=" text-sm font-normal text-orange-500">
                  {repo.language}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
