import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionActions } from '../features/forum/forumHooks';
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const CreateQuestion = () => {
  const navigate = useNavigate();
  const { createQuestion, loading, error } = useQuestionActions();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createQuestion(formData);
      navigate('/forum');
    } catch (err) {
      console.error('Error creating question:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Ask a Question</h1>
        {error && <Toast message={error} type="error" />}
        <div className="card p-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="input-field"
                rows="6"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-primary w-full">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;