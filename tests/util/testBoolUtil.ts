import BoolUtil from '../../src/util/BoolUtil';

describe('BoolUtil', () => {
    describe('isBoolean', () => {
        it('should return true for boolean values', () => {
            expect(BoolUtil.isBoolean(true)).toBe(true);
            expect(BoolUtil.isBoolean(false)).toBe(true);
        });

        it('should return false for non-boolean values', () => {
            expect(BoolUtil.isBoolean(0)).toBe(false);
            expect(BoolUtil.isBoolean('true')).toBe(false);
            expect(BoolUtil.isBoolean(null)).toBe(false);
            expect(BoolUtil.isBoolean(undefined)).toBe(false);
            expect(BoolUtil.isBoolean({})).toBe(false);
            expect(BoolUtil.isBoolean([])).toBe(false);
        });
    });
});
