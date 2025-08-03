import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { useStore } from '@tanstack/react-store';

import { useUnsaveLeaveBlocker as useInnerUnsaveLeaveBlocker } from '@/hooks/use-unsave-leave-blocker';

import { UnsaveLeaveDialog } from './unsave-leave-dialog';
import { authStore } from '@/store/auth-store';

export type UnsaveLeaveBlockerContextType = {
  setIsDirty: (isDirty: boolean) => void;
};
const UnsaveLeaveBlockerContext = createContext<UnsaveLeaveBlockerContextType>({
  setIsDirty: () => {
    throw new Error('UnsaveLeaveBlockerContext not initialized');
  },
});

export type UnsaveLeaveBlockerProviderProps = {
  children: React.ReactNode;
};
export const UnsaveLeaveBlockerProvider = ({
  children,
}: UnsaveLeaveBlockerProviderProps) => {
  const isAuthenticated = useStore(authStore, (state) => state.isAuthenticated);
  const [innerIsDirty, setInnerIsDirty] = useState(false);

  useEffect(() => {
    setInnerIsDirty(false);
  }, [isAuthenticated]);

  const { dialogNode } = useInnerUnsaveLeaveBlocker({
    isDirty: innerIsDirty,
    dialogComponent: UnsaveLeaveDialog,
    onConfirm: () => {
      setInnerIsDirty(false);
    },
  });

  const setIsDirty = useCallback((isDirty: boolean) => {
    setInnerIsDirty(isDirty);
  }, []);

  const contextValue = useMemo(
    () => ({
      setIsDirty,
    }),
    [setIsDirty],
  );

  return (
    <UnsaveLeaveBlockerContext.Provider value={contextValue}>
      {children}
      {dialogNode}
    </UnsaveLeaveBlockerContext.Provider>
  );
};

export const useGlobalUnsaveLeaveBlocker = () => {
  const context = useContext(UnsaveLeaveBlockerContext);
  if (!context) {
    throw new Error(
      'useGlobalUnsaveLeaveBlocker must be used within an UnsaveLeaveBlockerProvider',
    );
  }
  return context;
};
