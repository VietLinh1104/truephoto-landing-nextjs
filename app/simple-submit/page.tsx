"use client"
import { useState } from 'react';
import { create } from "@/lib/strapiClient";

export default function SimpleSubmit() {
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData = {
        "files": {
            "connect": [
                { "documentId": "z6tm2eboubk61e7279a5hphk" },
                { "documentId": "mlsalhxj36cvnuqotuumxett"}
            ]
        }
      };
      console.log('Submitting data:', submitData);
      const response = await create('request-clients', submitData);
      console.log('Response from Strapi:', response);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating deliverable:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 md:p-10 w-full max-w-md">
        {showSuccess ? (
          <div className="text-center p-8 bg-green-50 rounded-lg">
            <h3 className="text-2xl font-semibold text-green-700 mb-4">Submit Successful!</h3>
            <button
              onClick={() => setShowSuccess(false)}
              className="btn text-center text-primary font-semibold transition duration-300 hover:text-white"
            >
              Submit Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={saving}
              className="btn w-full text-center text-primary font-semibold transition duration-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Processing...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 