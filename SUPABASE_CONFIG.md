# Supabase Email Verification Configuration

## To disable email verification in Supabase:

### 1. In your Supabase Dashboard:
1. Go to **Authentication > Settings**
2. Under **User Signups**, disable **Enable email confirmations**
3. This will allow users to sign up without email verification

### 2. Alternative: Keep email verification but auto-confirm users
If you want to keep the email verification system but auto-confirm users:

1. Go to **Authentication > Settings**
2. Under **User Signups**, enable **Enable email confirmations**
3. In **SMTP Settings**, you can configure a custom SMTP provider
4. Or use Supabase's built-in email service

### 3. Environment Variables (if using custom SMTP):
```env
# Add these to your .env file if using custom SMTP
VITE_SUPABASE_SMTP_HOST=your-smtp-host
VITE_SUPABASE_SMTP_PORT=587
VITE_SUPABASE_SMTP_USER=your-smtp-user
VITE_SUPABASE_SMTP_PASS=your-smtp-password
```

### 4. Database Configuration:
Make sure your notes table has the proper RLS policies:

```sql
-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);
```

### 5. Testing:
- Users can now sign up and immediately access the app
- No email verification required
- Users are automatically authenticated after signup
