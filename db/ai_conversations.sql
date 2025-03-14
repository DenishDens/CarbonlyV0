-- Create AI conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS ai_conversations_user_id_idx ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS ai_conversations_project_id_idx ON ai_conversations(project_id);

-- Add RLS policies
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own conversations
CREATE POLICY "Users can view their own conversations"
  ON ai_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own conversations
CREATE POLICY "Users can insert their own conversations"
  ON ai_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own conversations
CREATE POLICY "Users can update their own conversations"
  ON ai_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for users to delete their own conversations
CREATE POLICY "Users can delete their own conversations"
  ON ai_conversations
  FOR DELETE
  USING (auth.uid() = user_id);

