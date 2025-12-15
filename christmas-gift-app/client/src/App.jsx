import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import { getSettings, sendReply } from './services/apiClient.js';

function App() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
        setError('Không tải được dữ liệu từ server 😢');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSendReply = async (message) => {
    try {
      await sendReply(message);
      alert('Anh đã nhận được lời nhắn của em rồi 💌');
    } catch (err) {
      console.error(err);
      alert('Gửi lời nhắn lỗi, thử lại sau nhé 😢');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Đang chuẩn bị quà Giáng Sinh cho em… 🎁</p>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="loading-screen">
        <p>{error || 'Có lỗi xảy ra.'}</p>
      </div>
    );
  }

  return <HomePage settings={settings} onSendReply={handleSendReply} />;
}

export default App;
