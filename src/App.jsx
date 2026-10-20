import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Datos locales de prueba idénticos al diseño de lujo
  const userData = {
    cards: [
      { id: 1, type: 'VISA', number: '4314 7024 5669 9014', balance: 12460.75, expiry: '04/26', status: 'Activa', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' },
      { id: 2, type: 'MASTERCARD', number: '5412 8821 9934 1134', balance: 420.00, expiry: '12/27', status: 'Activa', gradient: 'linear-gradient(135deg, #7f1d1d 0%, #0f172a 100%)' }
    ],
    history: [
      { id: 1, title: 'Crypto Deposit', description: 'USDT • TRC20', amount: '+$5,000', date: 'Justo ahora' },
      { id: 2, title: 'Online Purchase', description: 'Amazon', amount: '-$149.50', date: 'Ayer' },
      { id: 3, title: 'Crypto Exchange', description: 'BTC to USD', amount: '+$1.2 BTC', date: 'Hace 3 días' }
    ]
  };

  return (
    <div style={{ backgroundColor: '#090b0e', color: '#f8fafc', minHeight: '100vh', fontFamily: '-apple-system, sans-serif', padding: '16px 16px 90px 16px', maxWidth: '410px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#000', fontSize: '14px' }}>A</div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.5px' }}>Apex Finance</span>
        </div>
        <div style={{ background: '#131720', border: '1px solid rgba(234, 179, 8, 0.2)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>🔔</span>
        </div>
      </div>

      {/* Saludo */}
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0', color: '#ffffff' }}>Hello, Apex User</h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '4px 10px', borderRadius: '20px' }}>
          <span style={{ fontSize: '11px' }}>🛡️</span>
          <span style={{ fontSize: '11px', color: '#eab308', fontWeight: '600' }}>Apex Finance Verified</span>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Tarjetas */}
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none', marginBottom: '20px' }}>
            {userData.cards.map(card => (
              <div key={card.id} style={{ minWidth: '270px', background: card.gradient, borderRadius: '18px', padding: '18px', border: '1px solid rgba(234, 179, 8, 0.25)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', boxSizing: 'border-box', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '14px', color: '#fff' }}>APEX</span>
                  <span style={{ fontWeight: '800', fontSize: '13px', color: '#fff', fontStyle: 'italic' }}>{card.type}</span>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', margin: '0 0 2px 0' }}>Balance</p>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#ffffff' }}>${card.balance.toLocaleString()} <span style={{ fontSize: '11px', color: '#eab308' }}>USD</span></h3>
                </div>
                <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#cbd5e1', margin: 0 }}>{card.number}</p>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
            {['Deposit', 'Send', 'Exchange', 'New Card'].map((btn, idx) => (
              <button key={idx} onClick={() => { setModalType(btn); setShowModal(true); }} style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308' }}>⚡</div>
                <span style={{ fontSize: '10px', fontWeight: '600', color: '#cbd5e1' }}>{btn}</span>
              </button>
            ))}
          </div>

          {/* Transacciones */}
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>Recent Transactions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userData.history.map(item => (
                <div key={item.id} style={{ background: '#131720', border: '1px solid #1f2937', padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 2px 0', color: '#f3f4f6' }}>{item.title}</p>
                    <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>{item.description} • {item.date}</p>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: item.amount.startsWith('+') ? '#34d399' : '#f87171' }}>{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#0f172a', width: '100%', maxWidth: '410px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px 20px 32px 20px', boxSizing: 'border-box' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>{modalType} Action</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Operación conectada con nodos seguros de Apex Finance.</p>
            <button onClick={() => setShowModal(false)} style={{ width: '100%', backgroundColor: '#eab308', color: '#000', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#090b0e', borderTop: '1px solid #1f2937', padding: '10px 0 16px 0', display: 'flex', justifyContent: 'space-around', maxWidth: '410px', margin: '0 auto', zIndex: 40 }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px' }}><span>🏠</span><span>Dashboard</span></button>
        <button onClick={() => setActiveTab('cards')} style={{ background: 'none', border: 'none', color: activeTab === 'cards' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px' }}><span>💳</span><span>Cards</span></button>
        <button onClick={() => setActiveTab('crypto')} style={{ background: 'none', border: 'none', color: activeTab === 'crypto' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px' }}><span>⚡</span><span>Crypto</span></button>
        <button onClick={() => setActiveTab('settings')} style={{ background: 'none', border: 'none', color: activeTab === 'settings' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px' }}><span>⚙️</span><span>Settings</span></button>
      </nav>

    </div>
  );
}