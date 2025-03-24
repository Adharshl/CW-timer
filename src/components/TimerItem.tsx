import React, { useEffect, useRef, useState } from 'react';
import { Trash2, RotateCcw, Pencil } from 'lucide-react';
import { Timer } from '../types/timer';
import { formatTime } from '../utils/time';
import { useTimerStore } from '../store/useTimerStore';
import { toast } from 'sonner';
import { TimerAudio } from '../utils/audio';
import { TimerControls } from './TimerControls';
import { TimerProgress } from './TimerProgress';
import { TimerModal } from './TimerModal';
import Button from './Button';

interface TimerItemProps {
  timer: Timer;
}

export const TimerItem: React.FC<TimerItemProps> = ({ timer }) => {
  const { toggleTimer, deleteTimer, updateTimer, restartTimer } = useTimerStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timerAudio = TimerAudio.getInstance();
  const hasEndedRef = useRef(false);

  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = window.setInterval(() => {
        updateTimer(timer.id);

        if (timer.remainingTime <= 1 && !hasEndedRef.current) {
          hasEndedRef.current = true;
          timerAudio.play().catch(console.error);

          toast.success(`Timer "${timer.title}" has ended!`, {
            duration: 5000,
            action: {
              label: 'Dismiss',
              onClick: () => { timerAudio.stop() },
            },
          });
        }
      }, 1000);
    }

    return () => clearInterval(intervalRef.current!);
  }, [timer.isRunning, timer.id, timer.remainingTime, timer.title, timerAudio, updateTimer]);

  const handleRestart = () => {
    hasEndedRef.current = false;
    restartTimer(timer.id);
  };

  const handleDelete = () => {
    timerAudio.stop();
    deleteTimer(timer.id);
  };

  const handleToggle = () => {
    if (timer.remainingTime <= 0) {
      hasEndedRef.current = false;
    }
    toggleTimer(timer.id);
  };

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-102 overflow-hidden">
        <div className="absolute inset-0 w-full h-full -z-10 opacity-5">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
            <path
              d="M50 20V50L70 70"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{timer.title}</h3>
              <p className="text-gray-600 mt-1">{timer.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                label={<Pencil className="w-5 h-5" />}
                onClick={() => setIsEditModalOpen(true)}
                variant='secondary'
                tooltip="Edit Timer"
              />
              <Button
                label={<RotateCcw className="w-5 h-5" />}
                onClick={handleRestart}
                variant='secondary'
                tooltip="Restart Timer"
              />
              <Button
                label={<Trash2 className="w-5 h-5" />}
                onClick={handleDelete}
                variant='danger'
                tooltip="Delete Timer"
              />

            </div>
          </div>
          <div className="flex flex-col items-center mt-6">
            <div className="text-4xl font-mono font-bold text-gray-800 mb-4">
              {formatTime(timer.remainingTime)}
            </div>

            <TimerProgress
              progress={(timer.remainingTime / timer.duration) * 100}
            />

            <TimerControls
              isRunning={timer.isRunning}
              remainingTime={timer.remainingTime}
              duration={timer.duration}
              onToggle={handleToggle}
              onRestart={handleRestart}
            />
          </div>
        </div>
      </div>
      <TimerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        timer={timer}
      />
    </>
  );
};