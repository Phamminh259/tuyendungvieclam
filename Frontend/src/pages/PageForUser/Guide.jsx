import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Tag, Input, Spin, Select, Empty, Divider } from 'antd';
import { SearchOutlined, ClockCircleOutlined, UserOutlined, ReadOutlined } from '@ant-design/icons';
import { getAllArticles } from '../../api/articleApi';
import Footer from '../../components/user/common/Footer';


const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Guide = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredArticle, setFeaturedArticle] = useState(null);

  const categories = [
    { value: 'all', label: 'Tất cả bài viết' },
    { value: 'Kỹ năng viết CV', label: 'Kỹ năng viết CV' },
    { value: 'Phỏng vấn', label: 'Phỏng vấn' },
    { value: 'Phát triển sự nghiệp', label: 'Phát triển sự nghiệp' },
    { value: 'Kỹ năng mềm', label: 'Kỹ năng mềm' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getAllArticles();
      setArticles(data);
      setFeaturedArticle(data[0]); // Bài viết mới nhất làm featured
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
    } 
  };

  const getFilteredArticles = () => {
    return articles.filter(article => {
      const matchSearch = article.title.toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = selectedCategory === 'all' || article.categories.includes(selectedCategory);
      return matchSearch && matchCategory;
    }).filter(article => article !== featuredArticle);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Đang tải bài viết..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content>
       {/* Hero Section */}
       <div style={{ 
          background: 'linear-gradient(to right, #020024, #cc0a9d)',
          padding: '60px 0',
          marginBottom: '40px',
          borderRadius: '0 0 20px 20px'
        }}>
          <Title level={1} style={{ 
            textAlign: 'center', 
            color: '#fff',
            margin: '0 0 20px 0'
          }}>
            Cẩm nang tìm việc
          </Title>
          <Text style={{ 
            display: 'block',
            textAlign: 'center',
            color: '#fff',
            fontSize: '18px'
          }}>
            Khám phá những kiến thức và kỹ năng cần thiết cho sự nghiệp của bạn
          </Text>
        </div>
        
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          {/* Search & Filter */}
          <Row gutter={16} style={{ marginBottom: 40 }}>
            <Col xs={24} sm={12}>
              <Input
                size="large"
                placeholder="Tìm kiếm bài viết..."
                prefix={<SearchOutlined />}
                onChange={e => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Select
                size="large"
                style={{ width: '100%' }}
                placeholder="Chọn danh mục"
                defaultValue="all"
                onChange={value => setSelectedCategory(value)}
              >
                {categories.map(cat => (
                  <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* Featured Article */}
          {featuredArticle && (
            <div style={{ marginBottom: 40 }}>
              <Title level={3} style={{ marginBottom: 24 }}>Bài Viết Nổi Bật</Title>
              <Card
                hoverable
                style={{ overflow: 'hidden' }}
                bodyStyle={{ padding: 0 }}
              >
                <Row>
                  <Col xs={24} md={12}>
                    <img
                      alt={featuredArticle.title}
                      src={featuredArticle.thumbnail}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col xs={24} md={12} style={{ padding: 24 }}>
                    <Tag color="blue">{featuredArticle.categories[0]}</Tag>
                    <Title level={3} style={{ marginTop: 16 }}>{featuredArticle.title}</Title>
                    <Paragraph ellipsis={{ rows: 3 }} style={{ color: '#666' }}>
                      {featuredArticle.description}
                    </Paragraph>
                    <div style={{ marginTop: 16 }}>
                      <Text type="secondary">
                        <UserOutlined style={{ marginRight: 8 }} />
                        {featuredArticle.source}
                      </Text>
                      <Divider type="vertical" />
                      <Text type="secondary">
                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                        {new Date(featuredArticle.pubDate).toLocaleDateString('vi-VN')}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          )}

          {/* Article List */}
          <div>
            <Title level={3} style={{ marginBottom: 24 }}>Tất Cả Bài Viết</Title>
            <Row gutter={[24, 24]}>
              {getFilteredArticles().length > 0 ? (
                getFilteredArticles().map((article, index) => (
                  <Col xs={24} sm={12} lg={8} key={index}>
                    <Card
                      hoverable
                      style={{ height: '100%' }}
                      cover={
                        <div style={{ height: 200, overflow: 'hidden' }}>
                          <img
                            alt={article.title}
                            src={article.thumbnail}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s'
                            }}
                          />
                        </div>
                      }
                    >
                      <Tag color="blue" style={{ marginBottom: 12 }}>
                        {article.categories[0]}
                      </Tag>
                      <Title level={4} ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                        {article.title}
                      </Title>
                      <Paragraph ellipsis={{ rows: 2 }} type="secondary">
                        {article.description}
                      </Paragraph>
                      <div style={{ marginTop: 16 }}>
                        <Text type="secondary">
                          <UserOutlined style={{ marginRight: 8 }} />
                          {article.source}
                        </Text>
                        <Divider type="vertical" />
                        <Text type="secondary">
                          <ClockCircleOutlined style={{ marginRight: 8 }} />
                          {new Date(article.pubDate).toLocaleDateString('vi-VN')}
                        </Text>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <Empty
                    description="Không tìm thấy bài viết nào"
                    style={{ margin: '40px 0' }}
                  />
                </Col>
              )}
            </Row>
          </div>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Guide; 