import React, { useState, useEffect } from "react";
import { Form, Select, Input, Button, Space, Checkbox, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllSkills } from "../../../../../api/skillApi";
import { createMultipleJobSkills } from "../../../../../api/jobSkillApi";

const { Option } = Select;

const JobSkillForm = ({ jobId, onSuccess }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Lấy danh sách tất cả skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getAllSkills();
        setSkills(data);
      } catch (error) {
        message.error("Lỗi khi tải danh sách kỹ năng");
      }
    };
    fetchSkills();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedSkills = values.skills.map((skill) => ({
        skillId: parseInt(skill.skillId), // Đảm bảo skillId là số
        proficiencyLevel: skill.proficiencyLevel || "BASIC", // Đảm bảo có proficiencyLevel
        description: skill.description || "",
        isRequired: Boolean(skill.isRequired), // Đảm bảo isRequired là boolean
      }));
      console.log("Submitting formatted skills:", formattedSkills);
      const response = await createMultipleJobSkills(jobId, formattedSkills);
      console.log("Job skills response:", response);
      message.success("Thêm kỹ năng thành công");
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      console.error("Error adding skills:", error);
      message.error(
        "Lỗi khi thêm kỹ năng: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} autoComplete="off">
      <Form.List name="skills">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, "skillId"]}
                  rules={[{ required: true, message: "Vui lòng chọn kỹ năng" }]}
                >
                  <Select
                    placeholder="Chọn kỹ năng"
                    style={{ width: 200 }}
                    showSearch
                    optionFilterProp="children"
                  >
                    {skills.map((skill) => (
                      <Option key={skill.id} value={skill.id}>
                        {skill.skillName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "proficiencyLevel"]}
                  rules={[{ required: true, message: "Vui lòng chọn mức độ" }]}
                >
                  <Select placeholder="Mức độ yêu cầu" style={{ width: 150 }}>
                    <Option value="BASIC">Cơ bản</Option>
                    <Option value="INTERMEDIATE">Trung bình</Option>
                    <Option value="ADVANCED">Nâng cao</Option>
                    <Option value="EXPERT">Chuyên gia</Option>
                  </Select>
                </Form.Item>

                <Form.Item {...restField} name={[name, "description"]}>
                  <Input placeholder="Mô tả yêu cầu" style={{ width: 200 }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "isRequired"]}
                  valuePropName="checked"
                >
                  <Checkbox>Bắt buộc</Checkbox>
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm kỹ năng
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu kỹ năng
        </Button>
      </Form.Item>
    </Form>
  );
};

export default JobSkillForm;
