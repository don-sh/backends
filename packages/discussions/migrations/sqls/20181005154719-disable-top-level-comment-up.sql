ALTER TABLE discussions
  ADD COLUMN IF NOT EXISTS "disableTopLevelComments" BOOLEAN DEFAULT FALSE;