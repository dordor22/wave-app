import type { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_KEY || '';

export interface AuthenticatedRequest extends Request {
  authUser?: { id: string; email?: string | null };
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const auth = req.header('authorization') || req.header('Authorization');
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });

    req.authUser = { id: data.user.id, email: data.user.email };
    next();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('requireAuth error', e);
    res.status(401).json({ error: 'Unauthorized' });
  }
}


