import { useEffect, useMemo } from 'react';
import { useQuery, gql, useMutation, useSubscription } from '@apollo/client';
import useStore from 'store';
import { v4 as uuidv4 } from 'uuid';

const SESSION_QUERY = gql`
    query {
        session {
            interactions {
                userId,
                data
            }
        }
    }
`;

const PUSH_INTERACTION_MUTATION = gql`
    mutation PushInteraction($userId: ID!, $timestamp: String!, $data: JSON!) {
        pushInteraction(userId: $userId, timestamp: $timestamp, data: $data) {
            userId,
            data
        }
    }
`;

const NEW_INTERACTION_SUBSCRIPTION = gql`
    subscription {
        newInteraction {
            userId,
            data
        }
    }
`;

const useSession = () => {
    const userId = useMemo(uuidv4, []);
    
    const setSession = useStore(state => state.setSession);
    const addToSession = useStore(state => state.addToSession);
    const removeUserInteraction = useStore(state => state.removeUserInteraction);

    const { data: sessionData } = useQuery(SESSION_QUERY);
    const [pushInteractionMutation] = useMutation(PUSH_INTERACTION_MUTATION);
    const { data: newInteractionData } = useSubscription(NEW_INTERACTION_SUBSCRIPTION);
    const newInteraction = newInteractionData?.newInteraction;

    const pushInteraction = (data) => {
        const timestamp = new Date().toJSON();

        const interaction = {
            userId,
            timestamp,
            data
        }

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
    }, [sessionData, setSession]);

    useEffect(() => {
        if(!newInteraction) {
            return;
        }
        
        addToSession(newInteraction);
        removeUserInteraction(newInteraction.data);
    }, [newInteraction, addToSession, removeUserInteraction]);

    return [pushInteraction];
};

export default useSession;