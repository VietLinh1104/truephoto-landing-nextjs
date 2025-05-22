'use client';

import { useState } from 'react';
import { fetchAPI } from '@/lib/api';

export default function TestAPIPage() {
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const parsedBody = body ? JSON.parse(body) : undefined;
      const result = await fetchAPI(endpoint, {
        method,
        body: parsedBody,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setResponse(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Endpoint:</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="Enter endpoint (e.g., users/1)"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {(method === 'POST' || method === 'PUT') && (
          <div>
            <label className="block mb-2">Request Body (JSON):</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter JSON body"
              className="w-full p-2 border rounded h-32 font-mono"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
          <h2 className="text-red-700 font-bold">Error:</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h2 className="font-bold mb-2">Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 