import React from 'react';
import { shallow } from 'enzyme';
import MatchCard from '../../components/MatchCard';

describe('MatchCard Component', () => {
  const mockProps = {
    user: {
      id: 'test123',
      name: 'Test User',
      age: 28,
      photos: ['https://example.com/photo.jpg'],
      bio: 'Test bio',
      distance: 5,
      lastActive: global.testContext.currentDate
    },
    onLike: jest.fn(),
    onPass: jest.fn(),
    onSuperLike: jest.fn()
  };

  it('renders correctly', () => {
    const wrapper = shallow(<MatchCard {...mockProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('handles like action', () => {
    const wrapper = shallow(<MatchCard {...mockProps} />);
    wrapper.find('[testID="like-button"]').simulate('press');
    expect(mockProps.onLike).toHaveBeenCalledWith(mockProps.user.id);
  });

  it('handles pass action', () => {
    const wrapper = shallow(<MatchCard {...mockProps} />);
    wrapper.find('[testID="pass-button"]').simulate('press');
    expect(mockProps.onPass).toHaveBeenCalledWith(mockProps.user.id);
  });
});