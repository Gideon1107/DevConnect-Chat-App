import { HOST } from '@/utils/constants';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: HOST, // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

