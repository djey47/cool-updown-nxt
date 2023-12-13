import { recall } from './recaller';

jest.useFakeTimers();

describe('recaller helper', () => {
    describe('recall function', () => {
      it('should invoke setTimeout JS func', (done) => {
        // given
        const callback = () => {
          // then
          done();
        };

        // when
        recall(callback, 30000); 
        jest.runAllTimers();
      });      
      
      it('should return timeout instance via catcher callback', (done) => {
        // given
        const catcherCallback = (t: NodeJS.Timeout) => {
          // then
          expect(t).not.toBeUndefined();
          done();
        };

        // when
        recall(() => {}, 30000, catcherCallback); 
      });
    });
});