import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { createRandomPost } from '../helpers/post_helper';
import { createRandomUser } from '../helpers/User_helper ';
// Configuration
dotenv.config();

describe('/posts route', () => {
    /* Setup */
    const request = supertest('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;
    let userId = null;
    let postId = null;

    /* Creating a fresh user so we have one to work with */
    before(async () => {
        const res = await request.post('users').set('Authorization', `Bearer ${token}`).send(createRandomUser());
        userId = res.body.id;
    });

    /* Tests */
    it('GET /posts', async () => {
        const res = await request.get('posts')
        expect(res.body).to.not.be.empty;
        console.log(res.body);
        //userId = res.body.data[0].user_id; // We can't be sure this user works to work with
    });

    it('POST /posts', async function() {
        this.retries(4);
        const data = createRandomPost(userId);
        const res = await request.post('posts')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        expect(res.body).to.have.property('id');
        // Get back the id of the post we just created to use later
        postId = res.body.id;
        
    });

    it('GET /posts/:id', async () => {
        const res = await request.get(`posts/${postId}?access-token=${token}`);
        expect(res.body.id).to.eq(postId);
    });

    it('PUT /posts/:id', async () => {
        const data = {
            title: 'This post has changed',
            body: 'This post has a new body'
        };

        const res = await request.put(`posts/${postId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        expect(res.body.title).to.eq(data.title);
        expect(res.body.body).to.eq(data.body);
    });
    it('DELETE /posts/:id', async () => {
        const res = await request.delete(`posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);
             expect(res.body).to.be.empty;
    });
    it('GET /posts/:id | Negative', async () => {
        const res = await request.get(`posts/${postId}`);
            expect(res.body.message).to.eq('Resource not found');
    });

    it('DELETE /posts/:id | Negative', async () => {
        const res = await request.delete(`posts/${postId}`)
        expect(res.body.message).to.equal('Resource not found');
    });
    
    /* Cleanup */
    after(async () => {
        const res = await request
          .delete(`users/${userId}`)
          .set('Authorization', `Bearer ${token}`);
    });
});