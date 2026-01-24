// ./Draftfatora.jsx
import React from "react";

const Draftfatora = ({ onBack }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-xl font-semibold mb-2">Draft Fatora</h2>
      <p className="text-sm text-gray-500">
        Your saved drafts will appear here.
      </p>
    </div>
  );
};

export default Draftfatora;
