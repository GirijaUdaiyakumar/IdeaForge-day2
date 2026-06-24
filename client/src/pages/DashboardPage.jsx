import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import IdeaCard from '../components/IdeaCard';
import api from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ideas');
      setIdeas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const generateMockIdea = async () => {
    const samples = [
      {
        title: 'Smart Fitness Coach',
        category: 'Health',
        problem: 'People lack motivation to stick to workout routines',
        description: 'AI-driven short daily challenges based on personal data to keep users motivated.',
      },
      {
        title: 'LocalShop Connect',
        category: 'Marketplace',
        problem: 'Small shops struggle to reach local online customers',
        description: 'A hyperlocal marketplace with instant delivery and seller tools.',
      },
    ];
    const pick = samples[Math.floor(Math.random() * samples.length)];

    try {
      const res = await api.post('/ideas', pick);
      setIdeas((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('Failed to save generated idea', err);
    }
  };

  const filtered = ideas.filter((i) => {
    return (
      (!query || i.title.toLowerCase().includes(query.toLowerCase()) || i.problem.toLowerCase().includes(query.toLowerCase())) &&
      (!category || i.category === category)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this idea?')) return;
    try {
      await api.delete(`/ideas/${id}`);
      setIdeas((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Manage your ideas and generate new concepts with AI.</p>
          </div>
          <div className="page-toolbar">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ideas..." />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option>Health</option>
              <option>Marketplace</option>
              <option>Fintech</option>
            </select>
            <button className="button button-primary" onClick={generateMockIdea}>✨ Generate Idea with AI</button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="idea-grid">
            {filtered.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} onEdit={(id) => navigate(`/ideas/edit/${id}`)} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

