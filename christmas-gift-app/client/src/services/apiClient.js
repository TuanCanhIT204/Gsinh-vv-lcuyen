// Dùng proxy, nên không cần base URL nữa

export async function getSettings() {
  const res = await fetch('/api/settings');
  if (!res.ok) {
    throw new Error('Failed to fetch settings');
  }
  return res.json();
}

export async function sendReply(message) {
  const res = await fetch('/api/replies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });

  if (!res.ok) {
    throw new Error('Failed to send reply');
  }

  return res.json();
}
