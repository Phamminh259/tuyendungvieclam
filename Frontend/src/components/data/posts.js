const posts = [
  {
    id: 1,
    title: "Cách viết CV ấn tượng cho sinh viên mới ra trường",
    category: "Kỹ năng viết CV",
    author: "Career Expert",
    date: "2025-10-20",
    description: "Hướng dẫn chi tiết cách tạo CV chuyên nghiệp cho sinh viên mới tốt nghiệp",
    thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4",
    content: `
      <h2>Làm thế nào để tạo ấn tượng với nhà tuyển dụng?</h2>
      <p>Khi bạn là sinh viên mới ra trường, việc tạo một CV ấn tượng là vô cùng quan trọng...</p>
      
      <h3>1. Chọn định dạng phù hợp</h3>
      <ul>
        <li>Sử dụng font chữ dễ đọc như Arial hoặc Calibri</li>
        <li>Kích thước font từ 11-12pt</li>
        <li>Căn lề đều đặn và nhất quán</li>
      </ul>

      <h3>2. Nêu bật kỹ năng chính</h3>
      <p>Dù chưa có kinh nghiệm làm việc, bạn vẫn có thể nêu bật:</p>
      <ul>
        <li>Các dự án trong trường học</li>
        <li>Hoạt động ngoại khóa</li>
        <li>Kỹ năng mềm</li>
      </ul>
    `
  },
  {
    id: 2,
    title: "10 xu hướng ngành nghề hot nhất 2025",
    category: "Xu hướng việc làm",
    author: "Market Analyst",
    date: "2025-10-20",
    description: "Khám phá những ngành nghề đang có nhu cầu cao nhất trên thị trường",
    thumbnail: "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
    content: `
      <h2>Những ngành nghề đang dẫn đầu xu hướng tuyển dụng</h2>
      <p>Thị trường lao động năm 2025 chứng kiến nhiều thay đổi đáng kể...</p>
      
      <h3>1. Công nghệ thông tin</h3>
      <div class="highlight-box">
        <p>Các vị trí hot:</p>
        <ul>
          <li>AI Engineer</li>
          <li>Data Scientist</li>
          <li>Full-stack Developer</li>
        </ul>
      </div>

      <h3>2. Digital Marketing</h3>
      <p>Với sự phát triển của thương mại điện tử...</p>
    `
  },
  {
    id: 3,
    title: "Kỹ năng phỏng vấn online hiệu quả",
    category: "Phỏng vấn",
    author: "HR Specialist",
    date: "2025-10-20",
    description: "Những bí quyết để thành công trong buổi phỏng vấn trực tuyến",
    thumbnail: "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf",
    content: `
      <h2>Chuẩn bị cho buổi phỏng vấn online</h2>
      <p>Phỏng vấn trực tuyến đang trở thành xu hướng phổ biến...</p>
    `
  },
  {
    id: 4,
    title: "5 cách đàm phán lương hiệu quả",
    category: "Phát triển sự nghiệp",
    author: "Career Coach",
    date: "2025-10-20",
    description: "Chiến lược đàm phán lương thành công cho người đi làm",
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
    content: `
      <h2>Nghệ thuật đàm phán lương</h2>
      <p>Đàm phán lương là kỹ năng quan trọng trong sự nghiệp...</p>
    `
  },
  {
    id: 5,
    title: "LinkedIn: Công cụ tìm việc hiệu quả",
    category: "Kỹ năng tìm việc",
    author: "Digital Expert",
    date: "2025-10-20",
    description: "Tối ưu hóa profile LinkedIn để thu hút nhà tuyển dụng",
    thumbnail: "https://images.unsplash.com/photo-1611944212129-29977ae1398c",
    content: `
      <h2>Xây dựng profile LinkedIn chuyên nghiệp</h2>
      <p>LinkedIn là công cụ không thể thiếu trong quá trình tìm việc...</p>
    `
  },
  {
    id: 6,
    title: "Quản lý thời gian hiệu quả trong công việc",
    category: "Kỹ năng làm việc",
    author: "Time Management Expert",
    date: "2025-10-20",
    description: "Phương pháp quản lý thời gian 4D giúp tăng năng suất công việc",
    thumbnail: "https://images.unsplash.com/photo-1506485338023-6ce5f36692df",
    content: `
      <h2>Nghệ thuật quản lý thời gian trong công việc</h2>
      <p>Quản lý thời gian hiệu quả là chìa khóa để thành công trong công việc và cân bằng cuộc sống.</p>

      <h3>1. Phương pháp 4D trong quản lý thời gian</h3>
      <ul>
        <li><strong>Do (Làm ngay)</strong>: Những công việc quan trọng và khẩn cấp</li>
        <li><strong>Delay (Trì hoãn)</strong>: Công việc quan trọng nhưng chưa khẩn cấp</li>
        <li><strong>Delegate (Ủy thác)</strong>: Công việc khẩn cấp nhưng không quá quan trọng</li>
        <li><strong>Drop (Loại bỏ)</strong>: Công việc không quan trọng và không khẩn cấp</li>
      </ul>

      <h3>2. Công cụ quản lý thời gian</h3>
      <div class="tool-box">
        <p>Các ứng dụng hữu ích:</p>
        <ul>
          <li>Trello - Quản lý công việc theo board</li>
          <li>RescueTime - Theo dõi thời gian sử dụng</li>
          <li>Forest - Tăng tập trung làm việc</li>
        </ul>
      </div>

      <h3>3. Lập kế hoạch theo tuần</h3>
      <p>Dành 30 phút vào Chủ nhật để lên kế hoạch cho cả tuần...</p>
    `
  },
  {
    id: 7,
    title: "Xây dựng Personal Branding trong thời đại số",
    category: "Phát triển cá nhân",
    author: "Brand Strategist",
    date: "2025-10-20",
    description: "Chiến lược xây dựng thương hiệu cá nhân toàn diện trên các nền tảng số",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    content: `
      <h2>Xây dựng thương hiệu cá nhân chuyên nghiệp</h2>
      <p>Trong thời đại số, thương hiệu cá nhân là tài sản vô giá giúp bạn nổi bật trong sự nghiệp.</p>

      <h3>1. Xác định định vị cá nhân</h3>
      <div class="strategy-box">
        <p>Các yếu tố cần xem xét:</p>
        <ul>
          <li>Giá trị cốt lõi của bản thân</li>
          <li>Chuyên môn nổi bật</li>
          <li>Đối tượng mục tiêu</li>
          <li>Điểm khác biệt với người khác</li>
        </ul>
      </div>

      <h3>2. Xây dựng nội dung chất lượng</h3>
      <p>Chia sẻ kiến thức chuyên môn thông qua:</p>
      <ul>
        <li>Bài viết chuyên sâu trên LinkedIn</li>
        <li>Blog cá nhân</li>
        <li>Podcast hoặc video YouTube</li>
      </ul>

      <h3>3. Mạng lưới quan hệ</h3>
      <p>Tích cực tham gia các cộng đồng chuyên môn...</p>
    `
  },
  {
    id: 8,
    title: "Kỹ năng làm việc nhóm trong môi trường đa văn hóa",
    category: "Kỹ năng mềm",
    author: "Global Team Leader",
    date: "2025-10-20",
    description: "Những điều cần biết khi làm việc trong môi trường đa quốc gia",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    content: `
      <h2>Làm việc hiệu quả trong môi trường đa văn hóa</h2>
      
      <h3>1. Hiểu biết văn hóa</h3>
      <div class="culture-box">
        <p>Các khía cạnh văn hóa cần chú ý:</p>
        <ul>
          <li>Phong cách giao tiếp</li>
          <li>Cách thức ra quyết định</li>
          <li>Quan điểm về thời gian</li>
          <li>Nghi thức xã giao</li>
        </ul>
      </div>

      <h3>2. Kỹ năng giao tiếp đa văn hóa</h3>
      <ul>
        <li>Sử dụng ngôn ngữ đơn giản, rõ ràng</li>
        <li>Lắng nghe tích cực</li>
        <li>Tôn trọng sự khác biệt</li>
        <li>Kiểm tra lại thông tin</li>
      </ul>

      <h3>3. Giải quyết xung đột</h3>
      <p>Các bước xử lý xung đột văn hóa trong nhóm...</p>
    `
  }
];

export default posts; 