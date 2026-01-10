export const Priority = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
  };

  export const PriorityLabels = {
    [Priority.LOW]: 'Low',
    [Priority.MEDIUM]: 'Medium',
    [Priority.HIGH]: 'High',
  } as const;

  export const PriorityColors = {
    [Priority.LOW]: '#4caf50',    // Verde
    [Priority.MEDIUM]: '#ff9800', // Arancione
    [Priority.HIGH]: '#f44336',   // Rosso
  } as const;