import React, { useState, useEffect } from 'react';

// Cambia esta URL por la de tu backend en Render
const API_URL = 'https://crypto-cards-backend-f9y7.onrender.com';

export default function App() {
  const [activeTab, setActiveTab] = useState('cards');
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT (TRC20)');
  const [userName, setUserName] = useState('Usuario');
  const [telegramId, setTelegramId] = useState('123456789');
  
  // Estado de carga para evitar la pantalla en blanco
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    cards: [],
    history: []
  });

  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    let tId = '123456789';
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setUserName(user.first_name);
        tId = user.id;
        setTelegramId(user.id);
      }
    }
    fetchUserData(tId);
  }, []);

  const fetchUserData = async (tId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/user/${tId}`);
      const data = await res.json();
      if (data.success) {
        setUserData(data.user);
      }
    } catch (e) {
      console.log("Error de conexión con el servidor.");
    } finally {
      setLoading(false); // Apaga la pantalla de carga una vez que responde el servidor
    }
  };

  const handleCreateRecharge = async () => {
    if (!rechargeAmount || rechargeAmount <= 0) {
      alert("Por favor ingresa un monto válido.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/recharge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId,
          cardId: selectedCard.id,
          amount: rechargeAmount,
          crypto: selectedCrypto
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveOrder(data);
      }
    } catch (e) {
      alert("Error al conectar con la pasarela de pagos.");
    }
  };

  const handleSimulatePayment = async () => {
    if (!activeOrder) return;
    try {
      const res = await fetch(`${API_URL}/api/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: activeOrder.orderId })
      });
      const data = await res.json();
      if (data.success) {
        alert("¡Pago simulado con éxito! Revisa tu chat de Telegram.");
        setShowModal(false);
        setActiveOrder(null);
        setRechargeAmount('');
        fetchUserData(telegramId);
      }
    } catch (e) {
      alert("Error al confirmar el pago.");
    }
  };

  const handleBuyCard = async (cardType) => {
    try {
      const res = await fetch(`${API_URL}/api/buy-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, cardType })
      });
      const data = await res.json();
      if (data.success) {
        alert(`¡Tarjeta ${cardType} emitida con éxito! Revisa tu Telegram.`);
        fetchUserData(telegramId);
        setActiveTab('cards');
      }
    } catch (e) {
      alert("Error al emitir la tarjeta.");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Si está cargando los datos del servidor, muestra este diseño en lugar de blanco
  if (loading) {
    return (
      <div style={{ backgroundColor: '#07090e', color: '#38bdf8', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
        <p style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px' }}>Cargando panel seguro...</p>
        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Conectando con base de datos...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#07090e', color: '#f8fafc', minHeight: '100vh', fontFamily: '-apple-system, sans-serif', padding: '20px 16px 96px 16px', maxWidth: '400px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* Header */}
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

      {/* Pestaña Tarjetas */}
      {activeTab === 'cards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>Tus Tarjetas</h2>
            <span style={{ fontSize: '11px', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>{userData.cards.length} Activas</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {userData.cards.map(card => (
              <div key={card.id} style={{ background: card.gradient, borderRadius: '20px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.6)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '15px', color: '#ffffff', letterSpacing: '1.5px' }}>{card.type}</span>
                  <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: '600' }}>{card.status}</span>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 4px 0' }}>Saldo Disponible</p>
                  <h3 style={{ fontSize: '26px', fontWeight: '800', margin: 0, color: '#ffffff' }}>${Number(card.balance).toFixed(2)} <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>USD</span></h3>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#e2e8f0', margin: '0 0 2px 0', letterSpacing: '1.5px' }}>{card.card_number || card.number}</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Exp: {card.expiry}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedCard(card); setActiveOrder(null); setShowModal(true); }}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#ffffff', padding: '8px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                    ⚡ Recargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pestaña Adquirir */}
      {activeTab === 'market' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0', color: '#ffffff' }}>Adquirir Nueva Tarjeta</h2>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Emisión instantánea vinculada a tu cuenta.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' }}>Visa Standard</span>
                <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '3px 0 2px 0', color: '#ffffff' }}>Suscripciones y Web</h4>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Emisión Gratuita</p>
              </div>
              <button onClick={() => handleBuyCard('Visa Standard')} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Obtener</button>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#f87171', fontWeight: '700', textTransform: 'uppercase' }}>Mastercard Black</span>
                <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '3px 0 2px 0', color: '#ffffff' }}>Global y sin límites</h4>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Emisión Gratuita</p>
              </div>
              <button onClick={() => handleBuyCard('Mastercard Black')} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Obtener</button>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña Historial */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0', color: '#ffffff' }}>Historial de Actividad</h2>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Tus transacciones recientes.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {userData.history.map(item => (
              <div key={item.id} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '14px 16px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 2px 0', color: '#f3f4f6' }}>{item.title}</p>
                  <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>{item.description} • {item.date}</p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399' }}>{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Recarga e Interacción Cripto */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', width: '100%', maxWidth: '400px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px 20px 32px 20px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#ffffff' }}>Recargar Tarjeta {selectedCard?.type}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: '#1e293b', border: 'none', color: '#94a3b8', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            </div>

            {!activeOrder ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Red de Pago</label>
                  <select value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value)} style={{ width: '100%', backgroundColor: '#07090e', border: '1px solid #1e293b', color: '#fff', padding: '11px 12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}>
                    <option>USDT (TRC20)</option>
                    <option>USDT (TON)</option>
                    <option>TON (Toncoin)</option>
                    <option>BTC (Bitcoin)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Monto a recargar (USD)</label>
                  <input type="number" placeholder="Ej. 50" value={rechargeAmount} onChange={(e) => setRechargeAmount(e.target.value)} style={{ width: '100%', backgroundColor: '#07090e', border: '1px solid #1e293b', color: '#fff', padding: '11px 12px', borderRadius: '12px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <button onClick={handleCreateRecharge} style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '13px', borderRadius: '14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  Generar Orden de Pago
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#07090e', border: '1px solid #1e293b', padding: '14px', borderRadius: '14px' }}>
                  <p style={{ fontSize: '11px', color: '#38bdf8', marginBottom: '4px' }}>Orden: {activeOrder.orderId}</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 8px 0' }}>Envía exactamente ${activeOrder.amount} USD en {activeOrder.crypto} a:</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111827', padding: '10px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeOrder.address}</span>
                    <button onClick={() => handleCopy(activeOrder.address)} style={{ background: '#1e293b', border: 'none', color: '#fff', fontSize: '10px', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>{copied ? '¡Copiado!' : 'Copiar'}</button>
                  </div>
                </div>

                <button onClick={handleSimulatePayment} style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '13px', borderRadius: '14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  Simular Confirmación Blockchain (Acreditar)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navegación Inferior */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(7, 9, 14, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid #1e293b', padding: '10px 0', display: 'flex', justifyContent: 'space-around', maxWidth: '400px', margin: '0 auto', zIndex: 40 }}>
        <button onClick={() => setActiveTab('cards')} style={{ background: 'none', border: 'none', color: activeTab === 'cards' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '600' }}>
          <span style={{ fontSize: '17px' }}>💳</span><span>Tarjetas</span>
        </button>
        <button onClick={() => setActiveTab('market')} style={{ background: 'none', border: 'none', color: activeTab === 'market' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '600' }}>
          <span style={{ fontSize: '17px' }}>➕</span><span>Adquirir</span>
        </button>
        <button onClick={() => setActiveTab('history')} style={{ background: 'none', border: 'none', color: activeTab === 'history' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '600' }}>
          <span style={{ fontSize: '17px' }}>📋</span><span>Historial</span>
        </button>
      </nav>

    </div>
  );
}