import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostCard from '@/components/posts/PostCard';

const defaultProps = {
  id: 'post-1',
  title: 'Título del post',
  content: 'Este es el contenido del post para el extracto.',
  author: 'María García',
  authorId: 'user-1',
  createdAt: new Date().toISOString(),
};

function renderPostCard(props = {}) {
  return render(
    <MemoryRouter>
      <PostCard {...defaultProps} {...props} />
    </MemoryRouter>,
  );
}

describe('PostCard', () => {
  it('renderiza el título del post', () => {
    renderPostCard();

    expect(
      screen.getByRole('heading', { name: 'Título del post' }),
    ).toBeInTheDocument();
  });

  it('renderiza el nombre del autor', () => {
    renderPostCard();

    expect(screen.getByText('María García')).toBeInTheDocument();
  });

  it('renderiza el extracto del contenido', () => {
    const longContent = 'a'.repeat(160);

    renderPostCard({ content: longContent });

    expect(screen.getByText(`${'a'.repeat(150)}...`)).toBeInTheDocument();
  });
});
