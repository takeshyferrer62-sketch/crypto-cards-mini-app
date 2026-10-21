import React, { useState, useEffect } from 'react';

// URL base del backend en Render (SIN barra al final para evitar dobles barras en fetch)
const API_URL = 'https://crypto-cards-backend-f9y7.onrender.com';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Usuario');
  const [telegramId, setTelegramId] = useState('123456789');
  
  const [userData, setUserData] = useState({ cards: [], history: [] });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [amount, setAmount] = useState('Visa Standard');
  const [merchantName, setMerchantName] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT (TRC20)');
  const [copied, setCopied] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [secureCardData, setSecureCardData] = useState(null);
  const [exchangeResult, setExchangeResult] = useState(null);

  useEffect(() => {
    let tId = '';
    let uName = '';

    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      if (user && user.id) {
        tId = user.id.toString();
        uName = user.first_name || user.username || 'Usuario';
      }
    }

    if (!tId) {
      let savedId = localStorage.getItem('apex_web_user_id');
      if (!savedId) {
        savedId = 'WEB-' + Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('apex_web_user_id', savedId);
      }
      tId = savedId;
      uName = 'Usuario Web';
    }

    setUserName(uName);
    setTelegramId(tId);
    fetchUserData(tId);
  }, []);

  const fetchUserData = async (tId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/user/${tId}`);
      const data = await res.json();
      if (data.success && data.user) {
        setUserData(data.user);
        if (data.user.cards && data.user.cards.length > 0) {
          setSelectedCard(data.user.cards[0]);
        }
      }
    } catch (e) {
      console.log("Error al sincronizar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAction = (type, card = null) => {
    setModalType(type);
    setActiveOrder(null);
    setAmount(type === 'issue' ? 'Visa Standard' : '');
    setMerchantName('');
    setPinInput('');
    setSecureCardData(null);
    setExchangeResult(null);
    if (card) setSelectedCard(card);
    setShowModal(true);
  };

  const handleExecuteAction = async () => {
    if (modalType === 'deposit') {
      if (!amount || amount <= 0) {
        alert("Ingresa un monto válido");
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/recharge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId,
            cardId: selectedCard ? selectedCard.id : userData.cards[0]?.id,
            amount,
            crypto: selectedCrypto
          })
        });
        const data = await res.json();
        if (data.success) setActiveOrder(data);
      } catch (e) {
        alert("Error al conectar con la pasarela.");
      }
    } else if (modalType === 'pay-web') {
      if (!amount || amount <= 0 || !merchantName) {
        alert("Ingresa el comercio y un monto válido");
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/request-charge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId,
            cardId: selectedCard.id,
            merchant: merchantName,
            amount,
            crypto: selectedCrypto
          })
        });
        const data = await res.json();
        if (data.success) setActiveOrder(data);
      } catch (e) {
        alert("Error al solicitar el pago web.");
      }
    } else if (modalType === 'issue') {
      try {
        const cardTypeToIssue = amount || 'Visa Standard';
        const res = await fetch(`${API_URL}/api/buy-card`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId, cardType: cardTypeToIssue })
        });
        const data = await res.json();
        if (data.success) {
          alert("¡Tarjeta emitida con éxito!");
          setShowModal(false);
          fetchUserData(telegramId);
        } else {
          alert(data.error || "Error al emitir tarjeta.");
        }
      } catch (e) {
        alert("Error de red al emitir tarjeta.");
      }
    } else if (modalType === 'card-details') {
      try {
        const res = await fetch(`${API_URL}/api/card-details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId, cardId: selectedCard.id, pin: pinInput })
        });
        const data = await res.json();
        if (data.success) {
          setSecureCardData(data);
        } else {
          alert(data.error || 'PIN incorrecto');
        }
      } catch (e) {
        alert("Error al verificar PIN de seguridad.");
      }
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
        alert("¡Operación completada con éxito!");
        setShowModal(false);
        setActiveOrder(null);
        fetchUserData(telegramId);
      }
    } catch (e) {
      alert("Error al confirmar.");
    }
  };

  const handleCalculateExchange = async () => {
    const amt = document.getElementById('exchange-amount')?.value;
    const from = document.getElementById('exchange-from')?.value;
    const to = document.getElementById('exchange-to')?.value;

    if (!amt || amt <= 0) {
      alert("Introduce una cantidad válida");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/exchange-rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromCurrency: from, toCurrency: to, amount: amt })
      });
      const data = await res.json();
      if (data.success) setExchangeResult(data);
    } catch (e) {
      alert("Error de conexión con el servidor de divisas");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#05070a', color: '#eab308', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>👑</div>
        <p style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '1px' }}>Apex Finance</p>
        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Sincronizando cuenta...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#05070a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', margin: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ backgroundColor: '#090b0e', color: '#f8fafc', width: '100%', maxWidth: '414px', height: '100vh', maxHeight: '892px', border: '1px solid #1f2937', borderRadius: '36px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', overflowY: 'auto', position: 'relative', boxSizing: 'border-box', padding: '20px 16px 90px 16px', scrollbarWidth: 'none' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#000', fontSize: '15px' }}>A</div>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>Apex Finance</span>
          </div>
          <div style={{ background: '#131720', border: '1px solid rgba(234, 179, 8, 0.25)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>🔔</span>
          </div>
        </div>

        {/* User Info */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0', color: '#ffffff' }}>Hola, {userName}</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '5px 12px', borderRadius: '20px' }}>
            <span style={{ fontSize: '11px', color: '#eab308', fontWeight: '700' }}>ID: {telegramId}</span>
          </div>
        </div>

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <>
            {userData.cards.length === 0 ? (
              <div style={{ backgroundColor: '#131720', border: '1px dashed #334155', borderRadius: '20px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>No tienes tarjetas activas</p>
                <button onClick={() => handleOpenAction('issue')} style={{ backgroundColor: '#eab308', color: '#000', border: 'none', padding: '10px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
                  Emitir Tarjeta Ahora 💳
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none', marginBottom: '20px' }}>
                {userData.cards.map((card, idx) => (
                  <div key={card.id || idx} style={{ minWidth: '280px', background: card.gradient || 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(234, 179, 8, 0.3)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <span style={{ fontWeight: '900', color: '#fff' }}>APEX</span>
                      <span style={{ fontWeight: '800', color: '#fff' }}>{card.type}</span>
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 16px 0', color: '#ffffff' }}>${Number(card.balance || 0).toFixed(2)} USD</h3>
                    <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#cbd5e1', margin: 0 }}>{card.card_number}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
              <button onClick={() => handleOpenAction('deposit')} style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <span style={{ color: '#eab308', fontSize: '16px' }}>⬇</span><span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '700' }}>Depositar</span>
              </button>
              <button onClick={() => userData.cards.length > 0 ? handleOpenAction('pay-web', userData.cards[0]) : alert('Emite una tarjeta primero')} style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <span style={{ color: '#38bdf8', fontSize: '16px' }}>🛒</span><span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '700' }}>Pagar Web</span>
              </button>
              <button onClick={() => handleOpenAction('exchange')} style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <span style={{ color: '#10b981', fontSize: '16px' }}>⇄</span><span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '700' }}>Cambiar</span>
              </button>
              <button onClick={() => handleOpenAction('issue')} style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <span style={{ color: '#ef4444', fontSize: '16px' }}>💳</span><span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '700' }}>Nueva</span>
              </button>
            </div>

            {/* History */}
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0 0 12px 0' }}>Transacciones</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {userData.history.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '10px 0' }}>Sin transacciones.</p>
                ) : (
                  userData.history.map(item => (
                    <div key={item.id} style={{ background: '#131720', border: '1px solid #1f2937', padding: '12px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 2px 0', color: '#f3f4f6' }}>{item.title}</p>
                        <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>{item.description}</p>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: item.amount.startsWith('+') ? '#34d399' : '#f87171' }}>{item.amount}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* CARDS VIEW */}
        {activeTab === 'cards' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>Mis Tarjetas</h2>
              <button onClick={() => handleOpenAction('issue')} style={{ backgroundColor: '#eab308', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>+ Emitir</button>
            </div>
            {userData.cards.map(card => (
              <div key={card.id} style={{ background: card.gradient, borderRadius: '20px', padding: '20px', marginBottom: '14px' }}>
                <p style={{ fontWeight: '800', color: '#fff', margin: '0 0 10px 0' }}>{card.type}</p>
                <h3 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff' }}>${Number(card.balance).toFixed(2)} USD</h3>
                <p style={{ fontSize: '12px', fontFamily: 'monospace', margin: '0 0 12px 0', color: '#cbd5e1' }}>{card.card_number}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenAction('pay-web', card)} style={{ background: '#38bdf8', border: 'none', color: '#000', padding: '8px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', flex: 1 }}>🛒 Pagar Web</button>
                  <button onClick={() => handleOpenAction('card-details', card)} style={{ background: '#eab308', border: 'none', color: '#000', padding: '8px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', flex: 1 }}>Ver Datos 🔒</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CRYPTO VIEW */}
        {activeTab === 'crypto' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>Redes Cripto</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
              <div style={{ background: '#131720', border: '1px solid #1f2937', padding: '14px', borderRadius: '14px', fontSize: '12px', color: '#fff' }}>🟢 USDT (TRC20)</div>
              <div style={{ background: '#131720', border: '1px solid #1f2937', padding: '14px', borderRadius: '14px', fontSize: '12px', color: '#fff' }}>🔵 TON (The Open Network)</div>
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>Ajustes</h2>
            <div style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '16px' }}>
              <p style={{ fontSize: '12px', color: '#eab308', fontWeight: '700', margin: '0 0 4px 0' }}>{userName}</p>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, fontFamily: 'monospace' }}>Telegram ID: {telegramId}</p>
            </div>
          </div>
        )}

        {/* MODAL SYSTEM */}
        {showModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50, borderRadius: '36px' }}>
            <div style={{ backgroundColor: '#0f172a', width: '100%', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px 20px 36px 20px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#fff', textTransform: 'capitalize' }}>{modalType}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: '#1e293b', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
              </div>

              {modalType === 'issue' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <select value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', outline: 'none' }}>
                    <option value="Visa Standard">Visa Standard</option>
                    <option value="Mastercard Black">Mastercard Black</option>
                  </select>
                  <button onClick={handleExecuteAction} style={{ width: '100%', backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' }}>Emitir Tarjeta</button>
                </div>
              )}

              {modalType === 'pay-web' && !activeOrder && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input type="text" placeholder="Comercio (ej. Netflix)" value={merchantName} onChange={(e) => setMerchantName(e.target.value)} style={{ width: '100%', backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', outline: 'none', boxSizing: 'border-box' }} />
                  <input type="number" placeholder="Monto (USD)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', outline: 'none', boxSizing: 'border-box' }} />
                  <button onClick={handleExecuteAction} style={{ width: '100%', backgroundColor: '#38bdf8', color: '#000', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' }}>Generar Autorización</button>
                </div>
              )}

              {modalType === 'pay-web' && activeOrder && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#38bdf8' }}>Envía ${activeOrder.amount} en USDT a:</p>
                  <p style={{ fontSize: '11px', fontFamily: 'monospace', background: '#090b0e', padding: '10px', borderRadius: '8px', color: '#fff' }}>{activeOrder.address}</p>
                  <button onClick={handleSimulatePayment} style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>Simular Pago</button>
                </div>
              )}

              {modalType === 'deposit' && !activeOrder && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input type="number" placeholder="Monto (USD)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', outline: 'none', boxSizing: 'border-box' }} />
                  <button onClick={handleExecuteAction} style={{ width: '100%', backgroundColor: '#eab308', color: '#000', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' }}>Generar Recarga</button>
                </div>
              )}

              {modalType === 'deposit' && activeOrder && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', fontFamily: 'monospace', background: '#090b0e', padding: '10px', borderRadius: '8px', color: '#fff' }}>{activeOrder.address}</p>
                  <button onClick={handleSimulatePayment} style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>Simular Pago y Acreditar</button>
                </div>
              )}

              {modalType === 'exchange' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" placeholder="0.00" id="exchange-amount" style={{ flex: 2, backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', outline: 'none', boxSizing: 'border-box' }} />
                    <select id="exchange-from" style={{ flex: 1, backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', outline: 'none' }}>
                      <option value="USDT">USDT</option>
                      <option value="RUB">RUB</option>
                      <option value="TON">TON</option>
                      <option value="BTC">BTC</option>
                    </select>
                  </div>
                  <select id="exchange-to" style={{ width: '100%', backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', outline: 'none' }}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                    <option value="CUP">CUP</option>
                  </select>
                  {exchangeResult && <p style={{ color: '#10b981', textAlign: 'center', fontWeight: 'bold' }}>{exchangeResult.inputAmount} {exchangeResult.from} = {exchangeResult.result} {exchangeResult.to}</p>}
                  <button onClick={handleCalculateExchange} style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' }}>Calcular Tasa</button>
                </div>
              )}

              {modalType === 'card-details' && !secureCardData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input type="password" placeholder="PIN (1234)" maxLength="4" value={pinInput} onChange={(e) => setPinInput(e.target.value)} style={{ width: '100%', backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box' }} />
                  <button onClick={handleExecuteAction} style={{ width: '100%', backgroundColor: '#eab308', color: '#000', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' }}>Ver Datos 🔓</button>
                </div>
              )}

              {modalType === 'card-details' && secureCardData && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '15px', fontFamily: 'monospace', color: '#fff', margin: '8px 0' }}>{secureCardData.cardNumber}</p>
                  <p style={{ fontSize: '12px', color: '#cbd5e1' }}>Exp: {secureCardData.expiry} • CVV: <b style={{ color: '#eab308' }}>{secureCardData.cvv}</b></p>
                  <button onClick={() => setShowModal(false)} style={{ width: '100%', backgroundColor: '#334155', color: '#fff', border: 'none', padding: '12px', borderRadius: '14px', marginTop: '10px', cursor: 'pointer' }}>Cerrar</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#090b0e', borderTop: '1px solid #1f2937', padding: '12px 0 20px 0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderBottomLeftRadius: '36px', borderBottomRightRadius: '36px', zIndex: 40 }}>
          <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '700' }}>
            <span>🏠</span><span>Inicio</span>
          </button>
          <button onClick={() => setActiveTab('cards')} style={{ background: 'none', border: 'none', color: activeTab === 'cards' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '700' }}>
            <span>💳</span><span>Tarjetas</span>
          </button>
          <button onClick={() => setActiveTab('crypto')} style={{ background: 'none', border: 'none', color: activeTab === 'crypto' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '700' }}>
            <span>⚡</span><span>Cripto</span>
          </button>
          <button onClick={() => setActiveTab('settings')} style={{ background: 'none', border: 'none', color: activeTab === 'settings' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '700' }}>
            <span>⚙️</span><span>Ajustes</span>
          </button>
        </nav>

      </div>
    </div>
  );
}