import create from 'zustand'

const useStore = create(set => ({
    history: [],
    addToHistory: (instance) => set(state => {
        return {
            history: [...state.history, instance],
            undoStack: []
        }
    }),

    currentLine: [],
    addToCurrentLine: (stroke) => set(state => ({ currentLine: [...state.currentLine, stroke]})),
    clearCurrentLine: () => set({currentLine: []}),

    undoStack: [],
    undo: () => set(state => {
        if(state.history.length === 0) {
            return;
        }

        const lastIndex = state.history.length - 1;
        return {
            history: state.history.slice(0, lastIndex),
            undoStack: [...state.undoStack, state.history[lastIndex]]
        };
    }),
    redo: () => set(state => {
        if(state.undoStack.length === 0) {
            return;
        }

        const lastIndex = state.undoStack.length - 1;
        return {
            history: [...state.history, state.undoStack[lastIndex]],
            undoStack: state.undoStack.slice(0, lastIndex)
        }
    }),

    color: "#000000",
    setColor: (color) => set({ color }),
}));

export default useStore;