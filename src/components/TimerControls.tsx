import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Button from './Button';

interface TimerControlsProps {
  isRunning: boolean;
  remainingTime: number;
  duration: number;
  onToggle: () => void;
  onRestart: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  remainingTime,
  duration,
  onToggle,
  onRestart,
}) => {
  const isCompleted = remainingTime <= 0;

  if (isCompleted) {
    return (
      <Button
        label={<RotateCcw className="w-6 h-6" />}
        onClick={onRestart}
        variant='secondary'tooltip="Restart Timer"
      />
    );
  }

  return (
    <button
      onClick={onToggle}
      className={`p-3 rounded-full transition-colors ${isRunning
        ? 'bg-red-100 text-red-600 hover:bg-red-200'
        : 'bg-green-100 text-green-600 hover:bg-green-200'
        }`}
      title={isRunning ? 'Pause Timer' : 'Start Timer'}
    >
      {isRunning ? (
        <Pause className="w-6 h-6" />
      ) : (
        <Play className="w-6 h-6" />
      )}
    </button>
  );
};