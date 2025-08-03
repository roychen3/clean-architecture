import { type UnsaveLeaveDialogComponentProps } from '@/hooks/use-unsave-leave-blocker/interface';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export type UnsaveLeaveDialogProps = UnsaveLeaveDialogComponentProps;

export function UnsaveLeaveDialog({
  open,
  onConfirm,
  onCancel,
}: UnsaveLeaveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          You have unsaved changes. Are you sure you want to leave without
          saving?
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
