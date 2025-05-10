import TodoApp from './components/TodoApp';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Personal TODO App</h1>
        <TodoApp />
      </div>
    </div>
  );
}
