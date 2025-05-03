import { createClient } from '@/utils/supabase/client';

interface TokenLimitData {
  total_tokens_used: number;
  token_limit: number;
  last_reset_date: string;
}

export const tokenLimitService = {
  async getUserTokenLimit(userId: string): Promise<TokenLimitData | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('user_token_limits')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching token limit:', error);
      if (error.code === 'PGRST116') {
        const { data: newData, error: insertError } = await supabase
          .from('user_token_limits')
          .insert([
            {
              user_id: userId,
              total_tokens_used: 0,
              token_limit: 10000,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating token limit:', insertError);
          return null;
        }

        return newData;
      }
      return null;
    }
    
    return data;
  },
  
  async updateTokenUsage(userId: string, tokensUsed: number): Promise<boolean> {
    const supabase = createClient();
  
    const { error: rpcError } = await supabase.rpc('increment_token_usage', {
        user_id: userId,
        amount: tokensUsed,
    });
  
    if (rpcError) {
      console.error('Error incrementing token usage:', rpcError);
      return false;
    }
  
    const { error: updateError } = await supabase
      .from('user_token_limits')
      .update({ updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  
    if (updateError) {
      console.error('Error updating updated_at timestamp:', updateError);
      return false;
    }
  
    return true;
  },
  
  async checkTokenAvailability(userId: string, requiredTokens: number = 1500): Promise<boolean> {
    const limits = await this.getUserTokenLimit(userId);
    
    if (!limits) {
      console.warn(`Token limit kaydı bulunamadı: ${userId}`);
      return false;
    }
  
    const projectedUsage = limits.total_tokens_used + requiredTokens;
    const isAvailable = projectedUsage <= limits.token_limit;
  
  
    return isAvailable;
  },

  
};