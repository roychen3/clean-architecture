import { useState, useCallback, useMemo } from 'react';
import { useBlocker } from 'react-router';

import type { UnsaveLeaveDialogComponentProps } from './interface';

export type UseUnsaveLeaveBlockerOptions = {
  isDirty: boolean;
  dialogComponent: (
    props: UnsaveLeaveDialogComponentProps,
  ) => React.JSX.Element;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function useUnsaveLeaveBlocker({
  isDirty,
  dialogComponent,
  onConfirm,
  onCancel,
}: UseUnsaveLeaveBlockerOptions) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const blocker = useBlocker(() => {
    if (isDirty) {
      setShowLeaveDialog(true);
      return true;
    }
    return false;
  });

  if (!isDirty && showLeaveDialog) {
    setShowLeaveDialog(false);
    blocker.reset?.();
  }

  const handleDialogCancel = useCallback(() => {
    setShowLeaveDialog(false);
    blocker.reset?.();
    onCancel?.();
  }, [blocker, onCancel]);

  const handleDialogConfirm = useCallback(() => {
    setShowLeaveDialog(false);
    blocker.proceed?.();
    blocker.reset?.();
    onConfirm?.();
  }, [blocker, onConfirm]);

  const dialogNode = useMemo(() => {
    const Dialog = dialogComponent;

    return (
      <Dialog
        open={showLeaveDialog}
        onCancel={handleDialogCancel}
        onConfirm={handleDialogConfirm}
      />
    );
  }, [
    dialogComponent,
    handleDialogCancel,
    handleDialogConfirm,
    showLeaveDialog,
  ]);

  return { dialogNode };
}
