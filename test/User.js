import supertest from "supertest"; // importing an object
import { expect } from "chai"; // {} meants that we are importing a function
import dotenv from 'dotenv';
import { createRandomUser } from "../helpers/User_helper ";
// Configuration
dotenv.config();
// Request - create a request object
const request = supertest('https://gorest.co.in/public/v2/');


const token = process.env.USER_TOKEN;
// Mocha test cases
describe('/users', () => {
    let userId = null;
    // Get list of users
    it('GET /users', async () => {
        request.get(`users?access-token=${token}`).then((res) => {
            expect(res.body).to.not.be.empty;
        });
    });
    // Get user by Id
    it('GET /users/:id', async () => {
        request.get(`users/2329074?access-token=${token}`).then((res) => {
            expect(res.body.id).to.not.be.empty;
        });
    });

    it('POST /users', async () => {
        let data = createRandomUser();
        const res = await request
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        expect(res.body).to.include(data);
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('email');
        userId = res.body.id;
    });
    it('POST /users | Negative', async () => {
        const data = {};
        const res = await request
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        expect(res.statusCode).to.eq(422);
    });

    it('GET /users/:id | User we just created', async () => {
        const res = await request.get(`users/${userId}?access-token=${token}`);
        expect(res.body.id).to.eq(userId);
    });

    it('PUT /users/:id', async () => {
        const data = {
            name: 'Test user updated'
        };
        const res = await request.put(`users/${userId}`)

            .set('Authorization', `Bearer ${token}`)
            .send(data);

        //console.log(res.body);
        expect(res.body.name).to.equal(data.name);
        expect(res.body).to.include(data);
    });
    it('DELETE /users/:id | User we just created', async () => {
        const res = await request.delete(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        console.log(res.body);
        expect(res.body).to.be.empty;
    });
    it('GET /users/:id | Negative', async () => {
        const res = await request.get(`users/${userId}`);
        //console.log(res.body.message);
        expect(res.body.message).to.eq('Resource not found');
    });
    it('DELETE /users/:id | Negative', async () => {
        const res = await request.delete(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        //console.log(res.body.message);
        expect(res.body.message).to.equal('Resource not found');
    });
    it('Patch /users/:id', async () => {

        const data = {
            name: 'Vedanga Iyer',
            status: 'active'
        };
        const res = await request.patch(`users/2460424`)

            .set('Authorization', `Bearer ${token}`)
            .send(data);
        expect(res.body.name).to.equal(data.name);
        expect(res.body).to.include(data);


         console.log(res.body);
        // console.log(res.status);
        expect(res.statusCode).to.eq(200);
        expect(res.body).to.not.empty;
    });
    it('Patch /users/:id | Negative', async () => {

        const data = {
            name: 'Harit',
            status: 'active'
        };
        const res = await request.patch(`users/${userId}`)

            .set('Authorization', `Bearer ${token}`)
            .send(data);



        //console.log(res.body);
        //console.log(res.status);
        expect(res.statusCode).to.eq(404);
        expect(res.body).to.not.empty;
        expect(res.body.message).to.eq('Resource not found');

    });
});

