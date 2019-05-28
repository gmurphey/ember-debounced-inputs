import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, settled } from '@ember/test-helpers';
import { later } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';

const timeout = (ms) => {
  return new Promise((resolve) => {
    later(resolve, ms);
  })
};

module('Integration | Component | debounced-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it basically works', async function(assert) {
    this.set('value', '');
    this.set('onChange', (value) => {
      assert.step(value);
      this.set('value', value);
    });

    await render(hbs`
      <DebouncedInput
        @value={{this.value}}
        @onChange={{this.onChange}}
      />
    `);

    assert.dom('input[type="text"]').hasValue('');

    fillIn('input[type="text"]', 'foobar');

    await timeout(1);

    assert.dom('input[type="text"]').hasValue('foobar');
    assert.equal(this.value, '');

    await settled();

    assert.dom('input[type="text"]').hasValue('foobar');
    assert.equal(this.value, 'foobar');

    assert.verifySteps(['foobar']);
  });

  test('typing while a debounced update is in progress cancel the previous update ', async function(assert) {
    this.set('value', '');
    this.set('onChange', (value) => {
      assert.step(value);
      this.set('value', value);
    });

    await render(hbs`
      <DebouncedInput
        @value={{this.value}}
        @onChange={{this.onChange}}
      />
    `);

    fillIn('input[type="text"]', 'foobar');

    await timeout(1);

    fillIn('input[type="text"]', 'foobarbuzz');

    await settled();

    assert.dom('input[type="text"]').hasValue('foobarbuzz');
    assert.equal(this.value, 'foobarbuzz');
    assert.verifySteps(['foobarbuzz']);
  });
});
