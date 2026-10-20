import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('cards');
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT (TRC20)');
  const [userName, setUserName] = useState('Usuario');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      if (tg.initDataUnsafe?.user?.first_name) {
        setUserName(tg.initDataUnsafe.user.first_name);
      }
    }
  }, []);

  const cards = [
    { 
      id: 1, 
      type: 'VISA', 
      number: '4532 •••• •••• 8821', 
      balance: 145.50, 
      expiry: '08/28', 
      status: 'Activa', 
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #1e1b4b 100%)', 
      accentColor: '#60a5fa' 
    },
    { 
      id: 2, 
      type: 'MASTERCARD', 
      number: '5412 •••• •••• 9934', 
      balance: 420.00, 
      expiry: '12/27', 
      status: 'Activa', 
      gradient: 'linear-gradient(135deg, #dc2626 0%, #18181b 100%)', 
      accentColor: '#f87171' 
    }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ 
      backgroundColor: '#07090e', 
      color: '#f8fafc', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
      padding: '20px 16px 96px 16px', 
      maxWidth: '400px', 
      margin: '0 auto', 
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      
      {/* Header Premium */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: '600' }}>Panel Cripto</span>
          <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '2px 0 0 0', color: '#ffffff' }}>{userName}</h1>
        </div>
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '5px 12px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#34d399', borderRadius: '50%', boxShadow: '0 0 8px #34d399' }}></span>
          <span style={{ fontSize: '11px', color: '#34d399', fontWeight: '600' }}>Verificado</span>
        </div>
      </div>

      {/* Contenido por pestañas */}
      {activeTab === 'cards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Tus Tarjetas</h2>
            <span style={{ fontSize: '11px', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', fontWeight: '500' }}>2 Activas</span>
          </div>

          {/* Tarjetas Visuales Proporcionales */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {cards.map(card => (
              <div key={card.id} style={{ 
                background: card.gradient, 
                borderRadius: '20px', 
                padding: '20px', 
                border: '1px solid rgba(255, 255, 255, 0.12)', 
                boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.6)', 
                position: 'relative', 
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}>
                {/* Reflejo estético de fondo */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '15px', letterSpacing: '1.5px', color: '#ffffff' }}>{card.type}</span>
                  <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: '600', border: '1px solid rgba(16, 185, 129, 0.3)' }}>{card.status}</span>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 4px 0', fontWeight: '500' }}>Saldo Disponible</p>
                  <h3 style={{ fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px', color: '#ffffff' }}>
                    ${card.balance.toFixed(2)} <span style={{ fontSize: '13px', fontWeight: '400', color: 'rgba(255,255,255,0.7)' }}>USD</span>
                  </h3>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#e2e8f0', margin: '0 0 2px 0', letterSpacing: '1.5px' }}>{card.number}</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Exp: {card.expiry}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedCard(card); setShowModal(true); }}
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                      border: '1px solid rgba(255, 255, 255, 0.3)', 
                      color: '#ffffff', 
                      padding: '8px 14px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.2s'
                    }}>
                    ⚡ Recargar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Banner de Info Limpio */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '14px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', boxSizing: 'border-box' }}>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', padding: '10px', borderRadius: '12px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔒</div>
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 2px 0', color: '#f3f4f6' }}>Seguridad Garantizada</h4>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0, lineHeight: '1.4' }}>Emisión instantánea y protección total con tecnología blockchain.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'market' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0', color: '#ffffff' }}>Adquirir Nueva Tarjeta</h2>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Selecciona la categoría ideal para tus pagos digitales.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Visa Standard</span>
                <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '3px 0 2px 0', color: '#ffffff' }}>Suscripciones y Web</h4>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Emisión: <strong style={{ color: '#34d399' }}>$5.00 USDT</strong></p>
              </div>
              <button style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Obtener</button>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#f87171', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mastercard Black</span>
                <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '3px 0 2px 0', color: '#ffffff' }}>Límites Globales Altos</h4>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Emisión: <strong style={{ color: '#34d399' }}>$15.00 USDT</strong></p>
              </div>
              <button style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Obtener</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0', color: '#ffffff' }}>Historial Reciente</h2>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Movimientos registrados en la red.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '14px 16px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 2px 0', color: '#f3f4f6' }}>Recarga USDT (TRC20)</p>
                <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>Visa •••• 8821 • Hace 2 horas</p>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399' }}>+$50.00</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Desplegable de Recarga */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50, padding: '0' }}>
          <div style={{ 
            backgroundColor: '#0f172a', 
            borderTop: '1px solid #1e293b', 
            width: '100%', 
            maxWidth: '400px', 
            borderTopLeftRadius: '24px', 
            borderTopRightRadius: '24px', 
            padding: '24px 20px 32px 20px', 
            boxSizing: 'border-box',
            boxShadow: '0 -20px 40px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#ffffff' }}>Recargar Tarjeta {selectedCard?.type}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: '#1e293b', border: 'none', color: '#94a3b8', width: '28px', height: '28px', borderRadius: '50%', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Seleccionar Red de Pago</label>
                <select 
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#07090e', border: '1px solid #1e293b', color: '#fff', padding: '11px 12px', borderRadius: '12px', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}>
                  <option>USDT (TRC20)</option>
                  <option>USDT (TON)</option>
                  <option>TON (Toncoin)</option>
                  <option>BTC (Bitcoin)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Monto a recargar (USD)</label>
                <input 
                  type="number"
                  placeholder="Ej. 50"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#07090e', border: '1px solid #1e293b', color: '#fff', padding: '11px 12px', borderRadius: '12px', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              <div style={{ backgroundColor: '#07090e', border: '1px solid #1e293b', padding: '14px', borderRadius: '14px', textAlign: 'center', boxSizing: 'border-box' }}>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0.7px 0 8px 0' }}>Envía el equivalente exacto en {selectedCrypto.split(' ')[0]} a:</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111827', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>UQDr892...sampleAddressCrypto781</span>
                  <button onClick={() => handleCopy("UQDr892...sampleAddressCrypto781")} style={{ background: '#1e293b', border: 'none', color: '#fff', fontSize: '10px', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    {copied ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <button 
                onClick={() => { alert("Orden de recarga generada con éxito."); setShowModal(false); }}
                style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '13px', borderRadius: '14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '4px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)' }}>
                Confirmar Pago y Recargar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Navegación Inferior Ajustada */}
      <nav style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'rgba(7, 9, 14, 0.95)', 
        backdropFilter: 'blur(10px)', 
        borderTop: '1px solid #1e293b', 
        padding: '10px 0', 
        display: 'flex', 
        justifyContent: 'space-around', 
        maxWidth: '400px', 
        margin: '0 auto', 
        zIndex: 40,
        boxSizing: 'border-box'
      }}>
        <button 
          onClick={() => setActiveTab('cards')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'cards' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '600' }}>
          <span style={{ fontSize: '17px' }}>💳</span>
          <span>Tarjetas</span>
        </button>

        <button 
          onClick={() => setActiveTab('market')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'market' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '600' }}>
          <span style={{ fontSize: '17px' }}>➕</span>
          <span>Adquirir</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'history' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '600' }}>
          <span style={{ fontSize: '17px' }}>📋</span>
          <span>Historial</span>
        </button>
      </nav>

    </div>
  );
}