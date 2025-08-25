# 📱 Instagram API Integration Guide (Updated Dec 2024)

⚠️ **IMPORTANT**: Instagram Basic Display API was deprecated on December 4, 2024. This guide now covers the **Instagram API with Instagram Login** for Business/Creator accounts.

## 🔧 Step 1: Prerequisites

**You need an Instagram Professional account (Business or Creator)**
- If you have a personal account, switch to Professional in Instagram settings
- Connect your Instagram account to a Facebook Page (required for Business accounts)

## 🔧 Step 2: Create Facebook Developer Account

1. **Go to [Facebook for Developers](https://developers.facebook.com/)**
2. **Click "Get Started"** and log in with your Facebook account
3. **Complete developer registration** (may require phone verification)
4. **Accept Developer Terms**

## 📱 Step 3: Create Meta App (Business Type)

1. **Go to [Facebook App Dashboard](https://developers.facebook.com/apps/)**
2. **Click "Create App"**
3. **Select "Business"** as app type (required for Instagram API)
4. **Fill in app details**:
   - App Name: `InstaSave`
   - App Contact Email: `your-email@example.com`
   - Purpose: `Yourself or your own business`

## ⚙️ Step 4: Add Instagram Product

1. **In your app dashboard, click "Add Product"**
2. **Find "Instagram" and click "Set Up"**
3. **Choose "API setup with Instagram login"**
   - Use "with Facebook login" only if you need Facebook Page integration

## 🔑 Step 5: Configure OAuth Settings

**In Instagram → API setup with Instagram login:**

1. **Valid OAuth Redirect URIs** (must match exactly):
   ```
   http://localhost:3000/auth/callback
   https://your-domain.vercel.app/auth/callback
   ```

2. **Deauthorize Callback URL**:
   ```
   https://your-domain.vercel.app/auth/deauthorize
   ```

3. **Data Deletion Request URL**:
   ```
   https://your-domain.vercel.app/auth/delete
   ```

## 🔑 Step 6: Get Your Credentials

1. **Go to Instagram → API setup with Instagram login**
2. **Copy these credentials**:
   - **Instagram App ID**
   - **Instagram App Secret**

## 👥 Step 7: Grant Access for Development

1. **Go to App Roles → Roles**
2. **Add Developers/Testers** (your Instagram account and team members)
3. **Use Professional Instagram accounts** that have roles on the app
4. ⚠️ **Note**: "Instagram Testers" from Basic Display API is deprecated

## 🔐 Step 8: Request Permissions

**For your InstaSave app, you need these scopes:**
- `instagram_graph_user_profile` - Read profile basics
- `instagram_graph_user_media` - Read user's media

These are automatically included in your OAuth flow.

## 🚀 Step 9: App Review (For Production)

**For public use, you need Advanced Access:**
1. **Keep a working test environment**
2. **Provide reviewer instructions and test account**
3. **Submit Instagram product permissions for Advanced Access**
4. **Show clear consent flow and data usage**
5. **Review typically takes 1-2 weeks**

## 🔄 Step 10: Token Management

**Your app will use long-lived tokens (60 days):**
1. **Exchange authorization code** → short-lived token (1 hour)
2. **Exchange short-lived** → long-lived token (60 days)  
3. **Refresh long-lived tokens** before expiry (can refresh after 24h)

## ⚠️ Migration Notice

**If you previously used Instagram Basic Display API:**
- All "Basic Display" references are now deprecated
- Switch to "Instagram API with Instagram Login"  
- Convert Instagram account to Professional (Business/Creator)
- Update scopes to new permission names
- Use Graph API endpoints instead of Basic Display endpoints

---

## 🔧 Next: Configure Your App

After completing these steps, you'll have:
- ✅ Instagram App ID
- ✅ Instagram App Secret  
- ✅ Test users added
- ✅ OAuth redirect URLs configured

Continue to the next section to add these credentials to your app!
