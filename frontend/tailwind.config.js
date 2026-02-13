// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-dull': 'rgb(var(--color-primary-dull) / <alpha-value>)',
      },
    },
  },
}
