import Component from '@ember/component';
import layout from '../templates/components/debounced-checkbox';

export default Component.extend({
  tagName: '',
  layout,

  init() {
    this._super(...arguments);

    this.set('initiallyChecked', this.checked);
  },

  actions: {
    onChange(update, event) {
      let value = event.srcElement.checked;

      event.srcElement.checked = !value;

      update(value, event);
    },

    didUpdateChecked(checked, element) {
      element.checked = checked;
    }
  }
});
