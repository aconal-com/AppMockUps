import { create } from 'zustand';

interface HistoryState {
  undoStack: any[];
  redoStack: any[];
  maxHistory: number;
}

interface HistoryActions {
  saveState: (state: any) => void;
  undo: (canvas: any) => void;
  redo: (canvas: any) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState & HistoryActions>((set, get) => ({
  undoStack: [],
  redoStack: [],
  maxHistory: 50,

  saveState: (state: any) => {
    const { undoStack, maxHistory } = get();
    const newUndoStack = [...undoStack, state];

    // Limit stack size
    if (newUndoStack.length > maxHistory) {
      newUndoStack.shift();
    }

    set({
      undoStack: newUndoStack,
      redoStack: [], // Clear redo stack when new state is saved
    });
  },

  undo: (canvas: any) => {
    const { undoStack, redoStack } = get();

    if (undoStack.length === 0) return;

    // Save current state to redo stack
    const currentState = canvas.toJSON();
    const newRedoStack = [...redoStack, currentState];

    // Get previous state
    const previousState = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    // Restore previous state
    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
    });

    set({
      undoStack: newUndoStack,
      redoStack: newRedoStack,
    });
  },

  redo: (canvas: any) => {
    const { undoStack, redoStack } = get();

    if (redoStack.length === 0) return;

    // Get next state from redo stack
    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    // Save current state to undo stack
    const currentState = canvas.toJSON();
    const newUndoStack = [...undoStack, currentState];

    // Restore next state
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
    });

    set({
      undoStack: newUndoStack,
      redoStack: newRedoStack,
    });
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,

  clearHistory: () => {
    set({
      undoStack: [],
      redoStack: [],
    });
  },
}));
