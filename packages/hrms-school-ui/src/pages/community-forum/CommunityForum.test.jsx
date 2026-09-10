import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommunityForum from './CommunityForum';

jest.mock('../../services/communityForum.queries', () => {
  const CAT = [
    'Academic Support', 'Academic Support', 'Academic Support', 'Academic Support', 'Academic Support',
    'Events & Activities', 'Events & Activities', 'Events & Activities', 'Events & Activities', 'Events & Activities',
    'Health & Nutrition', 'Health & Nutrition', 'Health & Nutrition', 'Health & Nutrition', 'Health & Nutrition',
    'School Updates', 'School Updates', 'School Updates', 'School Updates', 'School Updates',
    'Volunteer Opportunities', 'Volunteer Opportunities', 'Volunteer Opportunities', 'Volunteer Opportunities', 'Volunteer Opportunities',
    'Academic Support', 'Events & Activities', 'Health & Nutrition', 'School Updates', 'Volunteer Opportunities',
  ];
  const posts = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: i === 0 ? 'Clarification on syllabus coverage' : `Post title ${i + 1}`,
    description: i === 1 ? 'Science experiment details' : `Post description ${i + 1}`,
    category: CAT[i],
    author: i === 0 ? 'Kalyan' : 'Test User',
    role: 'Parent',
    avatar: '',
    time: '10:00 AM',
    likes: 0,
    comments: 0,
    views: 0,
    saved: false,
    tags: [],
    initials: i === 0 ? 'KA' : 'TU',
  }));
  return {
    useCommunityForumQuery: () => ({
      data: {
        posts,
        stats: { totalPosts: 30, activeMembers: 5, trendingTopics: 5, responseRate: 10 },
        summary: { members: 5 },
      },
      isLoading: false,
      isError: false,
    }),
  };
});

describe('CommunityForum', () => {
  describe('Component Rendering', () => {
    test('renders community forum container with correct data-testid', () => {
      render(<CommunityForum />);
      expect(screen.getByTestId('school-container-community-forum')).toBeInTheDocument();
    });

    test('renders header with title and subtitle', () => {
      render(<CommunityForum />);
      expect(screen.getByText('Community Forum')).toBeInTheDocument();
      expect(screen.getByText('Connect, share ideas, and stay updated with posts and live chat')).toBeInTheDocument();
    });

    test('renders new post button', () => {
      render(<CommunityForum />);
      const newPostBtn = screen.getByTestId('school-button-new-post');
      expect(newPostBtn).toBeInTheDocument();
      expect(newPostBtn).toHaveTextContent('+ New Post');
    });
  });

  describe('Summary Cards', () => {
    test('renders all four summary cards', () => {
      render(<CommunityForum />);
      expect(screen.getByTestId('school-container-summary-cards')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-stat-0')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-stat-1')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-stat-2')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-stat-3')).toBeInTheDocument();
    });

    test('displays correct summary card values', () => {
      render(<CommunityForum />);
      const summaryCards = screen.getByTestId('school-container-summary-cards');
      expect(summaryCards).toHaveTextContent('Total Posts');
      expect(summaryCards).toHaveTextContent('30');
      expect(summaryCards).toHaveTextContent('Active Members');
      expect(summaryCards).toHaveTextContent('5');
      expect(summaryCards).toHaveTextContent('Trending Topics');
      expect(summaryCards).toHaveTextContent('5');
      expect(summaryCards).toHaveTextContent('Response Rate');
      expect(summaryCards).toHaveTextContent('10%');
    });
  });

  describe('Search and Heading Row', () => {
    test('renders search input', () => {
      render(<CommunityForum />);
      const searchInput = screen.getByTestId('school-field-search');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'Search posts...');
    });

    test('renders posts and alerts heading', () => {
      render(<CommunityForum />);
      expect(screen.getByTestId('school-heading-posts')).toHaveTextContent('Posts & Alerts');
    });

    test('search input updates on change', () => {
      render(<CommunityForum />);
      const searchInput = screen.getByTestId('school-field-search');
      fireEvent.change(searchInput, { target: { value: 'homework' } });
      expect(searchInput).toHaveValue('homework');
    });
  });

  describe('Categories Panel', () => {
    test('renders categories panel', () => {
      render(<CommunityForum />);
      expect(screen.getByTestId('school-panel-categories')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });

    test('renders all category buttons', () => {
      render(<CommunityForum />);
      expect(screen.getByTestId('school-category-all')).toBeInTheDocument();
      expect(screen.getByTestId('school-category-academic-support')).toBeInTheDocument();
      expect(screen.getByTestId('school-category-events-&-activities')).toBeInTheDocument();
      expect(screen.getByTestId('school-category-health-&-nutrition')).toBeInTheDocument();
      expect(screen.getByTestId('school-category-school-updates')).toBeInTheDocument();
      expect(screen.getByTestId('school-category-volunteer-opportunities')).toBeInTheDocument();
    });

    test('All category is active by default', () => {
      render(<CommunityForum />);
      const allCategory = screen.getByTestId('school-category-all');
      expect(allCategory).toHaveClass('active');
    });

    test('renders About All section', () => {
      render(<CommunityForum />);
      expect(screen.getByText('About All')).toBeInTheDocument();
      expect(screen.getByText('View all posts and discussions')).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    test('switches to Academic Support category when clicked', () => {
      render(<CommunityForum />);
      const academicBtn = screen.getByTestId('school-category-academic-support');
      fireEvent.click(academicBtn);
      expect(academicBtn).toHaveClass('active');
    });

    test('filters posts by selected category', () => {
      render(<CommunityForum />);
      // Initially shows all 30 posts
      const allPosts = screen.getAllByTestId(/school-post-/);
      expect(allPosts.length).toBe(30);
      // Click Academic Support category
      const academicBtn = screen.getByTestId('school-category-academic-support');
      fireEvent.click(academicBtn);
      // Should show only Academic Support posts (count based on mock data)
      const filteredPosts = screen.getAllByTestId(/school-post-/);
      expect(filteredPosts.length).toBeLessThan(30);
    });

    test('returns to all posts when All category is clicked', () => {
      render(<CommunityForum />);
      // Filter to Academic Support
      const academicBtn = screen.getByTestId('school-category-academic-support');
      fireEvent.click(academicBtn);
      // Click All to reset
      const allBtn = screen.getByTestId('school-category-all');
      fireEvent.click(allBtn);
      const allPosts2 = screen.getAllByTestId(/school-post-/);
      expect(allPosts2.length).toBe(30);
    });
  });

  describe('Posts Panel', () => {
    test('renders posts panel', () => {
      render(<CommunityForum />);
      expect(screen.getByTestId('school-panel-posts')).toBeInTheDocument();
    });

    test('renders all 50 posts initially', () => {
      render(<CommunityForum />);
      const posts = screen.getAllByTestId(/school-post-/);
      expect(posts.length).toBe(30);
    });

    test('renders a post with correct title and author', () => {
      render(<CommunityForum />);
      const posts = screen.getAllByTestId(/school-post-/);
      const hasExpectedPost = posts.some(post =>
        post.textContent.includes('Clarification on syllabus coverage') &&
        post.textContent.includes('Kalyan')
      );
      expect(hasExpectedPost).toBe(true);
    });
  });

  describe('Post Actions', () => {
    test('renders save and reply buttons for each post', () => {
      render(<CommunityForum />);
      expect(screen.getByTestId('school-button-save-1')).toBeInTheDocument();
      expect(screen.getByTestId('school-button-reply-1')).toBeInTheDocument();
    });

    test('toggles save status when save button is clicked', () => {
      render(<CommunityForum />);
      const saveBtn = screen.getByTestId('school-button-save-1');

      // Initially not saved
      expect(saveBtn).toHaveTextContent('??');

      // Click to save
      fireEvent.click(saveBtn);
      expect(saveBtn).toHaveTextContent('??');

      // Click to unsave
      fireEvent.click(saveBtn);
      expect(saveBtn).toHaveTextContent('??');
    });

    test('renders like, comment, and view buttons for each post', () => {
      render(<CommunityForum />);
      expect(screen.getByTestId('school-button-like-1')).toBeInTheDocument();
      expect(screen.getByTestId('school-button-comment-1')).toBeInTheDocument();
      expect(screen.getByTestId('school-button-view-1')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    test('filters posts by search query', () => {
      render(<CommunityForum />);
      const searchInput = screen.getByTestId('school-field-search');
      // Search for "Science"
      fireEvent.change(searchInput, { target: { value: 'Science' } });
      // Should show only posts with "Science" in title or description
      const filteredPosts = screen.getAllByTestId(/school-post-/);
      expect(filteredPosts.length).toBeLessThan(30);
    });

    test('shows no posts message when search has no results', () => {
      render(<CommunityForum />);
      const searchInput = screen.getByTestId('school-field-search');

      // Search for something that doesn't exist
      fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });

      expect(screen.getByTestId('school-message-no-posts')).toBeInTheDocument();
      expect(screen.getByText('No posts found matching your search criteria.')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('search input has proper placeholder', () => {
      render(<CommunityForum />);
      const searchInput = screen.getByTestId('school-field-search');
      expect(searchInput).toHaveAttribute('placeholder', 'Search posts...');
    });

    test('all category buttons are clickable', () => {
      render(<CommunityForum />);
      const allBtn = screen.getByTestId('school-category-all');
      const academicBtn = screen.getByTestId('school-category-academic-support');

      expect(allBtn).not.toBeDisabled();
      expect(academicBtn).not.toBeDisabled();
    });
  });
});

