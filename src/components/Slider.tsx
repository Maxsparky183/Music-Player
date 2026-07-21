import React from 'react';
import { cn } from '../utils/cn';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ className, value, onChange, ...props }) => {
  return (
    <div className="relative w-full h-2 bg-surfaceHighlight rounded-full cursor-pointer">
      <div
        className="absolute h-full bg-primary rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
          className
        )}
        {...props}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg transition-all hover:scale-110"
        style={{ left: `${value}%`, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
};
