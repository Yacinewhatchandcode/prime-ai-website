import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ minHeight: '60vh', padding: '80px 24px', textAlign: 'center' }}>
      <p>404 · Page not found</p>
      <h1>This route is not part of the PRIME-AI site.</h1>
      <Link to="/">Return to PRIME-AI</Link>
    </main>
  );
}
