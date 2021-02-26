import create from 'zustand'
import _ from 'lodash';

const useStore = create(set => ({
    session: undefined,
    setSession: (session) => set({ session }),
    addToSession: (interaction) => set((state) => {
        return {
            session: {
                interactions: [...state.session.interactions, interaction]
            }
        }
    }),

    currentInteraction: undefined,
    startNewLine: (startNode) => set((state) => ({
        currentInteraction: {
            color: state.color,
            size: state.size,
            nodes: [startNode]
        }
    })),
    addToCurrentLine: (node) => set((state) => ({
        currentInteraction: {
            ...state.currentInteraction,
            nodes: [...state.currentInteraction.nodes, node]
        }
    })),
    completeNewLine: () => set((state) => {
        if(!state.currentInteraction) {
            return;
        }

        return {
            currentInteraction: undefined,
            userInteractions: [...state.userInteractions, state.currentInteraction]
        }
    }),

    userInteractions: [],
    removeUserInteraction: (interactionData) => set((state) => {
        const filteredUserInteractions = state.userInteractions.filter((userInteraction) => !_.isEqual(interactionData, userInteraction));
        return {
            userInteractions: filteredUserInteractions
        }
    }),

    color: "#000000",
    setColor: (color) => set({ color }),

    size: 100,
    setSize: (size) => set({ size }),
}));

export default useStore;