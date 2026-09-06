import React, { createContext, useContext, useState, ReactNode } from "react";

interface TableSelectionContextType {
  selectedPersonId: string | null;
  selectPerson: (id: string | null) => void;
}

const TableSelectionContext = createContext<TableSelectionContextType | undefined>(undefined);

export function TableSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const selectPerson = (id: string | null) => {
    setSelectedPersonId(id);
  };

  return (
    <TableSelectionContext.Provider value={{ selectedPersonId, selectPerson }}>
      {children}
    </TableSelectionContext.Provider>
  );
}

export function useTableSelection() {
  const context = useContext(TableSelectionContext);
  if (!context) {
    throw new Error("useTableSelection must be used within a TableSelectionProvider");
  }
  return context;
}
