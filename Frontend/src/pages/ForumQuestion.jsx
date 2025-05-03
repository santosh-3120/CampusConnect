import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuestion, useQuestionActions } from '../features/forum/forumHooks';
import Navbar from '../components/layout/Navbar';
import QuestionCard from '../components/forum/QuestionCard';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const ForumQuestion = () => {
  const { id } = useParams();
  const { question, loading, error } = useQuestion(id);
  const { deleteQuestion } = useQuestionActions();

  const handleDelete = async () => {
    try {
      await deleteQuestion(id);
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  if (loading) return <Spinner />;
  if (!question) return <div className="text-center text-red-500">Question not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        {error && <Toast message={error} type="error" />}
        <QuestionCard question={question} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ForumQuestion;