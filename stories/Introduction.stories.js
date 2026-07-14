export default {
  title: 'Introduction',
};

export const SupportedComponents = {
  name: 'Supported HTML components',
  render: () => {
    const root = document.createElement('div');
    root.className = 'vj-demo';
    root.innerHTML = `
      <h1>vanilla-js-validator</h1>
      <p>Use the Field stories to exercise native HTML controls. Extensions are documented under <code>examples/extensions/</code>, not here.</p>

      <h2>Supported components</h2>
      <ul>
        <li><strong>Text & contact</strong> — text, password, search, email, url, tel</li>
        <li><strong>Numbers</strong> — number, range</li>
        <li><strong>Dates & time</strong> — date, time, datetime-local, month, week</li>
        <li><strong>Choices</strong> — checkbox, radio groups</li>
        <li><strong>Select & textarea</strong> — native select, textarea</li>
        <li><strong>Other</strong> — file, color</li>
        <li><strong>Full form</strong> — combined controls</li>
        <li><strong>Presets</strong> — default / Bootstrap / Tailwind class maps (no framework packages)</li>
      </ul>

      <h2>Built-in checks</h2>
      <p><code>required</code>, <code>type</code>, <code>pattern</code>, <code>min</code>, <code>max</code>, <code>minLength</code>, <code>maxLength</code>, <code>step</code>, <code>badInput</code></p>

      <h2>Choice-field notes</h2>
      <ul>
        <li>Radios with the same <code>name</code> validate as one group.</li>
        <li>Invalid radios/checkboxes are highlighted; the message sits under the group (not between input and label).</li>
        <li>A required checkbox uses the native Constraint Validation API.</li>
        <li>“At least one” checkbox groups need a custom validator (see Choices → Checkbox group).</li>
      </ul>
    `;
    return root;
  },
};
