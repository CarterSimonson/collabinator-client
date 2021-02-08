import create from 'zustand'


const useStore = create(set => ({
    lines: [],
    addLine: (line) => set(state => {
        return {
            lines: [...state.lines, line],
            undoStack: []
        };
    }),
    clearLines: () => set({lines: []}),

    currentLine: [],
    addToCurrentLine: (stroke) => set(state => ({ currentLine: [...state.currentLine, stroke]})),
    clearCurrentLine: () => set({currentLine: []}),

    undoStack: [],
    undo: () => set(state => {
        if(state.lines.length === 0) {
            return;
        }

        const lastIndex = state.lines.length - 1;
        return {
            lines: state.lines.slice(0, lastIndex),
            undoStack: [...state.undoStack, state.lines[lastIndex]]
        };
    }),
    redo: () => set(state => {
        if(state.undoStack.length === 0) {
            return;
        }

        const lastIndex = state.undoStack.length - 1;
        return {
            lines: [...state.lines, state.undoStack[lastIndex]],
            undoStack: state.undoStack.slice(0, lastIndex)
        }
    }),

    color: "#000000",
    setColor: (color) => set({ color }),
}));

export default useStore;