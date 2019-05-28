import Component from "@ember/component";
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import layout from '../templates/components/debounced-value';

export default Component.extend({
  tagName: '',
  layout,

  _value: null,
  _cachedArgsValue: null,

  _debounce: computed('debounce', function() {
    return this.debounce || 250;
  }),

  init() {
    this._super(...arguments);

    this.setProperties({
      _value: this.value,
      _cachedArgsValue: this.value
    });
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if (this.value !== this._cachedArgsValue) {
      this.get('debouncedUpdate').cancelAll();

      this.setProperties({
        _value: this.value,
        _cachedArgsValue: this.value
      });
    }
  },

  debouncedUpdate: task(function*(value) {
    this.set('_value', value);

    yield timeout(this._debounce);

    if (value !== this.value) {
      this.onDebounce(...arguments);
    }
  }).restartable()
});
