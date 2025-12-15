import { useState } from 'react';

function CardModal({ isOpen, onClose, title, text, isRealCard, onSendReply }) {
  const [replyText, setReplyText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(replyText.trim());
    setReplyText('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card ${isRealCard ? 'modal-real' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} type="button">
          ✕
        </button>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-text">{text}</p>

        {isRealCard && (
          <form className="reply-form" onSubmit={handleSubmit}>
            <label className="reply-label">
              Nếu em muốn nhắn lại cho anh, viết ở đây nhé 💌
            </label>
            <textarea
              className="reply-textarea"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              placeholder="Viết vài dòng cho anh nè..."
            />
            <button type="submit" className="reply-button">
              Gửi cho anh
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CardModal;
