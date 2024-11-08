'use server';

import { supabase } from '@/database/supabase/supabaseClient';

export const createMessage = async (payload: IDBMessage) => {
  return await supabase.from('message').insert(payload).select();
};

export const getAllMessages = async () => {
  return await supabase
    .from('branch')
    .select('id, created_at, message (id, content)');
};

export const createBranch = async (
  payload: IDBBranch = { parent_message_id: null }
) => {
  return await supabase.from('branch').insert(payload).select().single();
};
