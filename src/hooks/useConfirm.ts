'use client';

import { useState, useCallback } from 'react';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: ((value: boolean) => void) | null;
}

const initialState: ConfirmState = {
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'danger',
  resolve: null,
};

/**
 * Hook para mostrar un diálogo de confirmación profesional
 * en lugar de los `confirm()` y `alert()` nativos del navegador.
 *
 * Uso:
 * ```tsx
 * const { confirm, confirmProps } = useConfirm();
 *
 * const handleDelete = async () => {
 *   const ok = await confirm({
 *     title: 'Eliminar elemento',
 *     message: '¿Estás seguro?',
 *     confirmText: 'Eliminar',
 *     variant: 'danger',
 *   });
 *   if (!ok) return;
 *   // ...proceder
 * };
 *
 * return <><ConfirmDialog {...confirmProps} />  ...</>
 * ```
 */
export function useConfirm() {
  const [state, setState] = useState<ConfirmState>(initialState);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        ...options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState(initialState);
  }, [state]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState(initialState);
  }, [state]);

  const confirmProps = {
    isOpen: state.isOpen,
    title: state.title,
    message: state.message,
    confirmText: state.confirmText,
    cancelText: state.cancelText,
    variant: state.variant,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
    onClose: handleCancel,
  };

  return { confirm, confirmProps };
}
