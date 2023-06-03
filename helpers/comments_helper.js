import {randFullName,randEmail ,randPost} from '@ngneat/falso';
export const createRandomComments = (postid) => {
    const data = {
         post_id: postid,
         email: randEmail({provider:'jenseneducation', suffix: 'example'}),
         name: randFullName(),
         body: randPost().body
    };
    return data;
}