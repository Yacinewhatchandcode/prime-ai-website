import { lazy, Suspense } from 'react';
import ReplicaLanding from './pages/ReplicaLanding';
import ResponsivePreview from './pages/ResponsivePreview';
import SemanticLibrary from './pages/SemanticLibrary';
import ReplicaImage from './pages/ReplicaImage';
import ConvergenceStatus from './pages/ConvergenceStatus';

const WorkspaceApp = lazy(() => import('./App.jsx'));

export default function SiteEntry() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  let page;
  if (pathname === '/replica' || (pathname === '/' && !window.location.hash.startsWith('#/'))) page = <ReplicaLanding />;
  else if (pathname === '/responsive-preview') page = <ResponsivePreview />;
  else if (pathname === '/semantic-library') page = <SemanticLibrary />;
  else if (pathname === '/replica-image') page = <ReplicaImage />;
  else if (pathname === '/convergence') page = <ConvergenceStatus />;
  else page = <WorkspaceApp />;
  return <Suspense fallback={<main role="status">Loading PRIME-AI workspace…</main>}>{page}</Suspense>;
}
