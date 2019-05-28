import Component from '@ember/component';
import layout from '../templates/components/debounced-input';

export default Component.extend({
  tagName: '',
  layout,

  actions: {
    onInput(update, event) {
      let value = event.target.value;

      update(value, event);
    }
  }
});
