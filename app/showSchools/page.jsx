'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/getSchools')
      .then(res => setSchools(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading schools...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {schools.map(school => (
        <div key={school.id} className="border rounded shadow p-4">
          <img src={school.image} alt={school.name} className="w-full h-48 object-cover rounded" />
          <h2 className="mt-2 font-semibold text-lg">{school.name}</h2>
          <p>{school.address}</p>
          <p>{school.city}</p>
        </div>
      ))}
    </div>
  );
}
