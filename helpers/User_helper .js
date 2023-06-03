
import { randFullName, randEmail } from "@ngneat/falso";
export const createRandomUser = () => {
    const data = {
        email: randEmail({provider: 'jenseneducation', suffix: 'ganga'}),
        name: randFullName({gender: 'female'}),
        gender: 'male',
        status: 'active'


    };
    return data;
}