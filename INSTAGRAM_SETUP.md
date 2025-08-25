# 📱 Instagram API Integration Guide

This guide will help you set up real Instagram API integration to replace the demo data.

## 🔧 Step 1: Create Facebook Developer Account

1. **Go to [Facebook for Developers](https://developers.facebook.com/)**
2. **Click "Get Started"** and log in with your Facebook account
3. **Complete developer registration** (may require phone verification)
4. **Accept Developer Terms**

## 📱 Step 2: Create Instagram Basic Display App

1. **Go to [Facebook App Dashboard](https://developers.facebook.com/apps/)**
2. **Click "Create App"**
3. **Select "Consumer"** as app type
4. **Fill in app details**:
   - App Name: `InstaSave`
   - App Contact Email: `your-email@example.com`
   - Purpose: `Yourself or your own business`

## ⚙️ Step 3: Configure Instagram Basic Display

1. **In your app dashboard, click "Add Product"**
2. **Find "Instagram Basic Display" and click "Set Up"**
3. **Go to Instagram Basic Display → Basic Display**
4. **Click "Create New App"**
5. **Fill in the form**:
   - Display Name: `InstaSave`
   - Valid OAuth Redirect URIs: 
     ```
     http://localhost:3000/auth/callback
     https://your-domain.vercel.app/auth/callback
     ```
   - Deauthorize Callback URL: `https://your-domain.vercel.app/auth/deauthorize`
   - Data Deletion Request URL: `https://your-domain.vercel.app/auth/delete`

## 🔑 Step 4: Get Your Credentials

1. **Go to App Dashboard → Instagram Basic Display → Basic Display**
2. **Copy these credentials**:
   - Instagram App ID
   - Instagram App Secret
   - Client OAuth Settings

## 🌐 Step 5: Set Up Instagram Business Account (Optional)

For Instagram Graph API (more features):
1. **Convert your Instagram account to Business/Creator**
2. **Connect it to a Facebook Page**
3. **Add Instagram Graph API product to your app**

## 📝 Step 6: Add Test Users (Required for Development)

1. **Go to Instagram Basic Display → Basic Display**
2. **Scroll to "User Token Generator"**
3. **Click "Add or Remove Instagram Testers"**
4. **Add Instagram usernames who can test your app**
5. **Test users must accept the invitation in their Instagram app**

## ✅ Step 7: App Review (For Production)

For public use, you'll need to submit for review:
1. **Complete App Review checklist**
2. **Provide app screenshots and demo video**
3. **Explain how you use Instagram data**
4. **Submit for review (can take 1-2 weeks)**

---

## 🔧 Next: Configure Your App

After completing these steps, you'll have:
- ✅ Instagram App ID
- ✅ Instagram App Secret  
- ✅ Test users added
- ✅ OAuth redirect URLs configured

Continue to the next section to add these credentials to your app!
