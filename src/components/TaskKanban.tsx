'use client';

import React, { useState } from 'react';
import { CheckSquare, Clock, ArrowRight, CheckCircle2, User, AlertCircle, Plus } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskKanbanProps {
  tasks: Task[];
  onTaskUpdated: () => void;
  onOpenNewTask: () => void;
}

export default function TaskKanban({ tasks, onTaskUpdated, onOpenNewTask }: TaskKanbanProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const columns: { key: 'todo' | 'in_progress' | 'completed'; label: string; bg: string; dot: string }[] = [
    { key: 'todo', label: 'To Do / Pending', bg: 'bg-neutral-100', dot: 'bg-black' },
    { key: 'in_progress', label: 'In Progress / Mobilized', bg: 'bg-orange-50', dot: 'bg-orange-600' },
    { key: 'completed', label: 'Completed / Verified', bg: 'bg-emerald-50', dot: 'bg-emerald-600' },
  ];

  const updateStatus = async (taskId: number, newStatus: 'todo' | 'in_progress' | 'completed') => {
    setUpdatingId(taskId);
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Status update failed');
      onTaskUpdated();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating task status');
    } finally {
      setUpdatingId(null);
    }
  };

  const priorityStyles = {
    Critical: 'bg-red-600 text-white',
    High: 'bg-orange-500 text-white',
    Medium: 'bg-black text-white',
    Low: 'bg-neutral-200 text-black',
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
        <div>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-orange-600" />
            Field Volunteer Task Kanban
          </h2>
          <p className="text-xs font-mono text-neutral-500">
            Real-time assignment, status transitions, and emergency workflow dispatch.
          </p>
        </div>
        <button
          onClick={onOpenNewTask}
          className="bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(234,88,12,1)] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-orange-500" />
          Dispatch New Task
        </button>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);

          return (
            <div
              key={col.key}
              className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col"
            >
              {/* Column Header */}
              <div className="p-3 border-b-2 border-black bg-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 ${col.dot}`}></span>
                  <span className="font-mono font-black text-xs uppercase text-black tracking-wider">
                    {col.label}
                  </span>
                </div>
                <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="p-4 space-y-4 min-h-[420px] max-h-[700px] overflow-y-auto bg-neutral-50/50">
                {colTasks.length === 0 ? (
                  <div className="h-40 border-2 border-dashed border-neutral-300 flex items-center justify-center text-center p-4">
                    <span className="text-xs font-mono text-neutral-400 uppercase">
                      No tasks in this lane
                    </span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(234,88,12,1)] transition-all space-y-3"
                    >
                      {/* Priority & Campaign Tag */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border border-black ${
                            priorityStyles[task.priority as keyof typeof priorityStyles] || priorityStyles.Medium
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                        {task.due_date && (
                          <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-orange-600" />
                            {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-black text-black leading-snug tracking-tight">
                        {task.title}
                      </h4>

                      {/* Associated Campaign */}
                      {task.campaign_title && (
                        <div className="text-[10px] font-mono text-neutral-500 bg-neutral-100 p-1.5 border border-neutral-200 truncate">
                          Drive: <span className="font-bold text-black">{task.campaign_title}</span>
                        </div>
                      )}

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs text-neutral-600 leading-relaxed font-sans line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Assigned Volunteer */}
                      <div className="text-[11px] font-mono pt-2 border-t border-neutral-200 flex items-center justify-between">
                        <span className="text-neutral-500 flex items-center gap-1">
                          <User className="w-3 h-3 text-black" />
                          {task.volunteer_name ? (
                            <span className="font-bold text-black truncate max-w-[130px]">{task.volunteer_name}</span>
                          ) : (
                            <span className="text-neutral-400 italic">Unassigned</span>
                          )}
                        </span>
                      </div>

                      {/* Move Status Buttons */}
                      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between gap-1">
                        {col.key !== 'todo' && (
                          <button
                            onClick={() => updateStatus(task.id, col.key === 'completed' ? 'in_progress' : 'todo')}
                            disabled={updatingId === task.id}
                            className="text-[10px] font-mono font-bold uppercase text-neutral-500 hover:text-black hover:underline"
                          >
                            ← Back
                          </button>
                        )}
                        <div className="ml-auto">
                          {col.key === 'todo' && (
                            <button
                              onClick={() => updateStatus(task.id, 'in_progress')}
                              disabled={updatingId === task.id}
                              className="bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-[10px] uppercase px-2.5 py-1 border border-black flex items-center gap-1"
                            >
                              <span>Start</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {col.key === 'in_progress' && (
                            <button
                              onClick={() => updateStatus(task.id, 'completed')}
                              disabled={updatingId === task.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-[10px] uppercase px-2.5 py-1 border border-black flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Complete</span>
                            </button>
                          )}
                          {col.key === 'completed' && (
                            <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Done
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
