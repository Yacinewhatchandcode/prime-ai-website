export default function SkipLink() {
  return (
    <a className="skip-link" href="#main-content" onClick={event => {
      event.preventDefault();
      document.getElementById('main-content')?.focus();
    }}>Skip to main content</a>
  );
}
