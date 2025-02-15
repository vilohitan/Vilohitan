import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const { matchedUser } = route.params;

  // Dummy data for demonstration
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Hey there! 👋',
        sender: 'them',
        timestamp: '19:00'
      },
      {
        id: '2',
        text: 'Hi! How are you?',
        sender: 'me',
        timestamp: '19:01'
      }
    ]);
  }, []);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit'
        })
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd();
      }, 100);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Chat Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: matchedUser.photo }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{matchedUser.name}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="phone" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="video" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="plus" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        
        {inputText.trim() ? (
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Icon name="send" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.mediaButton}>
              <Icon name="camera" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton}>
              <Icon name="microphone" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background.light,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.medium,
    ...SHADOWS.small,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  headerStatus: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
  },
  headerButton: {
    padding: SPACING.sm,
  },
  messagesList: {
    padding: SPACING.md,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.background.medium,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.light,
  },
  timestamp: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.light,
    opacity: 0.7,
    alignSelf: 'flex-end',
    marginTop: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background.light,
    borderTopWidth: 1,
    borderTopColor: COLORS.background.medium,
  },
  attachButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    maxHeight: 100,
    backgroundColor: COLORS.background.medium,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  sendButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.background.medium,
    borderRadius: 20,
  },
  mediaButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
});

export default ChatScreen;