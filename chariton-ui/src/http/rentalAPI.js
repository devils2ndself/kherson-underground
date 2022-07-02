import axios from 'axios';
import { $host } from './index';

export const getRentals = async () => {
    const { data } = await $host.get('api/rentals');
    return data;
}