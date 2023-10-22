import { AppContext } from './context';

describe('AppContext singleton class', () => {
    describe('get static method', () => {
        it('should return always same instance', () => {
            // when
            const actualInstance1 = AppContext.get();
            const actualInstance2 = AppContext.get();

            // then
            expect(actualInstance1).toBe(actualInstance2);
        });
    })
});
