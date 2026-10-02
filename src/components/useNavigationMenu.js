import { useEffect, useRef, useState } from 'react';

export default function useNavigationMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const controls = () => [toggleRef.current, ...menuRef.current.querySelectorAll('a,button')].filter(Boolean);
    controls()[1]?.focus();
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const items = controls();
        const index = items.indexOf(document.activeElement);
        if (event.shiftKey && index <= 0) {
          event.preventDefault();
          items.at(-1)?.focus();
        } else if (!event.shiftKey && index === items.length - 1) {
          event.preventDefault();
          items[0]?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  return { mobileMenuOpen, setMobileMenuOpen, toggleRef, menuRef };
}
