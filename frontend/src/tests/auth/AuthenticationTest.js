import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { AppleAuthenticationScope, signInWithApple } from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthenticationTest {
  constructor() {
    this.timestamp = '2025-02-14 19:51:29';
    this.user = 'vilohitan';
    this.results = new Map();
    this.currentUser = null;
  }

  async testEmailPasswordSignUp(email, password) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      
      this.currentUser = userCredential.user;
      
      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email
        },
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testEmailPasswordSignIn(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      
      this.currentUser = userCredential.user;
      
      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email
        },
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testGoogleSignIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      this.currentUser = userCredential.user;
      
      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          provider: 'google'
        },
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testFacebookSignIn() {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      const data = await AccessToken.getCurrentAccessToken();
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      const userCredential = await auth().signInWithCredential(facebookCredential);
      
      this.currentUser = userCredential.user;
      
      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          provider: 'facebook'
        },
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testAppleSignIn() {
    try {
      const appleAuthResponse = await signInWithApple({
        requestedScopes: [
          AppleAuthenticationScope.FULL_NAME,
          AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = appleAuthResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken);
      const userCredential = await auth().signInWithCredential(appleCredential);
      
      this.currentUser = userCredential.user;
      
      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          provider: 'apple'
        },
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testPasswordReset(email) {
    try {
      await auth().sendPasswordResetEmail(email);
      return {
        success: true,
        email,
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testEmailVerification() {
    try {
      await this.currentUser?.sendEmailVerification();
      return {
        success: true,
        email: this.currentUser?.email,
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testTokenRefresh() {
    try {
      const token = await this.currentUser?.getIdToken(true);
      return {
        success: true,
        token: token.substring(0, 10) + '...',
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testSignOut() {
    try {
      await auth().signOut();
      this.currentUser = null;
      return {
        success: true,
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async cleanup() {
    try {
      await this.testSignOut();
      await AsyncStorage.clear();
      this.results.clear();
      return {
        success: true,
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  generateReport() {
    return {
      timestamp: this.timestamp,
      user: this.user,
      results: Array.from(this.results.entries()),
      summary: {
        totalTests: this.results.size,
        passedTests: Array.from(this.results.values()).filter(r => r.success).length,
        failedTests: Array.from(this.results.values()).filter(r => !r.success).length,
        currentUser: this.currentUser ? {
          uid: this.currentUser.uid,
          email: this.currentUser.email,
          emailVerified: this.currentUser.emailVerified
        } : null
      }
    };
  }
}

export default new AuthenticationTest();