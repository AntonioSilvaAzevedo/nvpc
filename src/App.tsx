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
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [filterType, setFilterType] = useState<"name" | "date">("name");

  useEffect(() => {
    fetch("https://api.github.com/users/AntonioSilvaAzevedo/repos")
      .then((res) => res.json())
      .then((data) => {
        setRepos(data);
        const uniqueLanguages = Array.from(
          new Set(data.map((repo) => repo.language))
        );
        const filteredLanguages = uniqueLanguages.filter((lang) => lang);
        setLanguages(filteredLanguages);
      });
  }, []);

  const filteredRepos = (() => {
    switch (filterType) {
      case "name":
        return search.length > 0
          ? repos
              .filter((repo) => repo.name.includes(search))
              .sort((a, b) => a.name.localeCompare(b.name))
          : selectedLanguage.length > 0
          ? repos
              .filter((repo) => repo.language === selectedLanguage)
              .sort((a, b) => a.name.localeCompare(b.name))
          : repos.sort((a, b) => a.name.localeCompare(b.name));
      case "date":
        return repos.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    }
  })();

  return (
    <div className="p-8 bg-gray-900 text-gray-100">
      <div className="flex space-x-4 mb-4">
        <select
          className="custom-input bg-gray-800 border border-gray-600 px-3 py-2 rounded-md text-sm font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          name="filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "name" | "date")}
        >
          <option value="name">Name</option>
          <option value="date">Last update</option>
        </select>
      </div>
      {filterType === "name" && (
        <input
          className="custom-input bg-gray-800 border border-gray-600 px-3 py-2 rounded-md text-sm font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          name="search"
          placeholder="Find a repository..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      )}
      {filterType === "date" && (
        <p className="text-sm font-medium text-gray-400 mb-2">
          Repositórios ordenados pela última atualização
        </p>
      )}
      <div className="flex space-x-4 mb-4">
        <select
          className="custom-input bg-gray-800 border border-gray-600 px-3 py-2 rounded-md text-sm font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          name="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">All languages</option>
          {languages.map((lang) => (
            <option value={lang} key={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-gray-800 rounded-lg shadow w-96 p-4">
        <ul className="divide-y divide-gray-700 p-2">
          {filteredRepos.map((repo) => (
            <li
              className="py-1 hover:bg-blue-600 transform transition duration-300 hover:scale-105"
              key={repo.name}
            >
              <div className="flex space-x-3">
                <h3 className="text-sm font-medium text-blue-400">
                  {repo.name}
                </h3>
                <span className="inline-block bg-yellow-400 rounded-full px-2 py-1 text-xs font-semibold text-gray-800">
                  {repo.stargazers_count} Stars
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Descrição: {repo.description}
              </p>
              <p className="text-sm font-normal text-yellow-400">
                {repo.language}
              </p>
              <p className="text-sm font-normal text-gray-400">
                Última atualização:{" "}
                {new Date(repo.updated_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
