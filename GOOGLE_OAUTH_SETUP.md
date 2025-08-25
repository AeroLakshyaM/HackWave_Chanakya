# Google OAuth Setup Guide for Appwrite

## 🚨 **Current Issue**
Google OAuth is not working because it's not properly configured in your Appwrite project.

## 🔧 **Step-by-Step Setup**

### 1. **Google Cloud Console Setup**

#### A. Create Google OAuth 2.0 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add these Authorized redirect URIs:
   ```
   https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google
   http://localhost:3000/v1/account/sessions/oauth2/callback/google (for development)
   ```
7. Copy your **Client ID** and **Client Secret**

#### B. Configure OAuth Consent Screen
1. Go to "OAuth consent screen"
2. Set app name: "Chanakya AI"
3. Add your domain
4. Add scopes: `email`, `profile`, `openid`

### 2. **Appwrite Console Setup**

#### A. Enable Google OAuth Provider
1. Go to your [Appwrite Console](https://console.appwrite.io/)
2. Select your project: `68a80079001064c062b6`
3. Go to "Auth" → "OAuth2 Providers"
4. Find "Google" and click "Enable"

#### B. Configure Google Provider
1. **Provider Name**: `google`
2. **Client ID**: Paste your Google Client ID
3. **Client Secret**: Paste your Google Client Secret
4. **Callback URL**: `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google`
5. **Scopes**: `email profile openid`
6. **Save** the configuration

### 3. **Update Your Appwrite Config**

Your current config is correct, but make sure it matches:

```javascript
// src/config/Appwrite.js
import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68a80079001064c062b6");

export const account = new Account(client);
export const database = new Databases(client, "68a80162002e7f4da4d7");
```

### 4. **Test the Setup**

1. **Clear browser cache** and cookies
2. **Restart your development server**
3. **Try Google OAuth** from the login/signup page
4. **Check browser console** for any errors

## 🔍 **Troubleshooting**

### Common Issues:

#### A. **"Provider not found" Error**
- Make sure Google OAuth is enabled in Appwrite console
- Check if provider name is exactly `google`

#### B. **"Invalid redirect URI" Error**
- Verify redirect URIs in Google Cloud Console
- Make sure they match exactly (including protocol)

#### C. **"OAuth service unavailable" Error**
- Check if Google APIs are enabled
- Verify OAuth consent screen is configured

#### D. **"Popup blocked" Error**
- Allow popups for your domain
- Check browser popup blocker settings

### Debug Steps:

1. **Check Network Tab**: Look for OAuth requests
2. **Console Logs**: Check for error messages
3. **Appwrite Logs**: Check project logs in console
4. **Google Cloud Logs**: Check OAuth consent screen logs

## 📱 **Mobile/App Setup**

If you plan to use mobile apps:

1. **Add Android/iOS redirect URIs** in Google Cloud Console
2. **Configure platform-specific OAuth** in Appwrite
3. **Test on actual devices** (not just emulators)

## 🔒 **Security Best Practices**

1. **Never expose Client Secret** in frontend code
2. **Use HTTPS** in production
3. **Restrict OAuth scopes** to minimum required
4. **Monitor OAuth usage** in Google Cloud Console
5. **Regular security audits** of OAuth settings

## 📞 **Support Resources**

- [Appwrite OAuth Documentation](https://appwrite.io/docs/auth/oauth2)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Appwrite Community Discord](https://discord.gg/appwrite)

## ✅ **Verification Checklist**

- [ ] Google Cloud Console project created
- [ ] Google+ API and OAuth2 API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URIs configured correctly
- [ ] OAuth consent screen configured
- [ ] Appwrite Google provider enabled
- [ ] Client ID and Secret configured in Appwrite
- [ ] OAuth tested successfully

## 🚀 **After Setup**

Once Google OAuth is working:

1. **Test login flow** with Google account
2. **Verify user creation** in Appwrite console
3. **Check user sessions** and authentication
4. **Test logout flow**
5. **Verify redirects** work correctly

---

**Note**: This setup requires access to both Google Cloud Console and Appwrite Console. Make sure you have the necessary permissions for both platforms.
