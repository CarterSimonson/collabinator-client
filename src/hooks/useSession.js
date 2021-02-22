import { useEffect, useMemo, useState } from 'react';
import { useQuery, gql, useMutation, useSubscription } from '@apollo/client';
import useStore from 'store';
import { v4 as uuidv4 } from 'uuid';

const SESSION_QUERY = gql`
    query {
        session {
            interactions {
                action,
                userId,
                timestamp,
                data
            }
        }
    }
`;

const PUSH_INTERACTION_MUTATION = gql`
    mutation PushInteraction($action: InteractionAction!, $userId: ID!, $timestamp: String!, $data: JSON!) {
        pushInteraction(action: $action, userId: $userId, timestamp: $timestamp, data: $data) {
            action,
            userId,
            timestamp,
            data
        }
    }
`;

const NEW_INTERACTION_SUBSCRIPTION = gql`
    subscription {
        newInteraction {
            action,
            userId,
            timestamp,
            data
        }
    }
`;

const useSession = () => {
    const userId = useMemo(uuidv4, []);
    const [session, setSession] = useState(undefined);

    const addToHistory = useStore(state => state.addToHistory);

    const { data: sessionData } = useQuery(SESSION_QUERY);
    const [pushInteractionMutation] = useMutation(PUSH_INTERACTION_MUTATION);
    const { data: newInteractionData } = useSubscription(NEW_INTERACTION_SUBSCRIPTION);
    const newInteraction = newInteractionData?.newInteraction;

    const pushInteraction = (action, data) => {
        const timestamp = new Date().toJSON();

        const interaction = {
            action,
            userId,
            timestamp,
            data
        }

        addToHistory(interaction);

        pushInteractionMutation({
            variables: interaction
        });
    }

    useEffect(() => {
        if(!sessionData) {
            return;
        }

        const { session } = sessionData;
        setSession(session);
    }, [sessionData]);

    useEffect(() => {
        if(!newInteraction || newInteraction.userId === userId) {
            return;
        }

        addToHistory(newInteraction);
    }, [newInteraction, addToHistory, userId]);

    return [session, pushInteraction];
};

export default useSession;