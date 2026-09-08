/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      colors: {
        // Light-theme neutrals — the app now lives on a white canvas.
        canvas: {
          50:  '#ffffff',
          100: '#fafbfc',
          200: '#f4f6f8',
          300: '#eceff3',
          400: '#dfe4ea',
          500: '#c7ced7'
        },
        ink: {
          50:  '#8790a3',   // muted meta
          100: '#5d6577',   // secondary text
          200: '#3d4457',   // body
          300: '#242a3a',   // strong body
          400: '#151a26',   // headings
          500: '#0a0e18'    // near-black
        },
        // Team accents — kept, but toned for light mode.
        teamA: {
          50:  '#eaf3ff',
          100: '#cfe3ff',
          200: '#9cc6ff',
          300: '#5ba0ff',
          400: '#2c85ff',
          500: '#1170ea',
          600: '#0a58bd',
          700: '#0a4795'
        },
        teamB: {
          50:  '#fff1e8',
          100: '#ffe0cc',
          200: '#ffbf99',
          300: '#ff9a63',
          400: '#ff7c3d',
          500: '#e6541a',
          600: '#c14212',
          700: '#93320c'
        },
        accent: {
          gold: '#eab308',
          mint: '#10b981',
          rose: '#ef4444',
          violet: '#8b5cf6',
          amber: '#f59e0b'
        }
      },
      boxShadow: {
        card:  '0 1px 2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.06)',
        pop:   '0 8px 24px -8px rgba(15, 23, 42, 0.20), 0 4px 12px -4px rgba(15, 23, 42, 0.12)',
        ring:  '0 0 0 1px rgba(17, 112, 234, 0.15), 0 0 0 4px rgba(17, 112, 234, 0.08)'
      }
    }
  },
  plugins: []
}
