import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';

import { createRandomComments } from '../helpers/comments_helper';
// Configuration
dotenv.config();
//Request
const request = supertest('https://gorest.co.in/public/v2/');
const token = process.env.USER_TOKEN;
describe(' /comments route', () => {
    let userid = null;
    let postid = null;
    it(' GET /comments', async () => {
        const res = await request.get('comments');
        console.log(res.body);
        postid=res.body[0].post_id;
    // Assertions
     expect(res).to.not.be.empty;
    });
    it('POST /comments', async function() {
        this.retries(4);
        const data = createRandomComments(postid);
        console.log(data.post_id)
        const res = await request.post('comments')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        // Get back the id of the post we just created to use later
        postid = res.body.id;
        console.log(res.body);
     // Assertions   
        expect(res.body).to.include(data);
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('email');
        expect(res.body).to.have.property('body');
        expect(res.body.id).to.eq(postid);
    });
    it('GET /comments/:id', async () => {
        const res = await request.get(`comments/${postid}?access-token=${token}`);
        //console.log(res.body.data);
        // Assertions
        expect(res.body.id).to.eq(postid);
    });
    it('PUT /comments/:id', async () => {
        const data = {
            name: 'Test user updated'
        };
        const res = await request.put(`comments/${postid}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        //console.log(res.body);
        // Assertions 
        expect(res.body.name).to.equal(data.name);
        expect(res.body).to.include(data);
    });
    it('DELETE /comments/:id | User we just created', async () => {
        const res = await request.delete(`comments/${postid}`)
            .set('Authorization', `Bearer ${token}`);
        console.log(res.body);
        expect(res.body).to.be.empty;
    });
    it('GET /comments/:id | Negative', async () => {
        const res = await request.get(`comments/${postid}`);
        //console.log(res.body.message);
        expect(res.body.message).to.eq('Resource not found');
    });
    it('DELETE /comments/:id | Negative', async () => {
        const res = await request.delete(`users/${postid}`)
            .set('Authorization', `Bearer ${token}`);
        //console.log(res.body.message);
        // Assertions
        expect(res.body.message).to.equal('Resource not found');
    });
});


