import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

configure({ adapter: new Adapter() });

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock current date and user
global.testContext = {
  currentDate: '2025-02-14 19:40:01',
  currentUser: 'vilohitan'
};

// Mock react-native-firebase
jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true,
  default: () => ({
    logEvent: jest.fn(),
    setUserProperty: jest.fn()
  })
}));