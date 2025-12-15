function LoveCounter({ yourName, crushName }) {
  return (
    <div className="love-counter">
      <p>
        Giáng Sinh này có <span className="love-name">{crushName}</span> bên cạnh
        là món quà đặc biệt nhất của {yourName} đó 💝
      </p>
    </div>
  );
}

export default LoveCounter;
