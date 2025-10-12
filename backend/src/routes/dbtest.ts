import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

router.get('/test', async (_req, res) => {
  try {
    const { data, error } = await supabase.from('marine_spots').select('*').limit(5);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ rows: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

export default router;
