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

module('Integration | Component | debounced-value', function(hooks) {
  setupRenderingTest(hooks);

  test('it basically works', async function(assert) {
    this.set('value', 'foo')
    this.set('onDebounce', (value) => {
      this.set('value', value);
      assert.step(value);
    })

    await render(hbs`
      <DebouncedValue @value={{this.value}} @onDebounce={{this.onDebounce}} as |value actions meta|>
        <p>{{value}}{{#if meta.isRunning}} (Updating){{/if}}</p>

        <button {{on 'click' (action actions.update 'foobar')}}>
          Update
        </button>
      </DebouncedValue>
    `);

    assert.dom('p').matchesText('foo');

    click('button');

    await timeout(1);

    assert.dom('p').matchesText('foobar (Updating)');
    assert.equal(this.value, 'foo');

    await settled();

    assert.dom('p').matchesText('foobar');
    assert.equal(this.value, 'foobar');
    assert.verifySteps(['foobar']);
  });

  test('an update to the value cancels the debounced update', async function(assert) {
    this.set('value', 'foo')
    this.set('onDebounce', (value) => {
      this.set('value', value);
      assert.step(value);
    });

    await render(hbs`
      <DebouncedValue @value={{this.value}} @onDebounce={{this.onDebounce}} as |value actions meta|>
        <p>{{value}}{{#if meta.isRunning}} (Updating){{/if}}</p>

        <button {{on 'click' (action actions.update 'foobar')}}>
          Update to 'foobar'
        </button>
      </DebouncedValue>
    `);

    assert.dom('p').matchesText('foo');

    click('button');

    await timeout(1);

    assert.dom('p').matchesText('foobar (Updating)');
    assert.equal(this.value, 'foo');

    this.set('value', 'foobarbuzz');

    await settled();

    assert.dom('p').matchesText('foobarbuzz');
    assert.equal(this.value, 'foobarbuzz');
    assert.verifySteps([]);
  });


  test('an update is restartable', async function(assert) {
    this.set('value', 'foo')
    this.set('onDebounce', (value) => {
      this.set('value', value);
      assert.step(value);
    });

    await render(hbs`
      <DebouncedValue @value={{this.value}} @onDebounce={{this.onDebounce}} as |value actions meta|>
        <p>{{value}}{{#if meta.isRunning}} (Updating){{/if}}</p>

        <button data-test-id="foobar" {{on 'click' (action actions.update 'foobar')}}>
          Update to 'foobar'
        </button>

        <button data-test-id="foobarbuzz" {{on 'click' (action actions.update 'foobarbuzz')}}>
          Update to 'foobarbuzz'
        </button>
      </DebouncedValue>
    `);

    assert.dom('p').matchesText('foo');

    click('button[data-test-id="foobar"]');

    await timeout(1);

    assert.dom('p').matchesText('foobar (Updating)');
    assert.equal(this.value, 'foo');

    click('button[data-test-id="foobarbuzz"]');

    await timeout(1);

    assert.dom('p').matchesText('foobarbuzz (Updating)');
    assert.equal(this.value, 'foo');

    await settled();

    assert.dom('p').matchesText('foobarbuzz');
    assert.equal(this.value, 'foobarbuzz');
    assert.verifySteps(['foobarbuzz']);
  });
});
