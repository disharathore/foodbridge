import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }

  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('ErrorBoundary caught:', error, info); }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="error-boundary">
        <div>
          <div className="error-boundary-icon">⚠️</div>
          <div className="error-boundary-title">Something went wrong</div>
          <div className="error-boundary-msg">{this.state.error?.message || 'An unexpected error occurred.'}</div>
          <button className="btn-primary" onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}>
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
