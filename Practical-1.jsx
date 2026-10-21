import React, { useState } from 'react';

/**
 * ============================================================================
 * PRACTICAL 1: Build a React application using Functional Components,
 *              JSX and Component Reusability concepts.
 * ============================================================================
 * Concepts Demonstrated:
 *  1. Functional Components (Stateless & Stateful)
 *  2. JSX Syntax (Expressions, Fragments <>, Conditional rendering, Style objects)
 *  3. Component Reusability (Generic Reusable Button, Card, Badge, and Header)
 *  4. Props Destructuring with Default Parameters
 * ============================================================================
 */

// -------------------------------------------------------------
// 1. REUSABLE UI COMPONENT: Button
// -------------------------------------------------------------
export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon = null,
  onClick,
  disabled = false,
  style = {}
}) => {
  // Variant styles
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
    },
    secondary: {
      background: '#334155',
      color: '#f8fafc',
      border: '1px solid #475569'
    },
    outline: {
      background: 'transparent',
      color: '#38bdf8',
      border: '1px solid #38bdf8'
    },
    danger: {
      background: '#ef4444',
      color: '#ffffff',
      border: 'none'
    }
  };

  // Size styles
  const sizeStyles = {
    sm: { padding: '6px 14px', fontSize: '0.85rem' },
    md: { padding: '10px 20px', fontSize: '0.95rem' },
    lg: { padding: '14px 28px', fontSize: '1.05rem' }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style
  };

  return (
    <button style={baseStyle} onClick={onClick} disabled={disabled}>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

// -------------------------------------------------------------
// 2. REUSABLE UI COMPONENT: Badge
// -------------------------------------------------------------
export const Badge = ({ text, color = '#38bdf8', bg = 'rgba(56, 189, 248, 0.15)' }) => {
  const badgeStyle = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: color,
    background: bg,
    border: `1px solid ${color}33`,
    marginBottom: '10px'
  };

  return <span style={badgeStyle}>{text}</span>;
};

// -------------------------------------------------------------
// 3. REUSABLE UI COMPONENT: Card
// -------------------------------------------------------------
export const Card = ({
  icon,
  badgeText,
  title,
  description,
  actionText = 'Learn More',
  onActionClick,
  footerNote
}) => {
  const cardStyle = {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s, border-color 0.2s'
  };

  return (
    <div style={cardStyle}>
      {icon && <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{icon}</div>}
      {badgeText && <Badge text={badgeText} />}
      <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', flexGrow: 1 }}>
        {description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {footerNote && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{footerNote}</span>}
        <Button variant="outline" size="sm" onClick={onActionClick}>
          {actionText} →
        </Button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. REUSABLE UI COMPONENT: Navigation Header
// -------------------------------------------------------------
export const Header = ({ brandName = 'ReactPractical1', links = [] }) => {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: '1px solid #334155',
    marginBottom: '40px'
  };

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: '800', color: '#818cf8' }}>
        <span>⚛️</span>
        <span>{brandName}</span>
      </div>
      <nav style={{ display: 'flex', gap: '20px' }}>
        {links.map((link, idx) => (
          <a key={idx} href={link.href} style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '500' }}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
};

// -------------------------------------------------------------
// 5. MAIN APPLICATION COMPONENT (Practical 1 Entry)
// -------------------------------------------------------------
export default function Practical1() {
  const [clickCount, setClickCount] = useState(0);
  const [activeMessage, setActiveMessage] = useState('Click any reusable button below to test!');

  // Demonstration Data for Reusable Cards
  const coreFeatures = [
    {
      id: 1,
      icon: '⚡',
      badge: 'Architecture',
      title: 'Functional Components',
      desc: 'Simple JavaScript functions accepting props and returning JSX. Cleaner syntax, no "this" binding issues.',
      note: 'React 18+'
    },
    {
      id: 2,
      icon: '🎨',
      badge: 'Syntax',
      title: 'JSX Syntax & Expressions',
      desc: 'XML-like syntax extension for JavaScript. Easily embed variables, calculations, and inline logic using curly braces.',
      note: 'Syntactic Sugar'
    },
    {
      id: 3,
      icon: '♻️',
      badge: 'Design Pattern',
      title: 'Component Reusability',
      desc: 'Building generic, atomic UI elements (Buttons, Cards, Badges) that are reused with varied props across the app.',
      note: 'DRY Principle'
    }
  ];

  const handleCardClick = (title) => {
    setClickCount((prev) => prev + 1);
    setActiveMessage(`Triggered action on reusable card: "${title}"`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', padding: '20px 40px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Banner */}
      <div style={{ background: 'rgba(79, 70, 229, 0.2)', border: '1px solid rgba(79, 70, 229, 0.4)', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px', fontSize: '0.9rem' }}>
        🎓 <strong>Practical 1:</strong> Build a React application using Functional Components, JSX and Component Reusability concepts.
      </div>

      {/* Header */}
      <Header
        brandName="React Components Lab"
        links={[
          { label: 'Components', href: '#components' },
          { label: 'JSX', href: '#jsx' },
          { label: 'Reusability', href: '#reusability' }
        ]}
      />

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '40px 0 60px' }}>
        <Badge text="Modular React Design" color="#818cf8" bg="rgba(129, 140, 248, 0.15)" />
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '16px' }}>
          Functional Components & JSX Reusability
        </h1>
        <p style={{ maxWidth: '650px', margin: '0 auto 30px', color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6' }}>
          This application demonstrates how to write clean, reusable React functional components
          with configurable props, dynamic JSX expressions, and flexible layouts.
        </p>

        {/* Buttons Demonstrating Variant Props */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            icon="🚀"
            onClick={() => {
              setClickCount((prev) => prev + 1);
              setActiveMessage('Primary Button Clicked!');
            }}
          >
            Primary Action
          </Button>

          <Button
            variant="secondary"
            icon="⚙️"
            onClick={() => {
              setClickCount((prev) => prev + 1);
              setActiveMessage('Secondary Button Clicked!');
            }}
          >
            Secondary Option
          </Button>

          <Button
            variant="danger"
            icon="🗑️"
            onClick={() => {
              setClickCount(0);
              setActiveMessage('Reset Counter State!');
            }}
          >
            Reset State
          </Button>
        </div>
      </section>

      {/* Dynamic Status Display Box */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px 24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Live Interaction Feed:</span>
          <p style={{ color: '#38bdf8', fontWeight: '600', marginTop: '4px' }}>{activeMessage}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Clicks</span>
          <p style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f59e0b' }}>{clickCount}</p>
        </div>
      </div>

      {/* Reusable Cards Grid Section */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Reused Component Instances</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
        {coreFeatures.map((item) => (
          <Card
            key={item.id}
            icon={item.icon}
            badgeText={item.badge}
            title={item.title}
            description={item.desc}
            footerNote={item.note}
            actionText="Inspect"
            onActionClick={() => handleCardClick(item.title)}
          />
        ))}
      </div>

      <footer style={{ textAlign: 'center', borderTop: '1px solid #334155', padding: '24px 0', color: '#64748b', fontSize: '0.9rem' }}>
        © Full Stack Web Development Lab • Practical 1 Implementation
      </footer>
    </div>
  );
}
