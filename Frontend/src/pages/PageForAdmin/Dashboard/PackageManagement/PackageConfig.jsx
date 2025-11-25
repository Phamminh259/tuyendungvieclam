import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, Modal, Form, Input, InputNumber, message, Table, Tag, Tooltip, Space, Switch, List } from 'antd';
import { getAllPackages, createPackage, updatePackage, deletePackage, getPackageById } from '../../../../api/packageApi';
import { getAllPermissions, createPermission, updatePermission, deletePermission, getPermissionById, enablePermission, disablePermission } from '../../../../api/permissionApi';
import { assignPermissionToPackage, removePermissionFromPackage, getPermissionsByPackageId, enablePermissionForPackage, disablePermissionForPackage } from '../../../../api/packagePermissionApi';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, PushpinOutlined, SearchOutlined, TrophyOutlined, CustomerServiceOutlined, FileAddOutlined, BarChartOutlined, ApiOutlined, RiseOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

// Hàm lấy icon tương ứng với tên quyền
const getPermissionIcon = (permissionName) => {
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

const PackageConfig = () => {
  const [packages, setPackages] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPackageModalVisible, setIsPackageModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [permissionSubmitLoading, setPermissionSubmitLoading] = useState(false);
  const [permissionForm] = Form.useForm();
  const [isAssignPermissionModalVisible, setIsAssignPermissionModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [packagePermissions, setPackagePermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    fetchPackages();
    fetchPermissions();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await getAllPackages();
      console.log('Packages data:', data);
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      message.error('Không thể tải danh sách gói dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const data = await getAllPermissions();
      setPermissions(data);
    } catch (error) {
      message.error('Không thể tải danh sách quyền');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackagePermissions = async (packageId) => {
    setLoadingPermissions(true);
    try {
      console.log('Fetching permissions for package:', packageId);
      const data = await getPermissionsByPackageId(packageId);
      console.log('Package permissions:', data);
      if (data) {
        setPackagePermissions(data);
      }
    } catch (error) {
      console.error('Error fetching package permissions:', error);
      message.error('Không thể tải danh sách quyền của gói');
      setPackagePermissions([]);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleEditPackage = async (id) => {
    try {
      const data = await getPackageById(id);
      setCurrentPackage(data);
      setIsPackageModalVisible(true);
    } catch (error) {
      message.error('Không thể tải thông tin gói dịch vụ');
    }
  };

  const handleEditPermission = async (id) => {
    try {
      const data = await getPermissionById(id);
      console.log('Permission data:', data);

      const formData = {
        permissionName: data.name || data.permissionName,
        permissionKey: data.permissionKey,
        description: data.description
      };

      setCurrentPermission(data);
      permissionForm.setFieldsValue(formData);
      setIsPermissionModalVisible(true);
    } catch (error) {
      console.error('Error fetching permission:', error);
      message.error('Không thể tải thông tin quyền');
    }
  };

  const handlePackageSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      if (currentPackage) {
        await updatePackage(currentPackage.id, values);
        message.success('Cập nhật gói dịch vụ thành công');
      } else {
        await createPackage(values);
        message.success('Tạo gói dịch vụ thành công');
      }
      await fetchPackages();
      handleClosePackageModal();
    } catch (error) {
      message.error('Lỗi khi lưu gói dịch vụ');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePermissionSubmit = async (values) => {
    setPermissionSubmitLoading(true);
    try {
      if (currentPermission) {
        await updatePermission(currentPermission.id, values);
        message.success('Cập nhật quyền thành công');
      } else {
        await createPermission(values);
        message.success('Tạo quyền thành công');
      }
      await fetchPermissions();
      handleClosePermissionModal();
    } catch (error) {
      message.error('Lỗi khi lưu quyền');
    } finally {
      setPermissionSubmitLoading(false);
    }
  };

  const handleDeletePackage = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa gói "${record.packageName}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deletePackage(record.id);
          message.success('Xóa gói dịch vụ thành công');
          fetchPackages(); // Refresh danh sách
        } catch (error) {
          message.error('Lỗi khi xóa gói dịch vụ');
        }
      },
    });
  };

  const handleDeletePermission = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa quyền "${record.permissionName}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deletePermission(record.id);
          message.success('Xóa quyền thành công');
          fetchPermissions(); // Refresh danh sách
        } catch (error) {
          message.error('Lỗi khi xóa quyền');
        }
      },
    });
  };

  const handleAssignPermission = async (packageId, permissionId) => {
    try {
      await assignPermissionToPackage({ packageId, permissionId, value: 'Custom Value' });
      message.success('Gán quyền thành công');
      fetchPackages();
    } catch (error) {
      message.error('Lỗi khi gán quyền');
    }
  };

  const handleRemovePermission = async (packageId, permissionId) => {
    try {
      await removePermissionFromPackage(packageId, permissionId);
      message.success('Xóa quyền thành công');
      fetchPackages();
    } catch (error) {
      message.error('Lỗi khi xóa quyền');
    }
  };

  const handleClosePackageModal = () => {
    setIsPackageModalVisible(false);
    setCurrentPackage(null);
    form.resetFields();
  };

  const handleClosePermissionModal = () => {
    setIsPermissionModalVisible(false);
    setCurrentPermission(null);
    permissionForm.resetFields();
  };

  const handleTogglePermission = async (record, checked) => {
    try {
      if (checked) {
        await enablePermission(record.id);
        message.success('Đã bật quyền');
      } else {
        await disablePermission(record.id);
        message.success('Đã tắt quyền');
      }
      fetchPermissions(); // Refresh danh sách
    } catch (error) {
      message.error('Không thể thay đổi trạng thái quyền');
      console.error(error);
    }
  };

  const showAssignPermissionModal = async (record) => {
    console.log('Selected package:', record);
    setSelectedPackage(record);
    setPackagePermissions([]);
    setIsAssignPermissionModalVisible(true);
    await fetchPackagePermissions(record.id);
  };

  const handleCloseAssignModal = () => {
    setIsAssignPermissionModalVisible(false);
    setSelectedPackage(null);
    setPackagePermissions([]);
  };

  const handlePermissionChange = async (permission, checked, value = '') => {
    if (checked && !permission.active) {
      message.error(`Không thể gán quyền "${permission.permissionName}" vì quyền này đang bị tắt`);
      return;
    }

    setAssignLoading(true);
    try {
      if (checked) {
        await assignPermissionToPackage({
          packageId: selectedPackage.id,
          permissionId: permission.id,
          value: value || permission.defaultValue || 'Standard'
        });
        message.success('Gán quyền thành công');
      } else {
        await removePermissionFromPackage(selectedPackage.id, permission.id);
        message.success('Hủy gán quyền thành công');
      }
      await fetchPackagePermissions(selectedPackage.id);
    } catch (error) {
      message.error('Có lỗi xảy ra khi thay đổi trạng thái quyền');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleTogglePermissionForPackage = async (permission, enabled) => {
    setAssignLoading(true);
    try {
      if (enabled) {
        await enablePermissionForPackage(selectedPackage.id, permission.id);
        message.success(`Đã bật quyền "${permission.permissionName}" cho gói`);
      } else {
        await disablePermissionForPackage(selectedPackage.id, permission.id);
        message.success(`Đã tắt quyền "${permission.permissionName}" cho gói`);
      }
      await fetchPackagePermissions(selectedPackage.id);
    } catch (error) {
      message.error('Có lỗi xảy ra khi thay đổi trạng thái quyền');
    } finally {
      setAssignLoading(false);
    }
  };

  const packageColumns = [
    {
      title: 'Tên gói',
      dataIndex: 'packageName',
      key: 'packageName',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `${text.toLocaleString()} VNĐ`,
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (text) => `${text} tháng`,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => handleEditPackage(record.id)}
          >
            Sửa
          </Button>
          <Tooltip title="Quản lý quyền của gói">
            <Button 
              onClick={() => showAssignPermissionModal(record)}
              icon={<ApiOutlined />}
            >
              Quản lý quyền
            </Button>
          </Tooltip>
          <Button 
            type="primary" 
            danger 
            onClick={() => handleDeletePackage(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const permissionColumns = [
    {
      title: 'Mã quyền',
      dataIndex: 'permissionKey',
      key: 'permissionKey',
    },
    {
      title: 'Tên quyền',
      dataIndex: 'permissionName',
      key: 'permissionName',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      key: 'active',
      render: (_, record) => (
        <Tag color={record.active ? 'success' : 'error'}>
          {record.active ? 'Đang hoạt động' : 'Đã tắt'}
        </Tag>
      ),
    },
    {
      title: 'Bật/Tắt',
      key: 'toggle',
      render: (_, record) => (
        <Switch
          checked={record.active}
          onChange={(checked) => {
            Modal.confirm({
              title: 'Xác nhận thay đổi',
              icon: <ExclamationCircleOutlined />,
              content: `Bạn có chắc chắn muốn ${checked ? 'bật' : 'tắt'} quyền "${record.permissionName}" không?`,
              okText: 'Xác nhận',
              cancelText: 'Hủy',
              onOk: () => handleTogglePermission(record, checked)
            });
          }}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => handleEditPermission(record.id)}
          >
            Sửa
          </Button>
          <Button 
            type="primary" 
            danger 
            onClick={() => handleDeletePermission(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Cấu hình gói dịch vụ và quyền">
      <Tabs defaultActiveKey="packages">
        <TabPane tab="Gói dịch vụ" key="packages">
          <Button type="primary" onClick={() => {
            setCurrentPackage(null);
            setIsPackageModalVisible(true);
          }}>Tạo gói mới</Button>
          <Table dataSource={packages} columns={packageColumns} loading={loading} rowKey="id" style={{ marginTop: 16 }} />
        </TabPane>
        <TabPane tab="Quyền" key="permissions">
          <Button 
            type="primary" 
            onClick={() => {
              setCurrentPermission(null);
              setIsPermissionModalVisible(true);
            }}
          >
            Tạo quyền mới
          </Button>
          <Table 
            dataSource={permissions} 
            columns={permissionColumns} 
            loading={loading} 
            rowKey="id" 
            style={{ marginTop: 16 }} 
          />
        </TabPane>
      </Tabs>

      <Modal
        title={currentPackage ? "Sửa gói dịch vụ" : "Tạo gói dịch vụ mới"}
        visible={isPackageModalVisible}
        onCancel={handleClosePackageModal}
        destroyOnClose={true}
        footer={null}
        confirmLoading={submitLoading}
      >
        <Form
          form={form}
          initialValues={currentPackage || { packageName: '', duration: 1, price: 0 }}
          onFinish={handlePackageSubmit}
          layout="vertical"
          preserve={false}
        >
          <Form.Item
            label="Tên gói"
            name="packageName"
            rules={[{ required: true, message: 'Vui lòng nhập tên gói' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Thời gian (tháng)"
            name="duration"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
           label="Giá"
           name="price"
           rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
         >
           <InputNumber
             min={0}
             style={{ width: '100%' }}
             formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
             parser={value => value.replace(/\$\s?|(,*)/g, '')}
             addonAfter="VNĐ"
             step={100000}
             placeholder="Nhập giá gói dịch vụ"
           />
         </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={submitLoading}
              >
                {submitLoading ? 'Đang lưu...' : 'Lưu'}
              </Button>
              <Button 
                onClick={handleClosePackageModal}
                disabled={submitLoading}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={currentPermission ? "Sửa quyền" : "Tạo quyền mới"}
        visible={isPermissionModalVisible}
        onCancel={handleClosePermissionModal}
        destroyOnClose={true}
        footer={null}
        confirmLoading={permissionSubmitLoading}
      >
        <Form
          form={permissionForm}
          onFinish={handlePermissionSubmit}
          layout="vertical"
          preserve={false}
          initialValues={currentPermission ? {
            permissionName: currentPermission.name || currentPermission.permissionName,
            permissionKey: currentPermission.permissionKey,
            description: currentPermission.description
          } : undefined}
        >
          <Form.Item
            label="Tên quyền"
            name="permissionName"
            rules={[{ required: true, message: 'Vui lòng nhập tên quyền' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mã quyền"
            name="permissionKey"
            rules={[{ required: true, message: 'Vui lòng nhập mã quyền' }]}
          >
            <Input placeholder="Ví dụ: CREATE_JOB, VIEW_PROFILE" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={permissionSubmitLoading}
              >
                {permissionSubmitLoading ? 'Đang lưu...' : 'Lưu'}
              </Button>
              <Button 
                onClick={handleClosePermissionModal}
                disabled={permissionSubmitLoading}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Quản lý quyền - ${selectedPackage?.packageName}`}
        visible={isAssignPermissionModalVisible}
        onCancel={handleCloseAssignModal}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={handleCloseAssignModal}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        <List
          dataSource={permissions}
          loading={loadingPermissions || assignLoading}
          renderItem={permission => {
            const packagePermission = packagePermissions.find(p => 
              p.permissionName === permission.permissionName
            );
            
            const currentValue = packagePermission?.value || '';

            return (
              <List.Item>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Space>
                    {getPermissionIcon(permission.permissionName)}
                    <div>
                      <div>
                        {permission.permissionName}
                        {!permission.active && (
                          <Tag color="error" style={{ marginLeft: 8 }}>
                            Đã tắt
                          </Tag>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {permission.description}
                      </div>
                      {packagePermission && (
                        <div style={{ fontSize: '12px', color: '#1890ff' }}>
                          Giá trị hiện tại: {currentValue}
                        </div>
                      )}
                    </div>
                  </Space>
                  <Space>
                    {packagePermission && (
                      <>
                        <Switch
                          size="small"
                          checked={packagePermission.isActive}
                          onChange={(checked) => {
                            Modal.confirm({
                              title: 'Xác nhận thay đổi trạng thái',
                              icon: <ExclamationCircleOutlined />,
                              content: `Bạn có chắc chắn muốn ${checked ? 'bật' : 'tắt'} quyền "${permission.permissionName}" cho gói này?`,
                              okText: 'Xác nhận',
                              cancelText: 'Hủy',
                              onOk: () => handleTogglePermissionForPackage(permission, checked)
                            });
                          }}
                          checkedChildren="Bật"
                          unCheckedChildren="Tắt"
                        />
                        <Input
                          size="small"
                          placeholder="Nhập giá trị"
                          defaultValue={currentValue}
                          style={{ width: 120 }}
                          onBlur={(e) => {
                            if (e.target.value !== currentValue) {
                              Modal.confirm({
                                title: 'Xác nhận thay đổi giá trị',
                                icon: <ExclamationCircleOutlined />,
                                content: `Bạn có chắc chắn muốn thay đổi giá trị của quyền "${permission.permissionName}" thành "${e.target.value}"?`,
                                okText: 'Xác nhận',
                                cancelText: 'Hủy',
                                onOk: () => handlePermissionChange(permission, true, e.target.value)
                              });
                            }
                          }}
                        />
                      </>
                    )}
                    <Switch
                      checked={!!packagePermission}
                      disabled={!permission.active}
                      onChange={(checked) => {
                        if (!permission.active && checked) {
                          message.error(`Không thể gán quyền "${permission.permissionName}" vì quyền này đang bị tắt`);
                          return;
                        }
                        Modal.confirm({
                          title: 'Xác nhận thay đổi',
                          icon: <ExclamationCircleOutlined />,
                          content: checked 
                            ? `Nhập giá trị cho quyền "${permission.permissionName}":` 
                            : `Bạn có chắc chắn muốn xóa quyền "${permission.permissionName}" khỏi gói "${selectedPackage?.packageName}"?`,
                          okText: 'Xác nhận',
                          cancelText: 'Hủy',
                          onOk: async () => {
                            if (checked) {
                              // Nếu bật quyền, hiện modal nhập giá trị
                              Modal.confirm({
                                title: 'Nhập giá trị quyền',
                                icon: <ExclamationCircleOutlined />,
                                content: (
                                  <Input 
                                    placeholder="Nhập giá trị cho quyền"
                                    onChange={(e) => {
                                      window.permissionValue = e.target.value;
                                    }}
                                  />
                                ),
                                onOk: () => handlePermissionChange(permission, checked, window.permissionValue)
                              });
                            } else {
                              await handlePermissionChange(permission, checked);
                            }
                          }
                        });
                      }}
                    />
                  </Space>
                </Space>
              </List.Item>
            );
          }}
        />
      </Modal>
    </Card>
  );
};

export default PackageConfig; 