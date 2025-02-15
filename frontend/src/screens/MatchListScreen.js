import React from 'react';
import { View, FlatList, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MatchListScreen = ({ navigation }) => {
  const matches = [
    {
      id: '1',
      name: 'Sarah',
      photo: 'https://example.com/photo1.jpg',
      lastMessage: 'Hey, how are you?',
      timestamp: '19:00',
      unread: 2,
      online: true
    },
    // Add more matches here
  ];

  const renderMatch = ({ item }) => (
    <TouchableOpacity 
      style={styles.matchItem}
      onPress={() => navigation.navigate('Chat', { matchedUser: item })}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.photo }} style={styles.avatar} />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      
      <View style={styles.rightContainer}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Matches</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-variant" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.matchList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.medium,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
  },
  filterButton: {
    padding: SPACING.sm,
  },
  matchList: {
    padding: SPACING.md,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background.light,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.background.light,
  },
  matchInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  matchName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  lastMessage: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  timestamp: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  unreadCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.light,
    fontWeight: '600',
  },
});

export default MatchListScreen;