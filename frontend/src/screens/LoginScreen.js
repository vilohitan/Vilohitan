import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const handleSubmit = () => {
    if (isLogin) {
      // Handle login
      if (formData.email === 'vilohitan@example.com') {
        navigation.replace('Home');
      }
    } else {
      // Handle registration
      navigation.navigate('OnboardingWalkthrough');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '', phone: '' });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to DSpot</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Sign in to continue' : 'Create your account'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Icon name="account" size={20} color={COLORS.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color={COLORS.text.secondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color={COLORS.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color={COLORS.text.secondary} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
            />
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {isLogin ? 'Log In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="google" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="facebook" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="apple" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.toggleMode}
          onPress={toggleMode}
        >
          <Text style={styles.toggleModeText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text style={styles.toggleModeTextHighlight}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.medium,
    borderRadius: 12,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  input: {
    ...TYPOGRAPHY.body,
    flex: 1,
    marginLeft: SPACING.sm,
    color: COLORS.text.primary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  submitButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.light,
    textAlign: 'center',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.background.medium,
  },
  dividerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginHorizontal: SPACING.md,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
    ...SHADOWS.small,
  },
  toggleMode: {
    alignItems: 'center',
  },
  toggleModeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  toggleModeTextHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;