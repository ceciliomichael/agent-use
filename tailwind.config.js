/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          soft: "hsl(var(--primary-soft))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
          soft: "hsl(var(--secondary-soft))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
          soft: "hsl(var(--accent-soft))",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          elevated: "hsl(var(--background-elevated))",
        },
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--surface-foreground))",
          hover: "hsl(var(--surface-hover))",
          elevated: "hsl(var(--surface-elevated))",
          dimmed: "hsl(var(--surface-dimmed))",
        },
        panel: {
          DEFAULT: "hsl(var(--panel))",
          foreground: "hsl(var(--panel-foreground))",
          border: "hsl(var(--panel-border))",
          "border-soft": "hsl(var(--panel-border-soft))",
          elevated: "hsl(var(--panel-elevated))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          hover: "hsl(var(--muted-hover))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          hover: "hsl(var(--border-hover))",
          accent: "hsl(var(--border-accent))",
          subtle: "hsl(var(--border-subtle))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        // Code Editor specific colors
        "editor-bg": "hsl(var(--editor-bg))",
        "editor-border": "hsl(var(--editor-border))",
        "editor-text": "hsl(var(--editor-text))",
        "editor-line-numbers": "hsl(var(--editor-line-numbers))",
        "editor-line-highlight": "hsl(var(--editor-line-highlight))",
        "editor-selection": "hsl(var(--editor-selection))",
        "editor-tab-active": "hsl(var(--editor-tab-active))",
        "editor-tab-inactive": "hsl(var(--editor-tab-inactive))",
        "editor-tab-hover": "hsl(var(--editor-tab-hover))",
        
        // Syntax highlighting colors
        "syntax-keyword": "hsl(var(--syntax-keyword))",
        "syntax-string": "hsl(var(--syntax-string))",
        "syntax-number": "hsl(var(--syntax-number))",
        "syntax-comment": "hsl(var(--syntax-comment))",
        "syntax-function": "hsl(var(--syntax-function))",
        "syntax-variable": "hsl(var(--syntax-variable))",
        "syntax-type": "hsl(var(--syntax-type))",
        "syntax-operator": "hsl(var(--syntax-operator))",
        
        // File Explorer specific colors
        "explorer-bg": "hsl(var(--explorer-bg))",
        "explorer-item-hover": "hsl(var(--explorer-item-hover))",
        "explorer-item-selected": "hsl(var(--explorer-item-selected))",
        "explorer-item-active": "hsl(var(--explorer-item-active))",
        "explorer-folder-icon": "hsl(var(--explorer-folder-icon))",
        "explorer-file-icon": "hsl(var(--explorer-file-icon))",
        
        // Markdown specific colors
        "code-bg": "hsl(var(--code-bg))",
        "code-border": "hsl(var(--code-border))",
        "code-text": "hsl(var(--code-text))",
        "inline-code-bg": "hsl(var(--inline-code-bg))",
        "inline-code-text": "hsl(var(--inline-code-text))",
        "blockquote-border": "hsl(var(--blockquote-border))",
        "blockquote-bg": "hsl(var(--blockquote-bg))",
        "table-border": "hsl(var(--table-border))",
        "table-header-bg": "hsl(var(--table-header-bg))",
        "link-color": "hsl(var(--link-color))",
        "link-hover": "hsl(var(--link-hover))",
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-surface': 'var(--gradient-surface)',
        'gradient-panel': 'var(--gradient-panel)',
        'gradient-glow': 'var(--gradient-glow)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'glow': 'var(--shadow-glow)',
        'glow-soft': 'var(--shadow-glow-soft)',
        'inner': 'var(--shadow-inner)',
      },
      transitionDuration: {
        'ultra-fast': 'var(--duration-ultra-fast)',
        'fast': 'var(--duration-fast)',
        'medium': 'var(--duration-medium)',
        'slow': 'var(--duration-slow)',
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-medium) ease-out',
        'slide-in-left': 'slideInLeft var(--duration-medium) ease-out',
        'slide-in-right': 'slideInRight var(--duration-medium) ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        glowPulse: {
          '0%': { boxShadow: 'var(--shadow-glow)' },
          '100%': { boxShadow: '0 0 30px hsla(270, 95%, 75%, 0.5)' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar'),
  ],
}