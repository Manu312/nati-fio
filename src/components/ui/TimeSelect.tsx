'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  minTime?: string;
  maxTime?: string;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

// Generar opciones de tiempo cada 30 minutos
const generateTimeOptions = (minTime?: string, maxTime?: string): string[] => {
  const options: string[] = [];
  const startHour = 6; // 6:00 AM
  const endHour = 23; // 11:00 PM
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (const minutes of [0, 30]) {
      if (hour === endHour && minutes === 30) continue; // No 23:30
      
      const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Filtrar por minTime
      if (minTime && time < minTime) continue;
      // Filtrar por maxTime
      if (maxTime && time > maxTime) continue;
      
      options.push(time);
    }
  }
  
  return options;
};

// Formatear tiempo para mostrar (ej: "09:00" -> "9:00 AM")
const formatTimeDisplay = (time: string): string => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export function TimeSelect({
  value,
  onChange,
  label,
  required = false,
  minTime,
  maxTime,
  disabled = false,
  placeholder = 'Seleccionar hora',
  id,
}: TimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  
  const timeOptions = generateTimeOptions(minTime, maxTime);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll al valor seleccionado cuando se abre
  useEffect(() => {
    if (isOpen && value && optionsRef.current) {
      const selectedOption = optionsRef.current.querySelector(`[data-value="${value}"]`);
      if (selectedOption) {
        selectedOption.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  }, [isOpen, value]);

  const handleSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-2.5
          bg-white border rounded-lg transition-all
          ${disabled 
            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
            : 'border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer'
          }
          ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${value ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
            {value ? formatTimeDisplay(value) : placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <div 
              ref={optionsRef}
              className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-300"
            >
              {timeOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No hay horarios disponibles
                </div>
              ) : (
                timeOptions.map((time) => (
                  <button
                    key={time}
                    type="button"
                    data-value={time}
                    onClick={() => handleSelect(time)}
                    className={`
                      w-full px-4 py-2.5 text-left text-sm flex items-center justify-between
                      transition-colors
                      ${value === time 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span>{formatTimeDisplay(time)}</span>
                    <span className="text-xs text-gray-400">{time}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
