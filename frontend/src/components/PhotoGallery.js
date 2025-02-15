import React, { useState } from 'react';
import { 
  View, 
  Image, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  Dimensions,
  ScrollView,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';

const { width, height } = Dimensions.get('window');

const PhotoGallery = ({ photos, onPhotoUpdate, onPhotoDelete }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
  };

  const handlePhotoAction = (action) => {
    if (action === 'delete') {
      onPhotoDelete(selectedPhoto);
    }
    setShowOptions(false);
    setSelectedPhoto(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {photos.map((photo, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.photoContainer}
            onPress={() => handlePhotoPress(photo)}
          >
            <Image source={{ uri: photo.url }} style={styles.thumbnail} />
            {photo.isPrivate && (
              <View style={styles.privateIndicator}>
                <Icon name="lock" size={16} color={COLORS.text.light} />
              </View>
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity 
          style={[styles.photoContainer, styles.addPhotoButton]}
          onPress={() => onPhotoUpdate()}
        >
          <Icon name="plus" size={32} color={COLORS.primary} />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Full Screen Photo Modal */}
      <Modal
        visible={!!selectedPhoto}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedPhoto(null)}
          >
            <Icon name="close" size={24} color={COLORS.text.light} />
          </TouchableOpacity>

          <Image 
            source={{ uri: selectedPhoto?.url }} 
            style={styles.fullScreenPhoto}
            resizeMode="contain"
          />

          <View style={styles.photoActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handlePhotoAction('delete')}
            >
              <Icon name="delete" size={24} color={COLORS.error} />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handlePhotoAction('privacy')}
            >
              <Icon 
                name={selectedPhoto?.isPrivate ? "lock-open" : "lock"} 
                size={24} 
                color={COLORS.primary} 
              />
              <Text style={styles.actionText}>
                {selectedPhoto?.isPrivate ? "Make Public" : "Make Private"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handlePhotoAction('setMain')}
            >
              <Icon name="star" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Set as Main</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.xs,
  },
  photoContainer: {
    width: (width - SPACING.md * 4) / 3,
    height: (width - SPACING.md * 4) / 3,
    margin: SPACING.xs,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  privateIndicator: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: SPACING.xs,
    borderRadius: 12,
  },
  addPhotoButton: {
    backgroundColor: COLORS.background.medium,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  addPhotoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.lg,
    zIndex: 1,
    padding: SPACING.sm,
  },
  fullScreenPhoto: {
    width: width,
    height: height * 0.6,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.light,
    marginTop: SPACING.xs,
  },
});

export default PhotoGallery;