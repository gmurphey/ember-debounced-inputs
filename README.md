# ember-debounced-inputs

[![Build Status](https://travis-ci.org/gmurphey/ember-debounced-inputs.svg?branch=master)](https://travis-ci.org/gmurphey/ember-debounced-inputs)

## Compatibility

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above

## Installation

```
ember install ember-debounced-inputs
```

## Usage

There are a number of components packaged with `ember-debounced-inputs`.

### Debounced Input

```hbs
<DebouncedInput
  @value={{this.value}}
  @onChange={{this.onChange}}
>
```

### Debounced Checkbox

```hbs
<DebouncedCheckbox
  @checked={{this.checked}}
  @onChange={{this.onChange}}
>
```

### Debounced Textarea

Coming soon...

### Debounced Radio Button Group

Coming soon...

### Debounced Select

Coming soon...

### Creating your own debounced components

This addon also provides a renderless `DebouncedValue` component that all of its input components use as a wrapper to handle debounced updates to properties.

```hbs
<DebouncedValue @value={{this.value}} @onDebounce={{action (mut this.value)}} as |value actions meta|>
  <p>{{value}}{{#if meta.isRunning}} (Updating){{/if}}</p>

  <button data-test-id="foobar" {{on 'click' (action actions.update 'foobar')}}>
    Update to 'foobar'
  </button>

  <button data-test-id="foobarbuzz" {{on 'click' (action actions.update 'foobarbuzz')}}>
    Update to 'foobarbuzz'
  </button>
</DebouncedValue>
```

The following is yielded from a `DebouncedValue` invocation:

- `value` (`any`) The internal, up-to-date value that's used when debouncing
- `actions` (`object`)
  - `update` (`action`) Debounces value updates (expects the value as the first argument)
  - `cancel` (`action`) Cancels any pending updates
- `meta` (`object`)
  - `isRunning` (`boolean`) Indicates whether the `update` task is currently running

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
