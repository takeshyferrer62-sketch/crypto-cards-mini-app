import React, { useState, useEffect } from 'react';

const API_URL = 'https://crypto-cards-bot.onrender.com';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Takes_5');
  const [telegramId, setTelegramId] = useState('7227146153');
  
  const [userData, setUserData] = useState({
    cards: [
      { id: 1, type: 'VISA', number: '•••• 9726', balance: -0.25, expiry: '04/26', status: 'Activa', gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
      { id: 2, type: 'MASTERCARD', number: '•••• 4412', balance: 145.50, expiry: '12/27', status: 'Activa', gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }
    ],
    history: [
      { id: 1, title: 'Пополнение USDT', description: 'TRC20 • Успешно', amount: '+$50.00', date: 'Только что' },
      { id: 2, title: 'Оплата подписки', description: 'ChatGPT Plus', amount: '-$20.00', date: 'Вчера' }
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
        setUserName(user.first_name || 'Takes_5');
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
        alert("Введите корректную сумму");
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
        alert("Ошибка подключения к шлюзу.");
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
      alert(`Действие "${modalType}" выполнено.`);
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
      <div style={{ backgroundColor: '#f8fafc', color: '#1e293b', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>💳</div>
        <p style={{ fontSize: '14px', fontWeight: '600' }}>Загрузка кошелька...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f1f5f9', color: '#0f172a', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '16px 16px 110px 16px', boxSizing: 'border-box', position: 'relative', width: '100vw', overflowX: 'hidden' }}>
      
      {/* 1. Header Superior: Perfil + Botón Regalo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#cbd5e1', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#475569' }}>
            {userName.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{userName}</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>›</span>
            </div>
          </div>
        </div>
        <button style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0284c7', fontSize: '16px' }}>
          🎁
        </button>
      </div>

      {/* 2. Historias / Accesos Rápidos Superiores (Estilo Burbujas) */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', marginBottom: '16px' }}>
        <div style={{ minWidth: '95px', height: '95px', background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)', borderRadius: '20px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', boxSizing: 'border-box', flexShrink: 0, border: '2px solid #818cf8', cursor: 'pointer' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', lineHeight: '1.2' }}>О карте для подписок</span>
          <span style={{ fontSize: '14px' }}>🤖</span>
        </div>
        <div style={{ minWidth: '95px', height: '95px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '20px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', boxSizing: 'border-box', flexShrink: 0, border: '2px solid #334155', cursor: 'pointer' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', lineHeight: '1.2' }}>Как пополнить карту по СБП</span>
          <span style={{ fontSize: '14px' }}>⚡</span>
        </div>
      </div>

      {/* VISTA HOME / PRINCIPAL */}
      {activeTab === 'home' && (
        <>
          {/* 3. Tarjeta de Saldo Principal Grande + Botón Desplegable Lateral */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '24px', padding: '24px 20px', color: '#fff', position: 'relative', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', marginBottom: '24px' }}>
                <span>🎮</span> Для подписок
              </div>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
                  ${Number(userData.cards[0]?.balance || -0.25).toFixed(2)}
                </h2>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0', fontFamily: 'monospace' }}>
                  {userData.cards[0]?.number || '•••• 9726'}
                </p>
              </div>
              <div style={{ position: 'absolute', top: '20px', right: '20px', width: '28px', height: '28px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                ›
              </div>
            </div>

            {/* Botón Lateral Plus */}
            <button onClick={() => handleOpenAction('issue')} style={{ width: '64px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#0284c7', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              +
            </button>
          </div>

          {/* 4. Banner Publicitario / Informativo Central */}
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '20px', padding: '16px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0' }}>Выбирайте удобную платформу</h4>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Плати по всему миру там, где удобно</p>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              💬
            </div>
          </div>

          {/* 5. Botón Gigante Principal de Recarga ("Пополнить") */}
          <button onClick={() => handleOpenAction('deposit')} style={{ width: '100%', backgroundColor: '#070f1e', color: '#fff', border: 'none', borderRadius: '22px', padding: '16px', fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(7, 15, 30, 0.3)' }}>
            <span style={{ fontSize: '18px' }}>⚡</span> Пополнить
          </button>
        </>
      )}

      {/* VISTA HISTORIA / TRANSACTIONS */}
      {activeTab === 'history' && (
        <div style={{ width: '100%' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>История транзакций</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {userData.history.map(item => (
              <div key={item.id} style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 2px 0', color: '#0f172a' }}>{item.title}</p>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{item.description} • {item.date}</p>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: item.amount.startsWith('+') ? '#10b981' : '#ef4444' }}>{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA SOPORTE / ОТДЕЛ ЗАБОТЫ */}
      {activeTab === 'support' && (
        <div style={{ textAlign: 'center', padding: '40px 10px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Отдел Заботы</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Наша служба поддержки работает 24/7 для решения любых ваших вопросов.</p>
          <a href="https://t.me/" target="_blank" rel="noreferrer" style={{ display: 'inline-block', backgroundColor: '#3b82f6', color: '#fff', padding: '12px 24px', borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>
            Написать в Telegram
          </a>
        </div>
      )}

      {/* VISTA PERFIL / ПРОФИЛЬ */}
      {activeTab === 'profile' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Профиль</h2>
          <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0' }}>Telegram ID</p>
            <p style={{ fontSize: '14px', fontWeight: '700', margin: 0, fontFamily: 'monospace' }}>{telegramId}</p>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0' }}>Статус аккаунта</p>
            <p style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#10b981' }}>Верифицирован ✓</p>
          </div>
        </div>
      )}

      {/* MODAL DE RECARGA / ACCIONES */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '480px', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', padding: '24px 20px 36px 20px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                {modalType === 'deposit' ? 'Пополнение баланса' : 'Новая карта'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', color: '#64748b', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            {modalType === 'deposit' && !activeOrder && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Сеть оплаты</label>
                  <select value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}>
                    <option>USDT (TRC20)</option>
                    <option>USDT (TON)</option>
                    <option>TON (Toncoin)</option>
                    <option>BTC (Bitcoin)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Сумма (USD)</label>
                  <input type="number" placeholder="50" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button onClick={handleExecuteAction} style={{ width: '100%', backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '14px', borderRadius: '16px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                  Создать ордер
                </button>
              </div>
            )}

            {modalType === 'deposit' && activeOrder && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#3b82f6', marginBottom: '4px', fontWeight: '600' }}>Ордер: {activeOrder.orderId}</p>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 10px 0' }}>Отправьте ${activeOrder.amount} ({activeOrder.crypto}) на адрес:</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeOrder.address}</span>
                    <button onClick={() => handleCopy(activeOrder.address)} style={{ background: '#3b82f6', border: 'none', color: '#fff', fontSize: '11px', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>{copied ? '✓' : 'Копировать'}</button>
                  </div>
                </div>
                <button onClick={handleSimulatePayment} style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '16px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                  Подтвердить платеж (Симуляция)
                </button>
              </div>
            )}

            {modalType === 'issue' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Тип карты</label>
                  <select value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}>
                    <option value="Visa Standard">Visa Standard (Для подписок)</option>
                    <option value="Mastercard Black">Mastercard Black (Мировая)</option>
                  </select>
                </div>
                <button onClick={handleExecuteAction} style={{ width: '100%', backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '14px', borderRadius: '16px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                  Выпустить карту
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Barra de Navegación Inferior Flotante en Píldora (Estilo Exacto de la Referencia) */}
      <nav style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '8px 16px', borderRadius: '32px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '92%', maxWidth: '420px', zIndex: 40, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        
        <button onClick={() => setActiveTab('home')} style={{ background: activeTab === 'home' ? '#3b82f6' : 'transparent', border: 'none', color: activeTab === 'home' ? '#fff' : '#64748b', padding: '8px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
          <span style={{ fontSize: '15px' }}>🏠</span>
          {activeTab === 'home' && <span style={{ fontSize: '12px', fontWeight: '700' }}>Главная</span>}
        </button>

        <button onClick={() => setActiveTab('history')} style={{ background: activeTab === 'history' ? '#3b82f6' : 'transparent', border: 'none', color: activeTab === 'history' ? '#fff' : '#64748b', padding: '8px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
          <span style={{ fontSize: '15px' }}>🕒</span>
          {activeTab === 'history' && <span style={{ fontSize: '12px', fontWeight: '700' }}>История</span>}
        </button>

        <button onClick={() => setActiveTab('support')} style={{ background: activeTab === 'support' ? '#3b82f6' : 'transparent', border: 'none', color: activeTab === 'support' ? '#fff' : '#64748b', padding: '8px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
          <span style={{ fontSize: '15px' }}>💬</span>
          {activeTab === 'support' && <span style={{ fontSize: '12px', fontWeight: '700' }}>Забота</span>}
        </button>

        <button onClick={() => setActiveTab('profile')} style={{ background: activeTab === 'profile' ? '#3b82f6' : 'transparent', border: 'none', color: activeTab === 'profile' ? '#fff' : '#64748b', padding: '8px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
          <span style={{ fontSize: '15px' }}>👤</span>
          {activeTab === 'profile' && <span style={{ fontSize: '12px', fontWeight: '700' }}>Профиль</span>}
        </button>

      </nav>

    </div>
  );
}