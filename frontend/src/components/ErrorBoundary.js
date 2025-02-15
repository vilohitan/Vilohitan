import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      timestamp: '2025-02-14 19:21:34',
      user: 'vilohitan'
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    console.error('Error occurred:', {
      error,
      errorInfo,
      timestamp: this.state.timestamp,
      user: this.state.user
    });
    // Implement error logging service integration here
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  }

  handleReport = () => {
    // Implement error reporting functionality
    console.log('Reporting error...');
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Icon name="alert-circle-outline" size={64} color={COLORS.error} />
            
            <Text style={styles.title}>Oops! Something went wrong</Text>
            
            <Text style={styles.message}>
              We're sorry for the inconvenience. Please try again or report the issue.
            </Text>

            {__DEV__ && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugText}>
                  {this.state.error?.toString()}
                </Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.retryButton]}
                onPress={this.handleRetry}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.reportButton]}
                onPress={this.handleReport}
              >
                <Text style={styles.buttonText}>Report Issue</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.timestamp}>
              Error occurred at: {this.state.timestamp}
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
    marginVertical: SPACING.lg,
    textAlign: 'center',
  },
  message: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  debugInfo: {
    backgroundColor: COLORS.background.medium,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xl,
    width: '100%',
  },
  debugText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  button: {
    padding: SPACING.md,
    borderRadius: 8,
    minWidth: 120,
    ...SHADOWS.small,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
  },
  reportButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.light,
    textAlign: ' ▋