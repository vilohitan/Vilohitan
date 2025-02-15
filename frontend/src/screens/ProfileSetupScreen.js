import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import { Formik } from 'formik';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  age: Yup.number()
    .min(18, 'Must be at least 18 years old')
    .max(100, 'Age is invalid')
    .required('Age is required'),
  bio: Yup.string()
    .min(10, 'Bio is too short')
    .max(500, 'Bio is too long')
    .required('Bio is required'),
  occupation: Yup.string()
    .min(2, 'Occupation is too short')
    .max(50, 'Occupation is too long')
    .required('Occupation is required'),
});

const ProfileSetupScreen = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const interests = [
    'Music', 'Travel', 'Sports', 'Reading', 'Cooking',
    'Photography', 'Art', 'Gaming', 'Movies', 'Technology',
    'Fitness', 'Nature', 'Dancing', 'Writing', 'Food'
  ];

  const handlePhotoUpload = () => {
    // Implement photo upload logic
  };

  const handleInterestToggle = (interest) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      }
      if (prev.length < 5) {
        return [...prev, interest];
      }
      return prev;
    });
  };

  const renderStep = (step, formikProps) => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Add Your Photos</Text>
            <Text style={styles.stepDescription}>
              Add at least 2 photos to continue
            </Text>
            
            <ScrollView horizontal style={styles.photosContainer}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity 
                    style={styles.deletePhotoButton}
                    onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                  >
                    <Icon name="close" size={20} color={COLORS.text.light} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {photos.length < 6 && (
                <TouchableOpacity 
                  style={styles.addPhotoButton}
                  onPress={handlePhotoUpload}
                >
                  <Icon name="camera-plus" size={32} color={COLORS.primary} />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Basic Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  formikProps.errors.name && styles.inputError
                ]}
                value={formikProps.values.name}
                onChangeText={formikProps.handleChange('name')}
                placeholder="Your full name"
              />
              {formikProps.errors.name && (
                <Text style={styles.errorText}>{formikProps.errors.name}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={[
                  styles.input,
                  formikProps.errors.age && styles.inputError
                ]}
                value={formikProps.values.age}
                onChangeText={formikProps.handleChange('age')}
                placeholder="Your age"
                keyboardType="numeric"
              />
              {formikProps.errors.age && (
                <Text style={styles.errorText}>{formikProps.errors.age}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Occupation</Text>
              <TextInput
                style={[
                  styles.input,
                  formikProps.errors.occupation && styles.inputError
                ]}
                value={formikProps.values.occupation}
                onChangeText={formikProps.handleChange('occupation')}
                placeholder="Your occupation"
              />
              {formikProps.errors.occupation && (
                <Text style={styles.errorText}>{formikProps.errors.occupation}</Text>
              )}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>About You</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.bioInput,
                  formikProps.errors.bio && styles.inputError
                ]}
                value={formikProps.values.bio}
                onChangeText={formikProps.handleChange('bio')}
                placeholder="Tell us about yourself..."
                multiline
                numberOfLines={4}
              />
              {formikProps.errors.bio && (
                <Text style={styles.errorText}>{formikProps.errors.bio}</Text>
              )}
            </View>

            <Text style={styles.interestsTitle}>
              Select Your Interests (Max 5)
            </Text>
            <View style={styles.interestsContainer}>
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestTag,
                    selectedInterests.includes(interest) && styles.selectedInterest
                  ]}
                  onPress={() => handleInterestToggle(interest)}
                >
                  <Text style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.selectedInterestText
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={{
        name: 'vilohitan',
        age: '28',
        bio: '',
        occupation: 'Software Developer'
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // Handle form submission
        navigation.replace('Home');
      }}
    >
      {(formikProps) => (
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.header}>
              <Text style={styles.title}>Create Your Profile</Text>
              <Text style={styles.subtitle}>Step {currentStep} of 3</Text>
            </View>

            {renderStep(currentStep, formikProps)}

            <Text style={styles.timestamp}>
              Last updated: 2025-02-14 19:13:56
            </Text>
          </ScrollView>

          <View style={styles.footer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                if (currentStep < 3) {
                  setCurrentStep(currentStep + 1);
                } else {
                  formikProps.handleSubmit();
                }
              }}
            >
               ▋