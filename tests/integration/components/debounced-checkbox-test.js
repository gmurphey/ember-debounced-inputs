import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { later } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';

const timeout = (ms) => {
  return new Promise((resolve) => {
    later(resolve, ms);
  })
};

module('Integration | Component | debounced-checkbox', function(hooks) {
  setupRenderingTest(hooks);

  test('it basically works', async function(assert) {
    this.set('checked', false);
    this.set('onChange', (value) => {
      assert.step(value ? 'checked' : 'unchecked');
      this.set('checked', value);
    })

    await render(hbs`
      <DebouncedCheckbox
        @checked={{this.checked}}
        @onChange={{this.onChange}}
      />
    `);

    assert.dom('input[type="checkbox"]').isNotChecked();
    assert.dom('input[type="checkbox"]').doesNotHaveAttribute('checked');

    click('input[type="checkbox"]');

    await timeout(1);

    assert.dom('input[type="checkbox"]').isChecked();
    assert.equal(this.checked, false);

    await settled();

    assert.dom('input[type="checkbox"]').isChecked();
    assert.dom('input[type="checkbox"]').doesNotHaveAttribute('checked');
    assert.equal(this.checked, true);

    assert.verifySteps(['checked']);
  });

  test('clicking the checkbox twice cancels the first update', async function(assert) {
    this.set('checked', false);
    this.set('onChange', (value) => {
      assert.step(value ? 'checked' : 'unchecked');
      this.set('checked', value);
    })

    await render(hbs`
      <DebouncedCheckbox
        @checked={{this.checked}}
        @onChange={{this.onChange}}
      />
    `);

    assert.dom('input[type="checkbox"]').isNotChecked();
    assert.dom('input[type="checkbox"]').doesNotHaveAttribute('checked');

    click('input[type="checkbox"]');

    await timeout(1);

    assert.dom('input[type="checkbox"]').isChecked();
    assert.equal(this.checked, false);

    click('input[type="checkbox"]');

    await timeout(1);

    assert.dom('input[type="checkbox"]').isNotChecked();
    assert.equal(this.checked, false);

    await settled();

    assert.dom('input[type="checkbox"]').isNotChecked();
    assert.dom('input[type="checkbox"]').doesNotHaveAttribute('checked');
    assert.equal(this.checked, false);

    assert.verifySteps([]);
  });
});
