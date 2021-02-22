import create from 'zustand'

const useStore = create(set => ({
    baseInteraction: undefined,
    setBaseInteraction: (baseInteraction) => set({ baseInteraction }),

    history: [],
    addToHistory: (interaction) => set((state) => {
        return {
            history: [...state.history, interaction],
        }
    }),

    undoStack: [],
    undo: () => set(state => {
        console.log(state.history);
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

    currentLine: {},
    startCurrentLine: () => set((state) => ({
        currentLine: {
            color: state.color,
            size: state.size,
            nodes: []
        }
    })),
    addToCurrentLine: (node) => set(state => ({
        currentLine: {
            ...state.currentLine,
            nodes: [...state.currentLine.nodes, node]
        }
    })),
    clearCurrentLine: () => set({currentLine: {}}),

    color: "#000000",
    setColor: (color) => set({ color }),

    size: 10,
    setSize: (size) => set({ size }),
}));

export default useStore;