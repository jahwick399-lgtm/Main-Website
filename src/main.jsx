import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#080808', width: '100vw', height: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: 'white', padding: '20px', textAlign: 'center',
        }}>
          <div style={{ color: '#FFD700', fontSize: '24px', marginBottom: '12px' }}>
            Something went wrong
          </div>
          <div style={{ color: '#666', fontSize: '14px', marginBottom: '24px', maxWidth: 400 }}>
            {this.state.error?.message || 'Unknown error'}
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              background: '#FFD700', color: '#000', border: 'none',
              padding: '12px 24px', borderRadius: '8px',
              fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
            }}
          >
            Back to Login
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
