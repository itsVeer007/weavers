import { ItemNameValidatorPipe } from './item-name-validator.pipe';

describe('ItemNameValidatorPipe', () => {
  it('create an instance', () => {
    const pipe = new ItemNameValidatorPipe();
    expect(pipe).toBeTruthy();
  });
});
