import axios from 'axios';
import { $host } from './index';

export const getRentals = async () => {
    const { data } = await $host.get('api/rentals');
    return data;
};

export const getIsActive = async () => {
    // const data = await $host.get();
    const data = {active: false}
    return data;
}

export const updateStop = async (id, totalSeconds) => {
    const { data } = await $host.post('api/stop', { id, totalSeconds })
    return data;
}

export const updateStart = async (id) => {
    const { data } = await $host.post('api/start', { id })
    return data;
}