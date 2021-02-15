import { useState, useEffect } from 'react';
import { useQuery, gql, useMutation, useSubscription } from '@apollo/client';
import useStore from 'store';

const SESSION_QUERY = gql`
    query {
        session {
            interactions {
                timestamp,
                data
            }
        }
    }
`;

const ADD_INTERACTION_MUTATION = gql`
    mutation AddInteraction($timestamp: String!, $data: JSON!) {
        addInteraction(timestamp: $timestamp, data: $data) {
            timestamp,
            data
        }
    }
`;

const NEW_INTERACTION_SUBSCRIPTION = gql`
    subscription {
        newInteraction {
            timestamp,
            data
        }
    }
`;

const useSession = () => {
    const session = useStore(state => state.session);
    const setSession = useStore(state => state.setSession);
    const addInteractionToSession = useStore(state => state.addInteraction);

    const { data: sessionData } = useQuery(SESSION_QUERY);
    const [addInteractionMutation] = useMutation(ADD_INTERACTION_MUTATION);
    const { data: newInteractionData } = useSubscription(NEW_INTERACTION_SUBSCRIPTION);
    const newInteraction = newInteractionData?.newInteraction;

    const addInteraction = (data) => {
        const timestamp = new Date().toJSON();

        const interaction = {
            timestamp,
            data
        }

        addInteractionToSession(interaction);

        addInteractionMutation({
            variables: {
                timestamp,
                data
            }
        });
    }

    useEffect(() => {
        if(!sessionData) {
            return;
        }

        const { session } = sessionData;
        setSession(session);
    }, [sessionData, setSession])

    useEffect(() => {
        if(!newInteraction) {
            return;
        }

        addInteractionToSession(newInteraction);
    }, [newInteraction, addInteractionToSession]);

    return [newInteraction, addInteraction];
};

export default useSession;