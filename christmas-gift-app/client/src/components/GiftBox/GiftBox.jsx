import './GiftBox.css';

function GiftBox({ color = 'red', onOpen, big = false }) {
  return (
    <button
      type="button"
      className={`gift-box gift-${color} ${big ? 'gift-big' : ''}`}
      onClick={onOpen}
    />
  );
}

export default GiftBox;
