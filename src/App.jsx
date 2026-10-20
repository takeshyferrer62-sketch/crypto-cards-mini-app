import React, { useState, useEffect } from 'react';

const API_URL = 'https://crypto-cards-bot.onrender.com';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Apex User');
  const [telegramId, setTelegramId] = useState('123456789');
  
  const [userData, setUserData] = useState({
    cards: [
      { id: 1, type: 'VISA', number: '•••• 7024', balance: 12460.75, expiry: '04/26', status: 'Activa', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' },
      { id: 2, type: 'MASTERCARD', number: '•••• 8821', balance: 420.00, expiry: '12/27', status: 'Activa', gradient: 'linear-gradient(135deg, #7f1d1d 0%, #0f172a 100%)' }
    ],
    history: [
      { id: 1, title: 'Depósito Cripto', description: 'USDT • TRC20', amount: '+$5,000', date: 'Justo ahora' },
      { id: 2, title: 'Compra Online', description: 'Amazon', amount: '-$149.50', date: 'Ayer' },
      { id: 3, title: 'Intercambio Cripto', description: 'BTC a USD', amount: '+$1.2 BTC', date: 'Hace 3 días' }
    ]
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT (TRC20)');
  const [copied, setCopied] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    let tId = '123456789';
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setUserName(user.first_name || 'Apex User');
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
      if (data.success && data.user) {
        setUserData(data.user);
        if (data.user.cards && data.user.cards.length > 0) {
          setSelectedCard(data.user.cards[0]);
        }
      }
    } catch (e) {
      console.log("Usando datos locales por defecto.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAction = (type) => {
    setModalType(type);
    setActiveOrder(null);
    setAmount('');
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
            cardId: selectedCard ? selectedCard.id : 1,
            amount,
            crypto: selectedCrypto
          })
        });
        const data = await res.json();
        if (data.success) {
          setActiveOrder(data);
        }
      } catch (e) {
        alert("Error al conectar con la pasarela.");
      }
    } else if (modalType === 'issue') {
      try {
        const res = await fetch(`${API_URL}/api/buy-card`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId, cardType: amount || 'Visa Standard' })
        });
        const data = await res.json();
        if (data.success) {
          alert("¡Tarjeta emitida con éxito!");
          setShowModal(false);
          fetchUserData(telegramId);
        }
      } catch (e) {
        alert("Error al emitir tarjeta.");
      }
    } else {
      alert(`Acción "${modalType}" simulada correctamente.`);
      setShowModal(false);
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
        alert("¡Pago confirmado! Saldo acreditado.");
        setShowModal(false);
        setActiveOrder(null);
        fetchUserData(telegramId);
      }
    } catch (e) {
      alert("Error al confirmar.");
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
        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Cargando entorno seguro...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#05070a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', margin: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Contenedor Principal Estilo Dispositivo Móvil (iOS / Android App Shell) */}
      <div style={{ backgroundColor: '#090b0e', color: '#f8fafc', width: '100%', maxWidth: '414px', height: '100vh', maxHeight: '892px', border: '1px solid #1f2937', borderRadius: '36px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', overflowY: 'auto', position: 'relative', boxSizing: 'border-box', padding: '20px 16px 90px 16px', scrollbarWidth: 'none' }}>
        
        {/* Header Superior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#000', fontSize: '15px' }}>A</div>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px' }}>Apex Finance</span>
          </div>
          <div style={{ background: '#131720', border: '1px solid rgba(234, 179, 8, 0.25)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '15px' }}>🔔</span>
          </div>
        </div>

        {/* Saludo y Verificación */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0', color: '#ffffff' }}>Hola, {userName}</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '5px 12px', borderRadius: '20px' }}>
            <span style={{ fontSize: '11px' }}>🛡️</span>
            <span style={{ fontSize: '11px', color: '#eab308', fontWeight: '700' }}>Verificado por Apex Finance</span>
          </div>
        </div>

        {/* VISTA DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            {/* Tarjetas Carrusel Estilo Lujo */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none', marginBottom: '20px' }}>
              {userData.cards.map((card, idx) => (
                <div key={card.id || idx} style={{ minWidth: '280px', background: card.gradient || 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(234, 179, 8, 0.3)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.6)', boxSizing: 'border-box', flexShrink: 0, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '14px', color: '#fff', letterSpacing: '1px' }}>APEX</span>
                    <span style={{ fontWeight: '800', fontSize: '13px', color: '#fff', fontStyle: 'italic' }}>{card.type}</span>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', margin: '0 0 2px 0' }}>Saldo Disponible</p>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#ffffff' }}>${Number(card.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span style={{ fontSize: '12px', color: '#eab308' }}>USD</span></h3>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#cbd5e1', margin: '0 0 2px 0', letterSpacing: '1px' }}>{card.card_number || card.number}</p>
                      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Exp: {card.expiry} • TITULAR</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 4 Botones de Acción Rápida */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
              <button onClick={() => handleOpenAction('deposit')} style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <div style={{ width: '38px', height: '38px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', fontSize: '16px' }}>⬇</div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#cbd5e1' }}>Depositar</span>
              </button>
              <button onClick={() => handleOpenAction('send')} style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <div style={{ width: '38px', height: '38px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '16px' }}>↗</div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#cbd5e1' }}>Enviar</span>
              </button>
              <button onClick={() => handleOpenAction('exchange')} style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <div style={{ width: '38px', height: '38px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '16px' }}>⇄</div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#cbd5e1' }}>Cambiar</span>
              </button>
              <button onClick={() => handleOpenAction('issue')} style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <div style={{ width: '38px', height: '38px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '16px' }}>💳</div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#cbd5e1', textAlign: 'nowrap' }}>Nueva</span>
              </button>
            </div>

            {/* Transacciones Recientes */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: 0 }}>Transacciones Recientes</h2>
                <span style={{ fontSize: '11px', color: '#eab308', cursor: 'pointer', fontWeight: '600' }}>Ver todo</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {userData.history.map(item => (
                  <div key={item.id} style={{ background: '#131720', border: '1px solid #1f2937', padding: '14px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '34px', height: '34px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontSize: '13px', fontWeight: 'bold' }}>
                        {item.title.includes('Depósito') ? '₮' : '⚡'}
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 2px 0', color: '#f3f4f6' }}>{item.title}</p>
                        <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>{item.description} • {item.date}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: item.amount.startsWith('+') ? '#34d399' : '#f87171' }}>{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* VISTA CARDS */}
        {activeTab === 'cards' && (
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#fff' }}>Gestión de Tarjetas</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {userData.cards.map(card => (
                <div key={card.id} style={{ background: card.gradient, borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontWeight: '800', fontStyle: 'italic', color: '#fff' }}>{card.type}</span>
                    <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '3px 10px', borderRadius: '10px', fontWeight: '700' }}>{card.status}</span>
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 10px 0', color: '#fff' }}>${Number(card.balance).toFixed(2)} USD</h3>
                  <p style={{ fontSize: '12px', fontFamily: 'monospace', margin: '0 0 12px 0', color: '#cbd5e1', letterSpacing: '1px' }}>{card.number}</p>
                  <button onClick={() => { setSelectedCard(card); handleOpenAction('deposit'); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', width: '100%' }}>Recargar Saldo</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA CRYPTO */}
        {activeTab === 'crypto' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🌐</div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px', color: '#fff' }}>Redes Cripto Disponibles</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Conexión activa con pasarelas blockchain instantáneas.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#131720', border: '1px solid #1f2937', padding: '14px', borderRadius: '14px', textAlign: 'left', fontSize: '12px', color: '#fff' }}>🟢 USDT (TRC20) - Rápido y sin comisiones</div>
              <div style={{ background: '#131720', border: '1px solid #1f2937', padding: '14px', borderRadius: '14px', textAlign: 'left', fontSize: '12px', color: '#fff' }}>🔵 TON (The Open Network) - Nativo Telegram</div>
              <div style={{ background: '#131720', border: '1px solid #1f2937', padding: '14px', borderRadius: '14px', textAlign: 'left', fontSize: '12px', color: '#fff' }}>🟠 Bitcoin (BTC) - Alta seguridad</div>
            </div>
          </div>
        )}

        {/* VISTA SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#fff' }}>Configuración</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 4px 0', color: '#fff' }}>Telegram ID</p>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, fontFamily: 'monospace' }}>{telegramId}</p>
              </div>
              <div style={{ background: '#131720', border: '1px solid #1f2937', borderRadius: '16px', padding: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 4px 0', color: '#fff' }}>Seguridad Biométrica</p>
                <p style={{ fontSize: '11px', color: '#34d399', margin: 0 }}>Activada y sincronizada</p>
              </div>
            </div>
          </div>
        )}

        {/* MODAL INTERACTIVO */}
        {showModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50, borderRadius: '36px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', width: '100%', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px 20px 36px 20px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#ffffff', textTransform: 'capitalize' }}>
                  {modalType === 'deposit' ? 'Recargar Saldo' : modalType === 'issue' ? 'Emitir Nueva Tarjeta' : modalType}
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: '#1e293b', border: 'none', color: '#94a3b8', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
              </div>

              {modalType === 'deposit' && !activeOrder && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Red Cripto</label>
                    <select value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value)} style={{ width: '100%', backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}>
                      <option>USDT (TRC20)</option>
                      <option>USDT (TON)</option>
                      <option>TON (Toncoin)</option>
                      <option>BTC (Bitcoin)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Monto (USD)</label>
                    <input type="number" placeholder="Ej. 100" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <button onClick={handleExecuteAction} style={{ width: '100%', backgroundColor: '#eab308', color: '#000', border: 'none', padding: '14px', borderRadius: '14px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
                    Generar Orden Blockchain
                  </button>
                </div>
              )}

              {modalType === 'deposit' && activeOrder && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
                  <div style={{ backgroundColor: '#090b0e', border: '1px solid #1e293b', padding: '14px', borderRadius: '14px' }}>
                    <p style={{ fontSize: '11px', color: '#38bdf8', marginBottom: '4px' }}>Orden ID: {activeOrder.orderId}</p>
                    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 8px 0' }}>Envía ${activeOrder.amount} en {activeOrder.crypto} a:</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#131720', padding: '10px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeOrder.address}</span>
                      <button onClick={() => handleCopy(activeOrder.address)} style={{ background: '#1e293b', border: 'none', color: '#fff', fontSize: '10px', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>{copied ? '¡Copiado!' : 'Copiar'}</button>
                    </div>
                  </div>
                  <button onClick={handleSimulatePayment} style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                    Simular Pago y Acreditar Saldo
                  </button>
                </div>
              )}

              {modalType === 'issue' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Tipo de Tarjeta</label>
                    <select value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', backgroundColor: '#090b0e', border: '1px solid #1e293b', color: '#fff', padding: '12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}>
                      <option value="Visa Standard">Visa Standard (Suscripciones/Web)</option>
                      <option value="Mastercard Black">Mastercard Black (Global)</option>
                    </select>
                  </div>
                  <button onClick={handleExecuteAction} style={{ width: '100%', backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
                    Emitir Tarjeta Virtual
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Barra de Navegación Inferior Flotante Dentro del Marco Móvil */}
        <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#090b0e', borderTop: '1px solid #1f2937', padding: '12px 0 20px 0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderBottomLeftRadius: '36px', borderBottomRightRadius: '36px', zIndex: 40 }}>
          <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '700' }}>
            <span style={{ fontSize: '16px' }}>🏠</span><span>Inicio</span>
          </button>
          <button onClick={() => setActiveTab('cards')} style={{ background: 'none', border: 'none', color: activeTab === 'cards' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '700' }}>
            <span style={{ fontSize: '16px' }}>💳</span><span>Tarjetas</span>
          </button>
          <button onClick={() => setActiveTab('crypto')} style={{ background: 'none', border: 'none', color: activeTab === 'crypto' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '700' }}>
            <span style={{ fontSize: '16px' }}>⚡</span><span>Cripto</span>
          </button>
          <button onClick={() => setActiveTab('settings')} style={{ background: 'none', border: 'none', color: activeTab === 'settings' ? '#eab308' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '10px', gap: '3px', fontWeight: '700' }}>
            <span style={{ fontSize: '16px' }}>⚙️</span><span>Ajustes</span>
          </button>
        </nav>

      </div>
    </div>
  );
}