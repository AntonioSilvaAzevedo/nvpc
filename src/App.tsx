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
    <div className="p-8">
      <div className="flex space-x-4 mb-4">
        <select
          className="custom-input bg-gray-50 border border-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          name="filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "name" | "date")}
        >
          <option value="name">Filtrar por nome</option>
          <option value="date">Filtrar por data</option>
        </select>
      </div>
      {filterType === "name" && (
        <input
          className="custom-input bg-gray-50 border border-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          name="search"
          placeholder="Buscar..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      )}
      {filterType === "date" && (
        <p className="text-sm font-medium text-gray-500 mb-2">
          Repositórios ordenados pela última atualização
        </p>
      )}
      <div className="flex space-x-4 mb-4">
        <select
          className="custom-input bg-gray-50 border border-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          name="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">Todas as linguagens</option>
          {languages.map((lang) => (
            <option value={lang} key={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-lg shadow w-96 p-4">
        <ul className="divide-y divide-gray-200 p-2">
          {filteredRepos.map((repo) => (
            <li className="py-1" key={repo.name}>
              <div className="flex space-x-3">
                <h3 className="text-sm font-medium text-blue-500">
                  {repo.name}
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                Descrição: {repo.description}
              </p>
              <p className="text-sm font-normal text-orange-500">
                {repo.language}
              </p>
              <p className="text-sm font-normal text-gray-500">
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
