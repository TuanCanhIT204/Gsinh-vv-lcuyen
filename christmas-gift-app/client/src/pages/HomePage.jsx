import React, { useEffect, useMemo, useRef, useState } from "react";
import TreeOverlay from "../components/TreeOverlay";

const API_BASE = "http://localhost:5000";

/** Modal tự viết để khỏi phụ thuộc CardModal (tránh lỗi không hiện) */
function SimpleModal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: "rgba(0,0,0,.55)",
        display: "grid",
        placeItems: "center",
        padding: 18,
      }}
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "min(860px, 94vw)",
          borderRadius: 22,
          padding: 22,
          background: "rgba(8,14,28,.92)",
          border: "1px solid rgba(255,255,255,.14)",
          boxShadow: "0 30px 90px rgba(0,0,0,.55)",
          color: "#fff",
          backdropFilter: "blur(10px)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 14,
            top: 12,
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,.15)",
            background: "rgba(255,255,255,.06)",
            color: "#fff",
            cursor: "pointer",
            fontSize: 18,
          }}
          aria-label="Close"
        >
          ✕
        </button>

        <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>
          {title}
        </div>

        <div style={{ whiteSpace: "pre-line", lineHeight: 1.7, color: "#eaeaea" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openCount, setOpenCount] = useState(0);
  const [showTree, setShowTree] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  const audioRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false); // true khi đã play được

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings`);
        const data = await res.json();
        setSettings(data);
      } catch (e) {
        console.error("Fetch settings error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const crushName = settings?.crushName || "Lcuyen";

  const trollMessages = useMemo(
    () => [
      `Ơ kìa… hộp này không có gì đâu 😳\nNhưng mà em đáng yêu ghê nên anh cho em chọn lại đó 😆🎄`,
      `Ui ui, hộp này cũng trống nữa rồi 😭\nChắc ông già Noel muốn em tìm đúng món quà dành riêng cho mình á 🎅✨\nThử lại lần nữa nhaaa 💖`,
    ],
    []
  );

  const realMessage = useMemo(
    () =>
      `Giáng Sinh đầu tiên của tụi mình…\nAnh không biết nên viết dài hay ngắn, chỉ biết nói thật lòng rằng:\nAnh rất trân trọng những ngày qua bên em.\n\nDù tụi mình mới yêu nhau chưa lâu, nhưng em đã làm cho cuộc sống của anh ấm áp hơn mà không cần cố gắng gì cả.\n\nChúc em một Giáng Sinh nhẹ nhàng, bình yên, và luôn mỉm cười thật nhiều.\nMắt em không phải là môi nên đừng làm đỏ nó. Mắt em đẹp lắm, nên là không được khóc vì bất cứ điều gì nhé.\nMôi em xinh lắm nên luôn phải cười lên nhaa <3\nVà nếu em cho phép… anh mong mùa Giáng Sinh này chỉ là khởi đầu cho nhiều mùa nữa bên em.\n❤️`,
    []
  );

  // thử autoplay khi vào trang
  useEffect(() => {
    const tryAutoPlay = async () => {
      try {
        const a = audioRef.current;
        if (!a) return;
        a.volume = 0.65;
        await a.play();
        setAudioReady(true);
      } catch (e) {
        // bị chặn là bình thường
        setAudioReady(false);
      }
    };
    tryAutoPlay();
  }, []);

  // bật nhạc “cưỡng bức” khi user click lần đầu (vì lúc đó browser cho phép)
  const ensureMusic = async () => {
    try {
      const a = audioRef.current;
      if (!a) return;
      if (audioReady) return;
      a.volume = 0.65;
      await a.play();
      setAudioReady(true);
    } catch (e) {
      // vẫn bị chặn thì thôi
      setAudioReady(false);
    }
  };

  const openGift = async () => {
    // ✅ đảm bảo nhạc sẽ chạy sau click (nếu autoplay bị chặn)
    await ensureMusic();

    setOpenCount((prev) => {
      if (prev >= 3) return prev; // khóa sau khi đủ 3

      const next = prev + 1;

      if (next === 1 || next === 2) {
        setModalTitle(next === 1 ? "Ơ kìa 😳" : "Ui ui 😭");
        setModalText(trollMessages[next - 1]);
        setModalOpen(true);
      }

      if (next === 3) {
        setModalOpen(false);
        setShowTree(true);

        window.setTimeout(() => {
          setShowTree(false);
          setModalTitle(`Gửi ${crushName} 💌`);
          setModalText(realMessage);
          setModalOpen(true);
        }, 6000);
      }

      return next;
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#fff" }}>
        Đang tải...
      </div>
    );
  }

  return (
    <div className="homeRoot">
      {/* Nhạc: file phải ở client/public/music.mp3 */}
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      <div className={`content ${showTree ? "blurred" : ""}`}>
        <h1 className="title">
          Merry Christmas, <span className="name">{crushName}</span> 🎄
        </h1>

        <p className="subtitle">
          Anh có 3 món quà nhỏ tặng em, nhưng chỉ có một cái là thiệt thôi… thử mở xem có chọn trúng không nha 😊
        </p>

        <div className="cuteLine">
          Giáng Sinh này có <b>{crushName}</b> bên cạnh là món quà đặc biệt nhất của anh đó 💞
        </div>

        <div className="giftRow">
          <button className="giftBtn" onClick={openGift} type="button" aria-label="Hộp quà">
            <img className="giftImg pink" src="/hopqua.png" alt="Gift" />
          </button>

          <button className="giftBtn" onClick={openGift} type="button" aria-label="Hộp quà">
            <img className="giftImg green" src="/hopqua.png" alt="Gift" />
          </button>

          <button className="giftBtn" onClick={openGift} type="button" aria-label="Hộp quà">
            <img className="giftImg blue" src="/hopqua.png" alt="Gift" />
          </button>
        </div>

        <div className="countLine">
          Em đã mở {openCount}/3 lần rồi đó 😆
          {!audioReady && <span style={{ opacity: 0.9 }}> &nbsp;•&nbsp; (nhạc sẽ tự bật khi em bấm hộp quà)</span>}
        </div>
      </div>

      {/* Overlay cây thông chỉ hiện ở lần 3 */}
      {showTree && <TreeOverlay />}

      <SimpleModal open={modalOpen} title={modalTitle} onClose={() => setModalOpen(false)}>
        {modalText}
      </SimpleModal>

      <style>{`
        .homeRoot{
          min-height:100vh;
          position:relative;
          overflow:hidden;

          background-image: url("/nen-giang-sinh.png");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-color:#050814;
        }

        /* lớp phủ tối nhẹ, KHÔNG chặn click */
        .homeRoot::before{
          content:"";
          position:absolute; inset:0;
          background: rgba(0,0,0,0.30);
          pointer-events:none;
          z-index: 1;
        }

        .content{
          position:relative;
          z-index:2;
          text-align:center;
          padding: 70px 24px 60px;
          transition: .35s ease;
        }

        .content.blurred{
          filter: blur(2px) brightness(.92);
          opacity: .7;
        }

        .title{
          color:#fff;
          font-size: clamp(44px, 5vw, 72px);
          font-weight: 900;
          margin: 0;
          text-shadow: 0 12px 40px rgba(0,0,0,.45);
        }
        .name{ color:#ffd54f; }

        .subtitle{
          margin-top: 14px;
          color:#e9e9e9;
          font-size:18px;
          line-height:1.6;
        }

        .cuteLine{
          margin: 28px auto 0;
          width: fit-content;
          padding: 14px 22px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          color:#fff;
          border: 1px solid rgba(255,255,255,.12);
          backdrop-filter: blur(6px);
        }

        .giftRow{
          display:flex;
          justify-content:center;
          gap: 34px;
          margin-top: 42px;
          flex-wrap: wrap;
        }

        .giftBtn{
          width: 210px;
          height: 180px;
          border: none;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 26px;
          backdrop-filter: blur(6px);
          box-shadow: 0 20px 60px rgba(0,0,0,.35);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: transform .15s ease, filter .15s ease;
        }
        .giftBtn:hover{ transform: translateY(-3px) scale(1.01); }
        .giftBtn:active{ transform: translateY(0px) scale(.99); }

        .giftImg{
          width: 120px;
          height: 120px;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
          filter: drop-shadow(0 12px 22px rgba(0,0,0,.35));
        }
        .giftImg.pink{
          filter: hue-rotate(0deg) saturate(1.35) brightness(1.1) drop-shadow(0 12px 22px rgba(0,0,0,.35));
        }
        .giftImg.green{
          filter: hue-rotate(110deg) saturate(1.35) brightness(1.05) drop-shadow(0 12px 22px rgba(0,0,0,.35));
        }
        .giftImg.blue{
          filter: hue-rotate(220deg) saturate(1.35) brightness(1.1) drop-shadow(0 12px 22px rgba(0,0,0,.35));
        }

        .countLine{
          margin-top: 22px;
          color:#f0f0f0;
          opacity:.95;
        }
      `}</style>
    </div>
  );
}
