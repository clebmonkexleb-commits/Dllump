app.post('/api/transfer', async (req, res) => {
  try {
    const { fromUserId, toUsername, amount } = req.body;
    if (!fromUserId || !toUsername || amount === undefined)
      return res.status(400).json({ ok: false, error: 'Missing fields' });

    const amt = Math.floor(Number(amount));
    if (!Number.isFinite(amt) || amt <= 0)
      return res.status(400).json({ ok: false, error: 'Invalid amount' });

    const sender = await getUser(fromUserId);
    if (!sender) return res.status(404).json({ ok: false, error: 'Sender not found' });
    if (sender.banned) return res.status(403).json({ ok: false, error: 'You are banned' });
    if (sender.balance < amt) return res.status(400).json({ ok: false, error: 'Insufficient balance' });

    const clean = String(toUsername).replace(/^@/, '').trim().toLowerCase();
    if (!clean || clean.length < 3) return res.status(400).json({ ok: false, error: 'Invalid username' });

    const all = await getAllUsers();
    const receiver = all.find(u => (u.username || '').toLowerCase() === clean);
    if (!receiver) return res.status(404).json({ ok: false, error: 'User not found' });
    if (String(receiver.id) === String(sender.id))
      return res.status(400).json({ ok: false, error: 'Cannot transfer to yourself' });
    if (receiver.banned) return res.status(400).json({ ok: false, error: 'Receiver is banned' });

    sender.balance -= amt;
    receiver.balance += amt;
    await saveUser(sender);
    await saveUser(receiver);

    res.json({
      ok: true,
      newBalance: sender.balance,
      amount: amt,
      receiver: { username: receiver.username },
    });
  } catch (err) {
    console.error('Transfer error:', err);
    res.status(500).json({ ok: false, error: 'Internal error' });
  }
});
