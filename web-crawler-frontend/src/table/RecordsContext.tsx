import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import Record from '../data-classes/Record';

type RecordsContextType = {
  reloadData(): void;
  setEditingRecord: Dispatch<SetStateAction<Record | null>>;
};

export const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export const useRecordsContext = () => {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error('useRecordsContext must be used in RecordsContext.Provider');
  }
  return context;
};
