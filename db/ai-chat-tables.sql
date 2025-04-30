-- Create AI chat conversations table
CREATE TABLE IF NOT EXISTS ai_chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI chat messages table
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES ai_chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for ai_chat_conversations
ALTER TABLE ai_chat_conversations ENABLE ROW LEVEL SECURITY;

-- Users can view their own conversations
CREATE POLICY "Users can view their own conversations" 
ON ai_chat_conversations FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own conversations
CREATE POLICY "Users can create their own conversations" 
ON ai_chat_conversations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update their own conversations" 
ON ai_chat_conversations FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own conversations
CREATE POLICY "Users can delete their own conversations" 
ON ai_chat_conversations FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for ai_chat_messages
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations" 
ON ai_chat_messages FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT user_id FROM ai_chat_conversations 
    WHERE id = conversation_id
  )
);

-- Users can create messages in their conversations
CREATE POLICY "Users can create messages in their conversations" 
ON ai_chat_messages FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  auth.uid() IN (
    SELECT user_id FROM ai_chat_conversations 
    WHERE id = conversation_id
  )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_conversation_id 
ON ai_chat_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_ai_chat_conversations_user_id 
ON ai_chat_conversations(user_id);
