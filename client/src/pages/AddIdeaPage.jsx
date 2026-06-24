import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import api from '../services/api';

function AddIdeaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const fetchIdea = async () => {
      try {
        const response = await api.get(`/ideas/${id}`);
        const idea = response.data;
        setTitle(idea.title);
        setCategory(idea.category);
        setProblem(idea.problem);
        setDescription(idea.description);
      } catch (err) {
        setError('Unable to load idea for editing.');
      }
    };

    fetchIdea();
  }, [id, isEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !category || !problem || !description) {
      setError('Please fill in every field.');
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/ideas/${id}`, { title, category, problem, description });
      } else {
        await api.post('/ideas', { title, category, problem, description });
      }
      navigate('/ideas');
    } catch (err) {
      setError('Failed to save idea.');
    }
  };

  return (
    <DashboardLayout>
      <div className="page page-form">
        <div className="form-card">
          <h1>{isEdit ? 'Edit Idea' : 'Add New Idea'}</h1>
          <p>{isEdit ? 'Update your idea details.' : 'Create a startup idea for IdeaForge.'}</p>
          <form onSubmit={handleSubmit}>
            <label>
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product or startup name" />
            </label>
            <label>
              Category
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category, e.g. Fintech" />
            </label>
            <label>
              Problem
              <textarea value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="What problem does it solve?" rows="3" />
            </label>
            <label>
              Description
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the idea" rows="5" />
            </label>
            {error && <p className="error-text">{error}</p>}
            <div className="form-actions">
              <button type="button" className="button button-secondary" onClick={() => navigate('/ideas')}>Cancel</button>
              <button type="submit" className="button button-primary">{isEdit ? 'Save Changes' : 'Create Idea'}</button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddIdeaPage;
