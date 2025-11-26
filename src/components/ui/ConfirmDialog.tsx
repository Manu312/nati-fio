'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      icon: 'text-red-600',
      bg: 'bg-red-50',
      buttonVariant: 'danger' as const,
    },
    warning: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-50',
      buttonVariant: 'primary' as const,
    },
    info: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      buttonVariant: 'primary' as const,
    },
  };

  const style = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className={`w-12 h-12 ${style.bg} rounded-full flex items-center justify-center mb-4`}>
                <AlertTriangle className={`w-6 h-6 ${style.icon}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 mb-6">
                {message}
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  {cancelText}
                </Button>
                <Button
                  variant={style.buttonVariant}
                  onClick={() => {
                    onConfirm();
                    onCancel();
                  }}
                  className="flex-1"
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
