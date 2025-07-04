import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './App.css';
import ThreeDLogo from './components/ThreeDLogo';
import { motion } from 'framer-motion';

// const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
// // Then use backendUrl when making fetch/axios requests
// fetch(`${backendUrl}/api/generate-sql`, { /* ... */ });

interface QueryResultRow {
  [key: string]: string | number | boolean | null;
}

function App() {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState<string>('');
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [createTableSql, setCreateTableSql] = useState<string>('');
  const [insertDataSql, setInsertDataSql] = useState<string[]>([]);
  const [queryResults, setQueryResults] = useState<QueryResultRow[] | null>(null);
  const [loadingGenerate, setLoadingGenerate] = useState<boolean>(false);
  const [loadingExecute, setLoadingExecute] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateSql = async () => {
    setError('');
    setLoadingGenerate(true);
    setGeneratedSql('');
    setCreateTableSql('');
    setInsertDataSql([]);
    setQueryResults(null);
    const backendUrl = 'https://my-sql-app-backend.onrender.com';
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: naturalLanguageInput }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate SQL and schema.');
      }
      const data = await response.json();
      setGeneratedSql(data.sqlQuery);
      setCreateTableSql(data.createTableSql);
      setInsertDataSql(data.insertDataSql);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during SQL generation.');
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleExecuteSql = async () => {
    setError('');
    setLoadingExecute(true);
    setQueryResults(null);
    if (!generatedSql || !createTableSql || insertDataSql.length === 0) {
      setError('Please generate SQL and schema first.');
      setLoadingExecute(false);
      return;
    }
    const backendUrl = 'https://my-sql-app-backend.onrender.com';
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sqlQuery: generatedSql,
          createTableSql: createTableSql,
          insertDataSql: insertDataSql,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to execute SQL query.');
      }
      const data = await response.json();
      setQueryResults(data.results);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during SQL execution.');
    } finally {
      setLoadingExecute(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4 font-inter overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8 flex flex-col items-center border-b-4 border-blue-200 mx-auto text-center"
        >
          <ThreeDLogo />
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight text-center">
            <span className="inline-block align-middle mr-2">
              <svg className="inline h-9 w-9 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg>
            </span>
            Natural Language to SQL Generator
          </h1>
          <p className="text-gray-600 text-lg text-center max-w-2xl mt-2">
            Instantly convert your natural language requests into SQL queries, table schemas, and sample data. Run and view results in one click.
          </p>
        </motion.div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <label htmlFor="natural-language" className="block text-gray-700 text-base font-semibold mb-2">
                <span className="mr-1">📝</span> Enter your request:
          </label>
          <TextareaAutosize
            id="natural-language"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-base min-h-[48px] max-h-[300px] text-gray-900"
            value={naturalLanguageInput}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNaturalLanguageInput(e.target.value)}
            placeholder="e.g. Get students older than 20; Show orders in March; List employees with salary above 50000"
            aria-label="Enter your request in natural language"
            minRows={3}
            maxRows={8}
          />
            </div>
          <button
            onClick={handleGenerateSql}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg font-bold text-lg shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loadingGenerate}
              title="Generate SQL and schema from your request"
          >
            {loadingGenerate ? (
                <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.0 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
                <>
                  <span className="mr-2">⚡</span> Generate SQL & Schema
                </>
            )}
          </button>
        </div>

          {/* Output Section */}
          <div className="flex flex-col gap-4">
            {/* SQL Query */}
            <div className="mb-2">
              <div className="flex items-center mb-1">
                <span className="text-blue-500 mr-2">💡</span>
                <h2 className="text-lg font-semibold text-gray-800">SQL Query</h2>
              </div>
              <pre className="bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto text-sm min-h-[48px] border border-gray-200">
                <code>{generatedSql || <span className="text-gray-500">(SQL query will appear here)</span>}</code>
            </pre>
            </div>
            {/* Table Schema */}
            <div className="mb-2">
              <div className="flex items-center mb-1">
                <span className="text-purple-500 mr-2">🗄️</span>
                <h2 className="text-lg font-semibold text-gray-800">Table Schema</h2>
              </div>
              <pre className="bg-gray-900 text-purple-300 p-3 rounded-lg overflow-x-auto text-sm min-h-[48px] border border-gray-200">
                <code>{createTableSql || <span className="text-gray-500">(Table schema will appear here)</span>}</code>
            </pre>
            </div>
            {/* Sample Data */}
            <div className="mb-2">
              <div className="flex items-center mb-1">
                <span className="text-yellow-500 mr-2">📋</span>
                <h2 className="text-lg font-semibold text-gray-800">Sample Data</h2>
              </div>
              <pre className="bg-gray-900 text-yellow-200 p-3 rounded-lg overflow-x-auto text-sm min-h-[48px] border border-gray-200">
                {insertDataSql.length > 0 ? (
                  insertDataSql.map((stmt: string, index: number) => (
                <code key={index}>{stmt}<br /></code>
                  ))
                ) : (
                  <span className="text-gray-500">(Sample data will appear here)</span>
                )}
            </pre>
            </div>
            {/* Run SQL Button */}
            <button
              onClick={handleExecuteSql}
              className="mt-2 w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-lg font-bold text-lg shadow-md hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-200 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loadingExecute || !generatedSql}
              title="Run the generated SQL and view results"
            >
              {loadingExecute ? (
                <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.0 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <span className="mr-2">🚀</span> Run SQL & Get Results
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Card */}
        <div className="mt-8">
          {queryResults && queryResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-200"
            >
              <div className="flex items-center mb-3">
                <span className="text-green-500 mr-2">📊</span>
                <h2 className="text-xl font-bold text-gray-800">Query Results</h2>
              </div>
              <div className="overflow-x-auto rounded-lg shadow-inner">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100">
                  <tr>
                      {Object.keys(queryResults[0]).map((key: string) => (
                      <th
                        key={key}
                        scope="col"
                          className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {queryResults.map((row: QueryResultRow, rowIndex: number) => (
                      <tr key={rowIndex} className="hover:bg-blue-50 transition">
                        {Object.values(row).map((value: any, colIndex: number) => (
                        <td
                          key={colIndex}
                            className="px-6 py-4 whitespace-nowrap text-gray-900 border-b border-gray-50"
                        >
                            {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
          {queryResults && queryResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-yellow-200"
            >
              <div className="flex items-center mb-3">
                <span className="text-yellow-500 mr-2">🔍</span>
                <h2 className="text-xl font-bold text-gray-800">Query Results</h2>
              </div>
            <p className="text-gray-600">No results found or query returned an empty set.</p>
          </motion.div>
        )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="mt-8 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-md flex items-center" role="alert">
            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414-1.414A9 9 0 105.636 18.364l1.414 1.414A9 9 0 1018.364 5.636z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
            <div>
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
