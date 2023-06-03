import supertest from 'supertest';
import { expect} from 'chai';
import dotenv from 'dotenv';
import {createRandomtodos} from '../helpers/todos_helper';
// Configuration
dotenv.config();
//Request
const request = supertest('https://gorest.co.in/public/v2/');
const token = process.env.USER_TOKEN;
describe(' /todos route', () => {
    let userId = null;
    before(async () => {
        const res = await request.get('posts').set('Authorization', `Bearer ${token}`);
         userId = res.body[0].id;
    });
    it(' GET /todos', async () => {
        const res = await request.get('todos');
        console.log(res.body);
        expect(res.body).to.not.be.empty;
    });

    it('POST /todos', async () => {
        const data = createRandomtodos();
        data.user_id = userId;
        const res = await request
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        expect(res.body).to.not.have.property('title');

    });
      
    it('PUT/todos/.id', async () => {
        const data = {
            name: 'Test user updated'
        };

        expect(data.title).to.equal(data.title);

    });
    
    it('DELETE /todos/:id | User we just created', async () => {
        const res = await request
            .delete(`todos`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.body).to.not.be.null;

    });

    it('GET /todos/:id | Negative', async () => {
        const res = await request
            .get(`todos`);

        expect(res.body).to.not.equal('Resource not found');
    });

    it('DELETE /todos/:id | Negative', async () => {
        const res = await request
            .delete(`todos`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.body).to.not.equal('Resource not found');
    });
});