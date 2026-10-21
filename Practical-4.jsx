import React, { useState } from 'react';

/**
 * ============================================================================
 * PRACTICAL 4: Develop a Single Page Application (SPA) using React Router
 *              for navigation between multiple pages.
 * ============================================================================
 * Concepts Demonstrated:
 *  1. Single Page Application (SPA) Client-Side Navigation (Zero Page Reloads)
 *  2. Multi-Route Architecture (Home, About, Courses, Course Detail, Contact, 404)
 *  3. Dynamic Routing & URL Parameters (:courseId)
 *  4. Active Link Highlighting (NavLink pattern)
 *  5. Programmatic Navigation (navigate() pattern)
 * ============================================================================
 */

// Sample Course Database for Dynamic Route Demonstration
const COURSES_DATA = [
  {
    id: 'cs101',
    title: 'Full Stack Web Development',
    code: 'CS-101',
    duration: '12 Weeks',
    instructor: 'Prof. Rajesh Sharma',
    level: 'Intermediate',
    description: 'Master modern frontend with React and backend with Express.js & MongoDB Atlas. Build end-to-end applications.',
    syllabus: ['HTML5 & Modern CSS3', 'JavaScript ES6+', 'React.js Components & State', 'Express.js & REST APIs', 'MongoDB Database']
  },
  {
    id: 'cs102',
    title: 'Cloud Computing & DevOps',
    code: 'CS-102',
    duration: '10 Weeks',
    instructor: 'Dr. Priya Desai',
    level: 'Advanced',
    description: 'Learn containerization with Docker, CI/CD pipelines, Git automation, and cloud deployments on AWS/Azure.',
    syllabus: ['Virtualization & Containers', 'Docker & Kubernetes', 'CI/CD with GitHub Actions', 'Cloud Architecture']
  },
  {
    id: 'cs103',
    title: 'Data Structures & Algorithms in C++',
    code: 'CS-103',
    duration: '14 Weeks',
    instructor: 'Prof. Hardik Mehta',
    level: 'Beginner to Advanced',
    description: 'Fundamental problem solving, tree algorithms, dynamic programming, and complexity analysis.',
    syllabus: ['Arrays & Pointers', 'Linked Lists & Stacks', 'Trees & Graphs', 'Dynamic Programming']
  }
];

// -------------------------------------------------------------
// PAGE 1: HOME PAGE
// -------------------------------------------------------------
const HomePage = ({ navigateTo }) => {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '50px 0 40px' }}>
        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '700' }}>
          SPA Router Showcase
        </span>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', margin: '20px 0 16px', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Next-Gen Academic Learning Portal
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 30px', lineHeight: '1.6' }}>
          Explore seamless single-page navigation without any page refresh.
          Switch between pages instantly using client-side routing.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <button
            onClick={() => navigateTo('/courses')}
            style={{ padding: '12px 24px', borderRadius: '8px', background: '#38bdf8', color: '#0f172a', fontWeight: '700', border: 'none', cursor: 'pointer' }}
          >
            Explore Courses →
          </button>
          <button
            onClick={() => navigateTo('/about')}
            style={{ padding: '12px 24px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155', fontWeight: '600', cursor: 'pointer' }}
          >
            About Department
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚡</div>
          <h3 style={{ color: '#f8fafc', marginBottom: '8px' }}>Lightning Fast Navigation</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Transitions happen instantly in JavaScript without server round-trips.</p>
        </div>
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔗</div>
          <h3 style={{ color: '#f8fafc', marginBottom: '8px' }}>Dynamic Route Parameters</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Inspect parameterized URLs like /courses/:courseId dynamically.</p>
        </div>
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🛡️</div>
          <h3 style={{ color: '#f8fafc', marginBottom: '8px' }}>Fallback 404 Route</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Gracefully catches any non-existent page URL path.</p>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// PAGE 2: ABOUT US PAGE
// -------------------------------------------------------------
const AboutPage = () => {
  return (
    <div style={{ background: '#1e293b', padding: '36px', borderRadius: '14px', border: '1px solid #334155' }}>
      <h2 style={{ fontSize: '2rem', color: '#38bdf8', marginBottom: '16px' }}>About Our Computer Department</h2>
      <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '24px' }}>
        The Department of Computer Science & Engineering is committed to delivering excellence in modern software engineering,
        practical hands-on laboratory experiences, and cutting-edge web frameworks including React, Node.js, and Cloud databases.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
          <h4 style={{ color: '#a78bfa', fontSize: '1.8rem', fontWeight: '800' }}>1,200+</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Enrolled Students</p>
        </div>
        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
          <h4 style={{ color: '#34d399', fontSize: '1.8rem', fontWeight: '800' }}>100%</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Practical Lab Coverage</p>
        </div>
        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
          <h4 style={{ color: '#38bdf8', fontSize: '1.8rem', fontWeight: '800' }}>45+</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Industry Partners</p>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// PAGE 3: COURSES CATALOG PAGE
// -------------------------------------------------------------
const CoursesPage = ({ navigateTo }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: '#f8fafc' }}>Academic Courses</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Click "View Details" to test dynamic route parameters.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {COURSES_DATA.map((course) => (
          <div key={course.id} style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', background: '#334155', color: '#38bdf8', padding: '4px 8px', borderRadius: '4px', fontWeight: '700' }}>
                {course.code}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>⏱️ {course.duration}</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>{course.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', flexGrow: 1, lineHeight: '1.5' }}>
              {course.description}
            </p>

            <button
              onClick={() => navigateTo(`/courses/${course.id}`)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#38bdf8', color: '#0f172a', fontWeight: '700', border: 'none', cursor: 'pointer' }}
            >
              View Course Details →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// PAGE 4: DYNAMIC COURSE DETAIL PAGE (Demonstrating :id param)
// -------------------------------------------------------------
const CourseDetailPage = ({ courseId, navigateTo }) => {
  const course = COURSES_DATA.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: '#ef4444' }}>Course Not Found!</h2>
        <p style={{ color: '#94a3b8', margin: '16px 0' }}>The requested course ID "{courseId}" does not exist.</p>
        <button onClick={() => navigateTo('/courses')} style={{ padding: '8px 16px', background: '#38bdf8', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          ← Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#1e293b', padding: '32px', borderRadius: '14px', border: '1px solid #334155' }}>
      <button
        onClick={() => navigateTo('/courses')}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' }}
      >
        ← Back to All Courses
      </button>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ background: '#38bdf8', color: '#0f172a', padding: '4px 10px', borderRadius: '4px', fontWeight: '800', fontSize: '0.8rem' }}>
          {course.code}
        </span>
        <span style={{ color: '#a78bfa', fontSize: '0.9rem' }}>Level: {course.level}</span>
      </div>

      <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '14px' }}>{course.title}</h1>
      <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '28px' }}>
        {course.description}
      </p>

      <div style={{ background: '#0f172a', padding: '20px', borderRadius: '10px', marginBottom: '28px' }}>
        <h4 style={{ color: '#38bdf8', marginBottom: '12px' }}>📘 Detailed Syllabus Modules:</h4>
        <ul style={{ paddingLeft: '20px', color: '#94a3b8' }}>
          {course.syllabus.map((topic, i) => (
            <li key={i} style={{ marginBottom: '6px' }}>{topic}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #334155' }}>
        <span style={{ color: '#94a3b8' }}>Instructor: <strong style={{ color: '#fff' }}>{course.instructor}</strong></span>
        <button
          onClick={() => alert(`Enrolled successfully in ${course.title}!`)}
          style={{ padding: '10px 20px', borderRadius: '8px', background: '#10b981', color: '#fff', fontWeight: '700', border: 'none', cursor: 'pointer' }}
        >
          Enroll in Course
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// PAGE 5: CONTACT US PAGE
// -------------------------------------------------------------
const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1e293b', padding: '32px', borderRadius: '14px', border: '1px solid #334155' }}>
      <h2 style={{ fontSize: '1.8rem', color: '#38bdf8', marginBottom: '8px' }}>Contact Department</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>Have queries regarding practical submissions or labs? Reach out.</p>

      {submitted ? (
        <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: '8px', textAlign: 'center', color: '#34d399' }}>
          ✅ Thank you! Your message has been received. Our team will contact you shortly.
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>Your Name</label>
            <input required type="text" placeholder="John Doe" style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>Email Address</label>
            <input required type="email" placeholder="john@example.com" style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>Message</label>
            <textarea required rows="4" placeholder="Your inquiry or feedback..." style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#38bdf8', color: '#0f172a', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PAGE 6: 404 NOT FOUND PAGE
// -------------------------------------------------------------
const NotFoundPage = ({ path, navigateTo }) => {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '5rem', fontWeight: '900', color: '#ef4444' }}>404</div>
      <h2 style={{ fontSize: '1.8rem', margin: '12px 0', color: '#f8fafc' }}>Page Not Found</h2>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
        No matching route found for URL path: <code style={{ color: '#f59e0b', background: '#1e293b', padding: '2px 8px', borderRadius: '4px' }}>{path}</code>
      </p>
      <button onClick={() => navigateTo('/')} style={{ padding: '10px 20px', borderRadius: '6px', background: '#38bdf8', color: '#0f172a', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
        Return to Home Page
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// MAIN SPA ROUTER COMPONENT: Practical4
// -------------------------------------------------------------
export default function Practical4() {
  // Current Route Path State (Client-Side Route Tracker)
  const [currentPath, setCurrentPath] = useState('/');

  // Programmatic Navigation Function (Equivalent to useNavigate() hook in react-router-dom)
  const navigateTo = (path) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic Route Resolver
  const renderCurrentRoute = () => {
    if (currentPath === '/') {
      return <HomePage navigateTo={navigateTo} />;
    }
    if (currentPath === '/about') {
      return <AboutPage />;
    }
    if (currentPath === '/courses') {
      return <CoursesPage navigateTo={navigateTo} />;
    }
    if (currentPath.startsWith('/courses/')) {
      const courseId = currentPath.split('/')[2];
      return <CourseDetailPage courseId={courseId} navigateTo={navigateTo} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }
    return <NotFoundPage path={currentPath} navigateTo={navigateTo} />;
  };

  // NavLink Helper with Active State Styling
  const renderNavLink = (path, label) => {
    const isActive = currentPath === path || (path === '/courses' && currentPath.startsWith('/courses/'));
    return (
      <button
        onClick={() => navigateTo(path)}
        style={{
          background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
          color: isActive ? '#38bdf8' : '#94a3b8',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: isActive ? '700' : '500',
          fontSize: '0.95rem',
          transition: 'all 0.2s'
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', padding: '20px 32px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Banner */}
      <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px', fontSize: '0.9rem' }}>
        🎓 <strong>Practical 4:</strong> Develop a Single Page Application (SPA) using React Router for navigation between multiple pages.
      </div>

      {/* Navigation Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', marginBottom: '32px' }}>
        <div
          onClick={() => navigateTo('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', cursor: 'pointer' }}
        >
          <span>🌐</span>
          <span>CollegePortal SPA</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {renderNavLink('/', 'Home')}
          {renderNavLink('/about', 'About')}
          {renderNavLink('/courses', 'Courses')}
          {renderNavLink('/contact', 'Contact')}
          {renderNavLink('/random-404-test', 'Test 404')}
        </div>
      </nav>

      {/* Dynamic Route Viewport */}
      <main style={{ minHeight: '400px' }}>
        {renderCurrentRoute()}
      </main>

      {/* Footer Info showing Active Route Location */}
      <footer style={{ marginTop: '50px', padding: '20px 0', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        <span>React Router SPA Architecture • Practical 4</span>
        <span>Active Path: <code style={{ color: '#38bdf8' }}>{currentPath}</code></span>
      </footer>
    </div>
  );
}
