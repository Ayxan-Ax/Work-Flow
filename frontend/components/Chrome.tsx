'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

/**
 * Top navigation.
 *
 * The active tab uses the designer's slash effect: two copies of the label clipped by a
 * diagonal, with a tapered red blade crossing the cut. It plays once when a tab becomes
 * active and is disabled under prefers-reduced-motion (the final cut is still shown).
 */
export function TopNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: 'Overview' },
    { href: '/workflows', label: 'Workflows' },
  ];

  const tabsAfterBrand = [
    { href: '/workflows/wf_purchase_request/automation', label: 'Automation' },
  ];

  return (
    <nav className="top">
      {tabs.map((tab) => (
        <NavTab key={tab.href} {...tab} active={isActive(pathname, tab.href)} />
      ))}

      <Link className="brand" href="/">
        {/* Logo from the designer handoff: workflowplan/04_FRONTEND/ui/screens/hososhi-mark.png */}
        <Image src="/hososhi-mark.png" alt="" width={36} height={36} priority />
        <b>HOSOSHI</b>
      </Link>

      {tabsAfterBrand.map((tab) => (
        <NavTab key={tab.href} {...tab} active={isActive(pathname, tab.href)} />
      ))}
    </nav>
  );
}

function NavTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  if (!active) {
    return (
      <Link className="nav" href={href}>
        {label}
      </Link>
    );
  }

  return (
    <Link className="nav on" href={href} aria-current="page">
      <span className="cut">
        <span className="ca">{label}</span>
        <span className="cb" aria-hidden="true">
          {label}
        </span>
        <i aria-hidden="true" />
      </span>
    </Link>
  );
}

/** Overview is only active on its own route; the others match on path prefix. */
function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href) || (href === '/workflows' && pathname.startsWith('/workflows/'));
}

/** The sawtooth rule between the nav and the content. */
export function Sawtooth() {
  return <div className="sg" aria-hidden="true" />;
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="bc">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`}>
            {item.href && !last ? (
              <Link href={item.href}>{item.label}</Link>
            ) : last ? (
              <b>{item.label}</b>
            ) : (
              <span>{item.label}</span>
            )}
            {!last ? ' / ' : null}
          </span>
        );
      })}
    </div>
  );
}