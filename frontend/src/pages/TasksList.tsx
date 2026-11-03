import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import { profilesApi } from '../api/profiles';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

export const TasksList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filters
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState<string>(searchParams.get('difficulty') || 'All');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort_by') || 'newest');

  const categories = ['All', 'Frontend', 'Backend', 'Fullstack', 'Design', 'Data & AI'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getTasks({
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        difficulty: difficulty !== 'All' ? difficulty : undefined,
        sort_by: sortBy,
        page,
        page_size: 6,
      });
      setTasks(data.tasks);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'candidate') {
      profilesApi
        .getCandidateProfile()
        .then((prof) => {
          if (prof.skills) {
            setCandidateSkills(
              prof.skills
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            );
          }
        })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [category, difficulty, sortBy, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTasks();
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  const handleDifficultySelect = (diff: string) => {
    setDifficulty(diff);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col justify-between selection:bg-[#FFD600]">
      {!isAuthenticated && <Navbar />}

      <div className={`flex-1 ${isAuthenticated && user ? 'flex' : ''}`}>
        {isAuthenticated && user && <Sidebar role={user.role} />}

        <main className={`w-full flex-1 py-10 px-4 sm:px-6 lg:px-8 ${isAuthenticated ? 'max-w-6xl p-6 sm:p-10' : 'max-w-7xl mx-auto'}`}>
          {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            Explore Hiring Tasks
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Complete practical challenges, demonstrate capability, and skip resume screening.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, required skills, or keywords..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-[#FFFDF5]/40"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#FFD600] hover:bg-[#FFDF33] text-xs font-bold text-[#1A1A1A] transition"
              >
                Search
              </button>
            </form>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6B7280] whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#1A1A1A] bg-white focus:outline-none focus:border-black"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="deadline">Closest Deadline</option>
                <option value="openings">Most Openings</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E5E7EB]">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-[#6B7280] mr-2">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    category === cat
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-gray-100 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-[#6B7280] mr-2">Difficulty:</span>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultySelect(diff)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    difficulty === diff
                      ? 'bg-[#FFD600] text-[#1A1A1A] font-bold'
                      : 'bg-gray-100 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#6B7280]">
          <span>Showing {tasks.length} of {total} available tasks</span>
          {(category !== 'All' || difficulty !== 'All' || search) && (
            <button
              onClick={() => {
                setCategory('All');
                setDifficulty('All');
                setSearch('');
                setPage(1);
              }}
              className="text-[#1A1A1A] font-semibold underline hover:opacity-80"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-white border border-[#E5E7EB] animate-pulse"></div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No hiring tasks found"
            description="Try modifying your search keywords or clearing active category and difficulty filters."
            actionText="Clear Filters"
            onAction={() => {
              setCategory('All');
              setDifficulty('All');
              setSearch('');
              setPage(1);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} candidateSkills={candidateSkills} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#1A1A1A] disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold text-[#1A1A1A] px-3">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#1A1A1A] disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        </main>
      </div>

      {!isAuthenticated && <Footer />}
    </div>
  );
};

export default TasksList;

