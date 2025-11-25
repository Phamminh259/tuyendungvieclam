import {
  PushpinOutlined,
  SearchOutlined,
  TrophyOutlined,
  CustomerServiceOutlined,
  FileAddOutlined,
  BarChartOutlined,
  ApiOutlined,
  RiseOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';

// Hàm lấy icon tương ứng với tên quyền
export const getPermissionIcon = (permissionName) => {
  const iconMap = {
    'Đăng tin tuyển dụng': <FileAddOutlined />,
    'Xem hồ sơ ứng viên': <SolutionOutlined />,
    'Tìm kiếm ứng viên': <SearchOutlined />,
    'Mời phỏng vấn': <TeamOutlined />,
    'Ghim tin tuyển dụng': <PushpinOutlined />,
    'Huy hiệu nhà tuyển dụng': <TrophyOutlined />,
    'Ưu tiên tìm kiếm': <RiseOutlined />,
    'Truy cập API': <ApiOutlined />,
    'Báo cáo phân tích': <BarChartOutlined />,
    'Mức độ hỗ trợ': <CustomerServiceOutlined />
  };
  return iconMap[permissionName] || <FileAddOutlined />;
};

// Hàm format giá trị quyền
export const formatPermissionValue = (value, permissionName) => {
  switch (permissionName) {
    case 'Đăng tin tuyển dụng':
      switch (value) {
        case 'unlimited': return 'Không giới hạn';
        case 'limited': return `${value} lượt`;
        default: return value;
      }
    case 'Xem hồ sơ ứng viên':
      switch (value) {
        case 'basic': return 'Cơ bản';
        case 'full': return 'Đầy đủ';
        case 'unlimited': return 'Không giới hạn';
        default: return value;
      }
    case 'Tìm kiếm ứng viên':
      switch (value) {
        case 'basic': return 'Cơ bản';
        case 'advanced': return 'Nâng cao';
        case 'ai-matching': return 'AI Matching';
        default: return value;
      }
    case 'Mời phỏng vấn':
      return value === 'unlimited' ? 'Không giới hạn' : `${value} lượt`;
    case 'Huy hiệu nhà tuyển dụng':
      switch (value) {
        case 'normal': return 'Thường';
        case 'trusted': return 'Uy tín';
        case 'vip': return 'VIP';
        default: return value;
      }
    case 'Ưu tiên tìm kiếm':
      switch (value) {
        case 'normal': return 'Bình thường';
        case 'high': return 'Cao';
        case 'highest': return 'Cao nhất';
        default: return value;
      }
    case 'Truy cập API':
      return value === 'true' ? 'Có' : 'Không';
    case 'Ghim tin tuyển dụng':
      return value === 'unlimited' ? 'Không giới hạn' : `${value} lượt`;
    case 'Báo cáo phân tích':
      switch (value) {
        case 'basic': return 'Cơ bản';
        case 'detailed': return 'Chi tiết';
        default: return value;
      }
    case 'Mức độ hỗ trợ':
      switch (value) {
        case '24-7': return 'Hỗ trợ 24/7';
        case 'normal': return 'Bình thường';
        default: return value;
      }
    default:
      return value;
  }
};

// Hàm lấy màu cho tag
export const getPermissionTagColor = (value, permissionName) => {
  if (value === 'unlimited' || value === 'vip') return 'gold';
  if (value === 'true' || value === 'advanced' || value === 'ai-matching') return 'blue';
  if (value === 'false' || value === '0') return 'red';
  if (value === 'trusted') return 'purple';
  if (!isNaN(value) && value > 0) return 'cyan';
  return 'default';
}; 