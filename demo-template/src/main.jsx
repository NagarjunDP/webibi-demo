import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import content from './content.js'

// Inject CSS variables from content
const root = document.documentElement
root.style.setProperty('--color-primary', content.primaryColor)
root.style.setProperty('--color-secondary', content.secondaryColor)
root.style.setProperty('--color-accent', content.accentColor)
root.style.setProperty('--font-heading', `'${content.fontHeading}', serif`)
root.style.setProperty('--font-body', `'${content.fontBody}', sans-serif`)

// Set page title
document.title = `${content.company} — ${content.tagline}`

// Inject Google Fonts
const link = document.createElement('link')
const h = content.fontHeading.replace(/ /g, '+')
const b = content.fontBody.replace(/ /g, '+')
link.href = `https://fonts.googleapis.com/css2?family=${h}:wght@400;700&family=${b}:wght@300;400;500;600;700&display=swap`
link.rel = 'stylesheet'
document.head.appendChild(link)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
