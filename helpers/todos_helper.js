import {randPost} from '@ngneat/falso';
export const createRandomtodos = (userId) => {
    const data = {
        user_id: userId,
        due_on: '2023-06-17T00:00:00.000+05:30',
        title: randPost().title,
        status: 'completed'
    };
    return data;
}