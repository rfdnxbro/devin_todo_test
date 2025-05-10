'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface Todo {
  id: string;
  text: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim() && !isComposing) {
      handleAddTodo();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleCompleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">TODO App</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Add a new todo..."
            className="flex-grow rounded-r-none"
            data-testid="todo-input"
          />
          <Button
            onClick={handleAddTodo}
            disabled={!inputValue.trim()}
            className="rounded-l-none"
            data-testid="add-button"
          >
            Add
          </Button>
        </div>

        <div className="space-y-3" data-testid="todo-list">
          {todos.map((todo) => (
            <Card key={todo.id} className="flex justify-between items-center p-3">
              <span className="break-words flex-grow mr-4">{todo.text}</span>
              <Button
                onClick={() => handleCompleteTodo(todo.id)}
                variant="outline"
                size="sm"
                className="text-green-500 border-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950"
                data-testid="complete-button"
              >
                Complete
              </Button>
            </Card>
          ))}
        </div>
      </CardContent>
      
      {todos.length === 0 && (
        <CardFooter>
          <p className="text-center text-muted-foreground w-full">No todos yet. Add one above!</p>
        </CardFooter>
      )}
    </Card>
  );
}
