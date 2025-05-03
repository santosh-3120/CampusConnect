import React from 'react';
import { Link } from 'react-router-dom';
import { useQuestions, useQuestionActions } from '../features/forum/forumHooks';
import Navbar from '../components/layout/Navbar';
import QuestionCard from '../components/forum/QuestionCard';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const Forum = () => {
  const { questions, loading, error } = useQuestions();
  const { deleteQuestion } = useQuestionActions();

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Forum</h1>
          <Link to="/forum/new" className="btn-primary">Ask a Question</Link>
        </div>
        {error && <Toast message={error} type="error" />}
        <div className="space-y-6">
          {questions.map((question) => (
            <QuestionCard key={question._id} question={question} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;