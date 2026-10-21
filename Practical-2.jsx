import React, { useState } from 'react';

/**
 * ============================================================================
 * PRACTICAL 2: Develop a React application implementing Props,
 *              State Management and Event Handling.
 * ============================================================================
 * Concepts Demonstrated:
 *  1. Props (Unidirectional data flow, passing data & callback functions)
 *  2. State Management (useState Hook for counter, items, themes, inputs)
 *  3. Event Handling (onClick, onChange, onSubmit, synthetic event object)
 *  4. Conditional Rendering & Dynamic List Updates
 * ============================================================================
 */

// -------------------------------------------------------------
// CHILD COMPONENT 1: CounterController (Demonstrating Props & Callbacks)
// -------------------------------------------------------------
const CounterController = ({
  count,
  step,
  onIncrement,
  onDecrement,
  onReset,
  onStepChange
}) => {
  return (
    <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ color: '#38bdf8', marginBottom: '12px', fontSize: '1.2rem' }}>
        🔢 Counter (Props & Callback Demo)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
        Receives current count and handler functions via Props from parent.
      </p>

      {/* Large Counter Number Display */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <span style={{ fontSize: '3.5rem', fontWeight: '800', color: '#a78bfa' }}>{count}</span>
      </div>

      {/* Step Selection - Demonstrates onChange Event */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Step Value:</label>
        <select
          value={step}
          onChange={(e) => onStepChange(Number(e.target.value))}
          style={{ padding: '6px 12px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569', cursor: 'pointer' }}
        >
          <option value={1}>Step +1</option>
          <option value={5}>Step +5</option>
          <option value={10}>Step +10</option>
        </select>
      </div>

      {/* Button Controls - Demonstrates onClick Event */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={onDecrement}
          style={{ padding: '10px 18px', borderRadius: '6px', background: '#334155', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}
        >
          - Decrement ({step})
        </button>
        <button
          onClick={onIncrement}
          style={{ padding: '10px 18px', borderRadius: '6px', background: '#8b5cf6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}
        >
          + Increment ({step})
        </button>
        <button
          onClick={onReset}
          style={{ padding: '10px 18px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// CHILD COMPONENT 2: ItemManager (Demonstrating Form Events & State)
// -------------------------------------------------------------
const ItemManager = ({ items, onAddItem, onToggleComplete, onDeleteItem, onClearAll }) => {
  const [inputText, setInputText] = useState('');
  const [category, setCategory] = useState('Study');

  // Demonstrates onSubmit Event & e.preventDefault()
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddItem(inputText.trim(), category);
    setInputText('');
  };

  return (
    <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ color: '#38bdf8', marginBottom: '12px', fontSize: '1.2rem' }}>
        📝 Interactive Task List (Event Handling)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
        Demonstrates form submission, input change binding, and state mutation.
      </p>

      {/* Form Submission */}
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a task or topic..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', background: '#0f172a', border: '1px solid #475569', color: '#fff', outline: 'none' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569' }}
        >
          <option value="Study">Study 📚</option>
          <option value="Lab">Lab 🧪</option>
          <option value="Project">Project 💻</option>
        </select>
        <button
          type="submit"
          style={{ padding: '10px 18px', borderRadius: '6px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}
        >
          Add
        </button>
      </form>

      {/* Dynamic List Rendering */}
      <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>No tasks found. Add a task above!</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => onToggleComplete(item.id)}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <span style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#64748b' : '#f8fafc' }}>
                    {item.text}
                  </span>
                  <span style={{ fontSize: '0.75rem', background: '#334155', padding: '2px 8px', borderRadius: '4px', color: '#94a3b8' }}>
                    {item.category}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #334155' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Completed: {items.filter((i) => i.completed).length} / {items.length}
          </span>
          <button
            onClick={onClearAll}
            style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// MAIN PARENT COMPONENT: Practical2
// -------------------------------------------------------------
export default function Practical2() {
  // 1. Counter State
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  // 2. Task List State
  const [items, setItems] = useState([
    { id: 1, text: 'Study React Props & State Lifecycle', completed: true, category: 'Study' },
    { id: 2, text: 'Implement Event Handlers (onClick, onChange)', completed: false, category: 'Lab' },
    { id: 3, text: 'Verify Unidirectional Data Flow', completed: false, category: 'Project' }
  ]);

  // 3. Event Log State for Live Inspection
  const [eventLog, setEventLog] = useState('Component initialized. Ready for events.');

  // Counter Handlers (Passed as Props to Child)
  const handleIncrement = () => {
    setCount((prev) => prev + step);
    setEventLog(`[onClick] Counter incremented by +${step} (New: ${count + step})`);
  };

  const handleDecrement = () => {
    setCount((prev) => prev - step);
    setEventLog(`[onClick] Counter decremented by -${step} (New: ${count - step})`);
  };

  const handleReset = () => {
    setCount(0);
    setEventLog('[onClick] Counter reset to 0');
  };

  // Task List Handlers (Passed as Props to Child)
  const handleAddItem = (text, category) => {
    const newItem = { id: Date.now(), text, completed: false, category };
    setItems((prev) => [newItem, ...prev]);
    setEventLog(`[onSubmit] Added new item: "${text}" [${category}]`);
  };

  const handleToggleComplete = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
    setEventLog(`[onChange] Toggled task status for item id ${id}`);
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setEventLog(`[onClick] Removed task item id ${id}`);
  };

  const handleClearAll = () => {
    setItems([]);
    setEventLog('[onClick] Cleared all tasks');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', padding: '24px 40px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Banner */}
      <div style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.4)', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px', fontSize: '0.9rem' }}>
        🎓 <strong>Practical 2:</strong> Develop a React application implementing Props, State Management and Event Handling.
      </div>

      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Props, State & Event Handling
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '6px' }}>
          Demonstrates state lifting, child-parent callback communication, and event listeners.
        </p>
      </header>

      {/* Grid Layout for the 2 Components */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '30px' }}>
        {/* Child 1: Counter Controller with Props */}
        <CounterController
          count={count}
          step={step}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onReset={handleReset}
          onStepChange={(newStep) => {
            setStep(newStep);
            setEventLog(`[onChange] Step updated to ${newStep}`);
          }}
        />

        {/* Child 2: Item Manager with Form Events */}
        <ItemManager
          items={items}
          onAddItem={handleAddItem}
          onToggleComplete={handleToggleComplete}
          onDeleteItem={handleDeleteItem}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Live Event Stream Box */}
      <div style={{ background: '#151d30', border: '1px solid #22304d', borderRadius: '10px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <strong style={{ color: '#38bdf8', fontSize: '0.9rem' }}>📡 Live Event Dispatcher Log:</strong>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>React SyntheticEvent</span>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#a78bfa', background: '#0b0f19', padding: '10px 14px', borderRadius: '6px', border: '1px solid #1e293b' }}>
          &gt; {eventLog}
        </div>
      </div>
    </div>
  );
}
