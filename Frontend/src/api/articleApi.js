import axios from 'axios';
import posts from '../components/data/posts';

// Mapping ảnh theo category
const categoryImages = {
  'Kỹ năng viết CV': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4',
  'Phỏng vấn': 'https://images.unsplash.com/photo-1616587226960-4a03badbe8bf',
  'Phát triển sự nghiệp': 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
  'Kỹ năng mềm': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
  'default': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
};

// Lấy tất cả bài viết
export const getAllArticles = async () => {
  try {
    // Chuyển đổi dữ liệu mẫu với ảnh từ unsplash
    const sampleArticles = posts.map(post => ({
      title: post.title,
      description: post.description,
      content: post.content,
      thumbnail: categoryImages[post.category] || categoryImages.default,
      link: '#',
      pubDate: post.date,
      categories: [post.category],
      source: 'JobPortal Blog'
    }));

    return sampleArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  } catch (error) {
    console.error('Lỗi khi lấy tất cả bài viết:', error);
    return [];
  }
};

// Lấy bài viết theo danh mục
export const getArticlesByCategory = async (category) => {
  try {
    const allArticles = await getAllArticles();
    return allArticles.filter(article => 
      article.categories?.some(cat => 
        cat.toLowerCase().includes(category.toLowerCase())
      )
    );
  } catch (error) {
    console.error('Lỗi khi lọc bài viết theo danh mục:', error);
    return [];
  }
};