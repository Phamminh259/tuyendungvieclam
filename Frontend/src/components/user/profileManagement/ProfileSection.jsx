import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Upload,
  Checkbox,
  message,
  InputNumber,
  Empty,
  Rate,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  LoadingOutlined,
  BankOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getCandidateProfileByEmail,
  updateCandidate,
  addWorkHistory,
  updateWorkHistory,
  deleteWorkHistory,
  getAllWorkHistories,
  updateAvailability,
  sendJobSuggestions,
} from "../../../api/candidateApi";
import { AuthContext } from "../../auth/AuthProvider";
import dayjs from "dayjs";
import { getAllIndustries } from "../../../api/industryApi";
import { getAllProfessions } from "../../../api/professionApi";
import uploadService from "../../../api/uploadApi";
import { getAllSkills } from "../../../api/skillApi";
import {
  addCandidateSkill,
  deleteCandidateSkill,
} from "../../../api/candidateSkillApi";
import CVSection from "./CVSection";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import "react-medium-image-zoom/dist/styles.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { Title, Text } = Typography;

const EDUCATION_LEVELS = {
  HIGH_SCHOOL: "Trung học phổ thông",
  COLLEGE: "Cao đẳng",
  UNIVERSITY: "Đại học",
  POSTGRADUATE: "Thạc sĩ",
  DOCTORATE: "Tiến sĩ",
  OTHER: "Khác",
};

const JOB_LEVELS = {
  INTERN: "Thực tập sinh",
  FRESHER: "Mới tốt nghiệp",
  JUNIOR: "Nhân viên",
  MIDDLE: "Chuyên viên",
  SENIOR: "Chuyên viên cao cấp",
  LEAD: "Trưởng nhóm",
  MANAGER: "Quản lý",
};

const EXPERIENCE_LEVELS = {
  NO_EXPERIENCE: "Chưa có kinh nghiệm",
  LESS_THAN_1_YEAR: "Dưới 1 năm",
  ONE_TO_THREE_YEARS: "1-3 năm",
  THREE_TO_FIVE_YEARS: "3-5 năm",
  FIVE_TO_TEN_YEARS: "5-10 năm",
  MORE_THAN_TEN_YEARS: "Trên 10 năm",
};

const JOB_TYPES = {
  FULL_TIME: "Toàn thời gian",
  PART_TIME: "Bán thời gian",
  SEASONAL: "Thời vụ",
};

const PROFICIENCY_LEVELS = {
  BEGINNER: {
    value: "BEGINNER",
    label: "Cơ bản",
    description: "Có kiến thức cơ bản và cần được hướng dẫn thường xuyên",
    color: "#ff7a45",
    lightColor: "#ffd591",
    level: 1,
  },
  INTERMEDIATE: {
    value: "INTERMEDIATE",
    label: "Trung cấp",
    description: "Có thể làm việc độc lập với các task thông thường",
    color: "#1890ff",
    lightColor: "#bae7ff",
    level: 2,
  },
  ADVANCED: {
    value: "ADVANCED",
    label: "Cao cấp",
    description: "Có kinh nghiệm sâu và có thể hướng dẫn người khác",
    color: "#52c41a",
    lightColor: "#d9f7be",
    level: 3,
  },
  EXPERT: {
    value: "EXPERT",
    label: "Thành thạo",
    description: "Có chuyên môn cao và khả năng giải quyết vấn đề phức tạp",
    color: "#722ed1",
    lightColor: "#efdbff",
    level: 4,
  },
};

// Cập nhật enumValues để map số với key
const enumValues = {
  1: "BEGINNER",
  2: "INTERMEDIATE",
  3: "ADVANCED",  
  4: "EXPERT",
};

const ProfileSection = () => {
  const [form] = Form.useForm();
  const [careerGoalsForm] = Form.useForm();
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [industries, setIndustries] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [workHistory, setWorkHistory] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [workHistoryForm] = Form.useForm();
  const [isWorkHistoryModalVisible, setIsWorkHistoryModalVisible] =
    useState(false);
  const [editingWorkHistory, setEditingWorkHistory] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const { confirm } = Modal;

  // Thêm state để quản lý input skill name
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [randomSkills, setRandomSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [isSkillModalVisible, setIsSkillModalVisible] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loadingAllSkills, setLoadingAllSkills] = useState(false);
  const [loadingCandidateSkills, setLoadingCandidateSkills] = useState(false);
  // xủ lý modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCareerGoalsModalVisible, setIsCareerGoalsModalVisible] =
    useState(false);
  const [isReferenceModalVisible, setIsReferenceModalVisible] = useState(false);

  // Xử lý input skill
  const handleSkillInputChange = (value) => {
    setSkillName(value || "");
    if (value && value.trim()) {
      const filtered = allSkills.filter((skill) =>
        skill.skillName?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  };

  // Handle selecting a suggested skill
  const handleSuggestedSkillClick = (skill) => {
    setSkillName(skill.skillName);
    setFilteredSkills([]);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.email) {
          throw new Error("Không tìm thấy email người dùng");
        }
        const data = await getCandidateProfileByEmail(user.email);
        console.log("Profile data:", data);
        setProfile(data);

        if (data?.id) {
          const workHistories = await getAllWorkHistories(data.id);
          setWorkHistory(workHistories);
        }

        if (data?.industryId) {
          setSelectedIndustry(data.industryId);
          const professionsData = await getAllProfessions();
          const selectedIndustry = industries.find(
            (ind) => ind.id === data.industryId
          );
          const filteredProfessions = professionsData.filter(
            (profession) => profession.industryName === selectedIndustry?.name
          );
          setProfessions(filteredProfessions);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin profile:", error);
        message.error("Không thể lấy thông tin profile");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, industries]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const industriesData = await getAllIndustries();
        setIndustries(industriesData);
        console.log("Loaded industries:", industriesData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu industries:", error);
      }
    };
    fetchData();
  }, []);

  // xủ lý load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (profile && industries.length > 0) {
          console.log("Loading profile data:", profile);

          // Tìm industry dựa vào industryName
          const selectedIndustry = industries.find(
            (ind) => ind.name === profile.industryName
          );
          console.log("Found industry:", selectedIndustry);

          if (selectedIndustry) {
            setSelectedIndustry(selectedIndustry.id);

            // Load tất cả professions
            const professionsData = await getAllProfessions();
            console.log("All professions:", professionsData);

            // Filter professions theo industry
            const filteredProfessions = professionsData.filter(
              (profession) => profession.industryName === profile.industryName
            );
            console.log("Filtered professions:", filteredProfessions);
            setProfessions(filteredProfessions);

            // Tìm profession dựa vào professionName
            const selectedProfession = filteredProfessions.find(
              (prof) => prof.name === profile.professionName
            );
            console.log("Found profession:", selectedProfession);

            // Set form values
            form.setFieldsValue({
              industry: selectedIndustry.id,
              profession: selectedProfession?.id,
              firstName: profile?.fullName?.split(" ").pop(),
              lastName: profile?.fullName?.split(" ").slice(0, -1).join(" "),
              title: profile?.title,
              jobLevel: profile?.jobLevel,
              experienceLevel: profile?.experienceLevel,
              educationLevel: profile?.educationLevel,
              location: profile?.location,
              email: profile?.email,
              phone: profile?.phone,
              birthDate: profile?.birthday ? dayjs(profile?.birthday) : null,
              address: profile?.address,
              gender: profile?.sex ? "male" : "female",
              maritalStatus: profile?.maritalStatus,
              jobType: profile?.jobType,
              expectedSalary: profile?.expectedSalary,
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi load profile data:", error);
      }
    };

    if (profile && industries.length > 0) {
      loadProfileData();
    }
  }, [profile, industries, form]);

  // xủ lý load tỉnh thành
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        // Sắp xếp tỉnh thành theo alphabet
        const sortedProvinces = data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setProvinces(sortedProvinces);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
        message.error("Không thể lấy danh sách tỉnh thành");
      }
    };

    fetchProvinces();
  }, []);

  // Tách thành 2 useEffect riêng biệt
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoadingAllSkills(true);
        const skills = await getAllSkills();
        setAllSkills(skills);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kỹ năng:", error);
        message.error("Không thể lấy danh sách kỹ năng");
      } finally {
        setLoadingAllSkills(false);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    if (profile?.candidateSkills) {
      setCandidateSkills(profile.candidateSkills);
    }
  }, [profile]);

  // xủ lý chọn ngành nghề
  const handleIndustryChange = async (industryId) => {
    setSelectedIndustry(industryId);
    try {
      console.log("Selected industry ID:", industryId);

      const selectedIndustry = industries.find((ind) => ind.id === industryId);
      console.log("Selected industry:", selectedIndustry);

      const professionsData = await getAllProfessions();
      console.log("All professions:", professionsData);

      const filteredProfessions = professionsData.filter(
        (profession) => profession.industryName === selectedIndustry?.name
      );

      console.log("Filtered professions:", filteredProfessions);
      setProfessions(filteredProfessions);

      form.setFieldValue("profession", undefined);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ngành nghề:", error);
      message.error("Không thể lấy danh sách ngành nghề");
    }
  };

  // xủ lý cập nhật profile
  const handleUpdateProfileInfo = async (values) => {
    try {
      if (!profile?.id) {
        throw new Error("Không tìm thấy ID profile");
      }

      console.log("Form values:", values);

      // Xử lý số điện thoại
      let phoneNumber = values.phone;
      if (phoneNumber) {
        phoneNumber = phoneNumber.replace(/\s+/g, "").replace(/[^\d]/g, "");
        if (phoneNumber.length !== 10) {
          throw new Error("Số điện thoại phải có 10 số");
        }
        if (!phoneNumber.startsWith("0")) {
          phoneNumber = "0" + phoneNumber;
        }
      }

      // Giữ lại avatar URL khi cập nhật thông tin khác
      const updatedData = {
        title: values.title,
        fullName: `${values.lastName} ${values.firstName}`.trim(),
        birthday: values.birthDate?.format("YYYY-MM-DD"),
        sex: values.gender === "male",
        jobLevel: values.jobLevel,
        experienceLevel: values.experienceLevel,
        jobType: values.jobType,
        educationLevel: values.educationLevel,
        industryId: values.industry,
        professionId: values.profession,
        phone: phoneNumber,
        address: values.address,
        maritalStatus: values.maritalStatus || null,
        location: values.location,
        isAvailable: true,
        expectedSalary: values.expectedSalary,
        avatar: profile.avatar,
      };

      console.log("Updated data to be sent:", updatedData);

      const updatedProfile = await updateCandidate(profile.id, updatedData);
      console.log("Response from server:", updatedProfile);

      setProfile(updatedProfile);
      message.success("Cập nhật thông tin thành công");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      message.error("Lỗi khi cập nhật thông tin: " + error.message);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Thêm hàm validate file
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ chấp nhận file JPG/PNG!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return false;
    }

    return true;
  };

  // Thêm hàm xử lý upload
  const handleAvatarChange = async (info) => {
    try {
      const file = info.file;
      if (!beforeUpload(file)) {
        return;
      }

      setUploading(true);

      // Upload ảnh
      const imageUrl = await uploadService.uploadAvatar(file, token);
      console.log("Uploaded image URL:", imageUrl);

      // Giữ lại tất cả thông tin cũ và chỉ cập nhật avatar
      const updatedProfile = await updateCandidate(profile.id, {
        ...profile, // Giữ lại tất cả thông tin hiện có
        avatar: imageUrl, // Chỉ cập nhật avatar
      });

      setProfile(updatedProfile);
      message.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      console.error("Lỗi upload:", error);
      message.error("Lỗi khi tải ảnh lên: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Xử lý cập nhật mục tiêu nghề nghiệp
  const handleUpdateCareerGoals = async () => {
    try {
      const values = await careerGoalsForm.validateFields();

      const updatedProfile = await updateCandidate(profile.id, {
        ...profile,
        description: values.description,
      });

      setProfile(updatedProfile);
      message.success("Cập nhật mục tiêu nghề nghiệp thành công");
      setIsCareerGoalsModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật mục tiêu nghề nghiệp:", error);
      message.error("Lỗi khi cập nhật: " + error.message);
    }
  };

  // Fetch work histories khi component mount
  useEffect(() => {
    if (profile?.id) {
      fetchWorkHistories();
    }
  }, [profile?.id]);

  const fetchWorkHistories = async () => {
    try {
      const data = await getAllWorkHistories(profile.id);
      setWorkHistory(data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách kinh nghiệm làm việc");
    }
  };

  // Hàm xử lý thêm/sửa kinh nghiệm làm việc
  const handleSubmitWorkHistory = async (values) => {
    try {
      const workHistoryData = {
        companyName: values.company,
        position: values.title,
        startDate: values.startDate.toDate(),
        endDate: values.isCurrentJob ? null : values.endDate?.toDate(),
        description: values.description,
        isCurrentJob: values.isCurrentJob || false,
      };

      let updatedProfile;
      if (editingWorkHistory) {
        await updateWorkHistory(
          profile.id,
          editingWorkHistory.id,
          workHistoryData
        );
        message.success("Cập nhật kinh nghiệm làm việc thành công");
      } else {
        await addWorkHistory(profile.id, workHistoryData);
        message.success("Thêm kinh nghiệm làm việc thành công");
      }

      await fetchWorkHistories(); // Refresh danh sách
      setIsWorkHistoryModalVisible(false);
      workHistoryForm.resetFields();
      setEditingWorkHistory(null);
    } catch (error) {
      message.error("Lỗi khi lưu kinh nghiệm làm việc: " + error.message);
    }
  };

  // Hàm xử lý xóa kinh nghiệm làm việc
  const handleDeleteWorkHistory = (workHistory) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa kinh nghiệm làm việc này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await deleteWorkHistory(profile.id, workHistory.id);
          message.success("Xóa kinh nghiệm làm việc thành công");
          await fetchWorkHistories();
        } catch (error) {
          message.error("Lỗi khi xóa kinh nghiệm làm việc: " + error.message);
        }
      },
    });
  };

  // Hàm mở modal chỉnh sửa
  const handleEditWorkHistory = (workHistory) => {
    setEditingWorkHistory(workHistory);
    workHistoryForm.setFieldsValue({
      title: workHistory.position,
      company: workHistory.companyName,
      startDate: dayjs(workHistory.startDate),
      endDate: workHistory.endDate ? dayjs(workHistory.endDate) : null,
      isCurrentJob: workHistory.isCurrentJob,
      description: workHistory.description,
    });
    setIsWorkHistoryModalVisible(true);
  };

  // Xử lý thêm skill
  const handleAddSkill = async () => {
    if (!skillName || !selectedLevel) {
      message.error("Vui lòng nhập đầy đủ thông tin kỹ năng");
      return;
    }

    try {
      const selectedSkill = allSkills.find(
        (skill) => skill.skillName.toLowerCase() === skillName.toLowerCase()
      );

      if (!selectedSkill) {
        message.error("Kỹ năng không tồn tại trong hệ thống");
        return;
      }

      // Kiểm tra xem skill đã tồn tại chưa
      const isExisting = candidateSkills.some(
        (skill) => skill.skillId === selectedSkill.id
      );

      if (isExisting) {
        message.error("Kỹ năng này đã được thêm");
        return;
      }

      const response = await addCandidateSkill(profile.id, {
        skillId: selectedSkill.id,
        proficiencyLevel: selectedLevel,
      });

      if (response) {
        // Tạo đối tượng skill mới với format đúng
        const newSkill = {
          id: response.id,
          candidateId: profile.id,
          skillId: selectedSkill.id,
          skillName: selectedSkill.skillName,
          proficiencyLevel: selectedLevel,
        };

        // Cập nhật state candidateSkills
        setCandidateSkills((prev) => [...prev, newSkill]);
        setSkillName("");
        setSelectedLevel("");
        message.success("Thêm kỹ năng thành công");
        setIsSkillModalVisible(false);
      }
    } catch (error) {
      message.error(error.message || "Không thể thêm kỹ năng");
    }
  };

  // Xử lý xóa skill
  const handleDeleteSkill = (skillId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa kỹ năng này không?",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      async onOk() {
        try {
          // Xóa trong database trước
          await deleteCandidateSkill(profile.id, skillId);

          // Nếu xóa thành công trong database thì mới xóa trên giao diện
          setCandidateSkills((prevSkills) =>
            prevSkills.filter((skill) => skill.skillId !== skillId)
          );

          message.success("Xóa kỹ năng thành công");
        } catch (error) {
          console.error("Lỗi khi xóa kỹ năng:", error);
          message.error("Không thể xóa kỹ năng");
        }
      },
    });
  };

  // Thêm hàm xử lý toggle notification
  const handleToggleNotification = async (checked) => {
    try {
      // Cập nhật trạng thái trong database
      await updateAvailability(profile.id, checked);

      // Cập nhật state local
      setProfile((prev) => ({
        ...prev,
        isAvailable: checked,
      }));

      // Nếu bật thông báo, gửi ngay một email gợi ý
      if (checked) {
        await sendJobSuggestions(profile.id);
        message.success(
          "Đã bật thông báo việc làm. Bạn sẽ nhận được email gợi ý việc làm hàng ngày."
        );
      } else {
        message.success("Đã tắt thông báo việc làm");
      }
    } catch (error) {
      message.error("Không thể cập nhật trạng thái thông báo");
      console.error("Error updating notification status:", error);
    }
  };

  // Thêm hàm để cập nhật profile
  const handleUpdateProfileFromCV = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="profile-section">
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Title level={4}>{profile?.fullName || "Chưa cập nhật"}</Title>
          <Button icon={<EditOutlined />} onClick={showModal}>
            Chỉnh sửa
          </Button>
        </div>

        <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
          <Space direction="vertical" size="small">
            <Space>
              <Text type="secondary">Chức danh: </Text>
              <Text>{profile?.title || "Chưa cập nhật"}</Text>
            </Space>
            <Space>
              <Text type="secondary">Kinh nghiệm: </Text>
              <Text>
                {EXPERIENCE_LEVELS[profile?.experienceLevel] || "Chưa cập nhật"}
              </Text>
            </Space>
            <Space>
              <Text type="secondary">Cấp bậc: </Text>
              <Text>{JOB_LEVELS[profile?.jobLevel] || "Chưa cập nhật"}</Text>
            </Space>
            <Space>
              <Text type="secondary">Lĩnh vực: </Text>
              <Text>{profile?.industryName || "Chưa cập nhật"}</Text>
            </Space>
            <Space>
              <Text type="secondary">Ngành nghề: </Text>
              <Text>{profile?.professionName || "Chưa cập nhật"}</Text>
            </Space>
          </Space>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "16px",
            padding: "12px",
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <Switch
            checked={profile?.isAvailable || false}
            onChange={handleToggleNotification}
          />
          <Text>
            {profile?.isAvailable
              ? "Đang bật thông báo việc làm"
              : "Đang tắt thông báo việc làm"}
          </Text>
          <Tooltip title="Bạn sẽ nhận được email gợi ý việc làm phù hợp vào 8h sáng mỗi ngày">
            <InfoCircleOutlined style={{ color: "#1890ff" }} />
          </Tooltip>
        </div>
      </Card>

      <Modal
        title="Thông Tin Cơ Bản"
        visible={isModalVisible}
        onCancel={handleCancel}
        width={800}
        modalRender={(modal) => (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "800px",
            }}
          >
            {modal}
          </div>
        )}
        styles={{
          body: {
            maxHeight: "calc(90vh - 200px)",
            overflowY: "auto",
          },
        }}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Lưu
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            firstName: profile?.fullName?.split(" ").pop(),
            lastName: profile?.fullName?.split(" ").slice(0, -1).join(" "),
            title: profile?.title,
            jobLevel: profile?.jobLevel,
            experienceLevel: profile?.experienceLevel,
            educationLevel: profile?.educationLevel,
            location: profile?.location,
            email: profile?.email,
            phone: profile?.phone?.replace("+84", ""),
            birthDate: profile?.birthday ? dayjs(profile?.birthday) : null,
            address: profile?.address,
            gender: profile?.sex ? "male" : "female",
            maritalStatus: profile?.maritalStatus,
            jobType: profile?.jobType,
            industry: profile?.industryId,
            profession: profile?.professionId,
            expectedSalary: profile?.expectedSalary,
          }}
          onFinish={handleUpdateProfileInfo}
        >
          <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
            <div style={{ width: "200px" }}>
              <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
              >
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div>
                    {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{ display: "flex", gap: "12px", marginBottom: "16px" }}
              >
                <Form.Item
                  label={
                    <>
                      Họ <span style={{ color: "#ff4d4f" }}>*</span>
                    </>
                  }
                  name="lastName"
                  rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={
                    <>
                      Tên <span style={{ color: "#ff4d4f" }}>*</span>
                    </>
                  }
                  name="firstName"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Input />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <>
                    Chức Danh <span style={{ color: "#ff4d4f" }}>*</span>
                  </>
                }
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập chức danh" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <>
                    Cấp bậc hiện tại <span style={{ color: "#ff4d4f" }}>*</span>
                  </>
                }
                name="jobLevel"
                rules={[{ required: true, message: "Vui lòng chọn cấp bậc" }]}
              >
                <Select>
                  {Object.entries(JOB_LEVELS).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <>
                    Hình thức làm việc{" "}
                    <span style={{ color: "#ff4d4f" }}>*</span>
                  </>
                }
                name="jobType"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hình thức làm việc",
                  },
                ]}
              >
                <Select>
                  {Object.entries(JOB_TYPES).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <>
                    Bằng cấp cao nhất{" "}
                    <span style={{ color: "#ff4d4f" }}>*</span>
                  </>
                }
                name="educationLevel"
                rules={[{ required: true, message: "Vui lòng chọn bằng cấp" }]}
              >
                <Select>
                  {Object.entries(EDUCATION_LEVELS).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Form.Item
              label="Lĩnh vực"
              name="industry"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng chọn lĩnh vực" }]}
            >
              <Select
                placeholder="Chọn lĩnh vực"
                onChange={handleIndustryChange}
              >
                {industries
                  .map((industry) => ({
                    value: industry.id,
                    label:
                      !industry.description || industry.description === ""
                        ? industry.name
                        : industry.description,
                  }))
                  .map((industry) => (
                    <Select.Option key={industry.value} value={industry.value}>
                      {industry.label}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngành nghề"
              name="profession"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng chọn ngành nghề" }]}
            >
              <Select
                placeholder="Chọn ngành nghề"
                disabled={!selectedIndustry}
              >
                {professions
                  .map((profession) => ({
                    value: profession.id,
                    label:
                      !profession.description || profession.description === ""
                        ? profession.name
                        : profession.description,
                  }))
                  .map((profession) => (
                    <Select.Option
                      key={profession.value}
                      value={profession.value}
                    >
                      {profession.label}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <>
                  Kinh nghiệm làm việc{" "}
                  <span style={{ color: "#ff4d4f" }}>*</span>
                </>
              }
              name="experienceLevel"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn kinh nghiệm làm việc",
                },
              ]}
            >
              <Select placeholder="Chọn kinh nghiệm làm việc">
                {Object.entries(EXPERIENCE_LEVELS).map(([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Mức lương mong muốn" name="expectedSalary">
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              addonAfter="VNĐ"
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Tỉnh/Thành phố"
            rules={[
              { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
            ]}
          >
            <Select
              showSearch
              placeholder="Chọn tỉnh/thành phố"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {provinces.map((province) => (
                <Option key={province.code} value={province.name}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <Form.Item
              label={
                <>
                  Email <span style={{ color: "#ff4d4f" }}>*</span>
                </>
              }
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email" }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label={
                <>
                  Số điện thoại <span style={{ color: "#ff4d4f" }}>*</span>
                </>
              }
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^0\d{9}$/,
                  message: "Số điện thoại phải bắt đầu bằng số 0 và có 10 số",
                },
              ]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input
                placeholder="Nhập số điện thoại (VD: 0987654321)"
                maxLength={10}
              />
            </Form.Item>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <Form.Item
              label="Ngày sinh"
              name="birthDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày sinh!" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const birthDate = dayjs(value);
                    const today = dayjs();
                    const age = today.diff(birthDate, "year");
                    if (age < 18) {
                      return Promise.reject("Ứng viên phải từ 18 tuổi trở lên");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày sinh"
                disabledDate={(current) => {
                  return current && current > dayjs().endOf("day");
                }}
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Form.Item
              label={
                <>
                  Giới tính <span style={{ color: "#ff4d4f" }}>*</span>
                </>
              }
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Radio.Group>
                <Radio.Button value="male">Nam</Radio.Button>
                <Radio.Button value="female">Nữ</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label={
                <>
                  Tình trạng hôn nhân{" "}
                  <span style={{ color: "#ff4d4f" }}>*</span>
                </>
              }
              name="maritalStatus"
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Radio.Group>
                <Radio.Button value="single">Độc thân</Radio.Button>
                <Radio.Button value="married">Đã kết hôn</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Mục tiêu nghề nghiệp */}
      <Card
        title="Mục Tiêu Nghề Nghiệp"
        style={{ marginBottom: 24 }}
        extra={
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => setIsCareerGoalsModalVisible(true)}
          >
            Thêm mục tiêu nghề nghiệp
          </Button>
        }
      >
        <div
          dangerouslySetInnerHTML={{
            __html: profile?.description || "Chưa có mục tiêu nghề nghiệp",
          }}
        />
      </Card>

      {/* Modal Mục Tiêu Nghề Nghiệp */}
      <Modal
        title="Mục Tiêu Nghề Nghiệp"
        visible={isCareerGoalsModalVisible}
        onCancel={() => setIsCareerGoalsModalVisible(false)}
        width={800}
        modalRender={(modal) => (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "800px",
            }}
          >
            {modal}
          </div>
        )}
        styles={{
          body: {
            maxHeight: "calc(90vh - 200px)",
            overflowY: "auto",
          },
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsCareerGoalsModalVisible(false)}
          >
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateCareerGoals}>
            Lưu
          </Button>,
        ]}
      >
        <Form layout="vertical" form={careerGoalsForm}>
          <Form.Item
            label="Mục tiêu nghề nghiệp"
            name="description"
            initialValue={profile?.description}
            rules={[
              { required: true, message: "Vui lòng nhập mục tiêu nghề nghiệp" },
            ]}
          >
            <ReactQuill
              theme="snow"
              style={{ height: "300px", marginBottom: "50px" }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Kinh nghiệm làm việc */}
      <Card
        title="Kinh Nghiệm Làm Việc"
        style={{ marginBottom: 24 }}
        extra={
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingWorkHistory(null);
              workHistoryForm.resetFields();
              setIsWorkHistoryModalVisible(true);
            }}
          >
            Thêm kinh nghiệm làm việc
          </Button>
        }
      >
        {workHistory?.length > 0 ? (
          workHistory.map((work) => (
            <div
              key={work.id}
              className="experience-item"
              style={{ marginBottom: 16 }}
            >
              <Space
                align="start"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Space align="start">
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BankOutlined style={{ fontSize: 24 }} />
                  </div>
                  <Space direction="vertical">
                    <Title level={5}>{work.position}</Title>
                    <Text>{work.companyName}</Text>
                    <Text type="secondary">
                      {dayjs(work.startDate).format("MM/YYYY")} -{" "}
                      {work.isCurrentJob
                        ? "Hiện tại"
                        : dayjs(work.endDate).format("MM/YYYY")}
                    </Text>
                    <div
                      dangerouslySetInnerHTML={{ __html: work.description }}
                    />
                  </Space>
                </Space>
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditWorkHistory(work)}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteWorkHistory(work)}
                  />
                </Space>
              </Space>
            </div>
          ))
        ) : (
          <Empty description="Chưa có kinh nghiệm làm việc" />
        )}
      </Card>

      {/* Modal Thêm/Sửa Kinh Nghiệm Làm Việc */}
      <Modal
        title={
          editingWorkHistory
            ? "Sửa Kinh Nghiệm Làm Việc"
            : "Thêm Kinh Nghiệm Làm Việc"
        }
        visible={isWorkHistoryModalVisible}
        onCancel={() => {
          setIsWorkHistoryModalVisible(false);
          setEditingWorkHistory(null);
          workHistoryForm.resetFields();
        }}
        width={800}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsWorkHistoryModalVisible(false);
              setEditingWorkHistory(null);
              workHistoryForm.resetFields();
            }}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => workHistoryForm.submit()}
          >
            {editingWorkHistory ? "Cập nhật" : "Thêm"}
          </Button>,
        ]}
      >
        <Form
          form={workHistoryForm}
          layout="vertical"
          onFinish={handleSubmitWorkHistory}
        >
          <Form.Item
            label={
              <>
                Chức Danh <span style={{ color: "#ff4d4f" }}>*</span>
              </>
            }
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập chức danh" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={
              <>
                Công Ty <span style={{ color: "#ff4d4f" }}>*</span>
              </>
            }
            name="company"
            rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
          >
            <Input />
          </Form.Item>

          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <Form.Item
              label="Từ Tháng"
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
              style={{ flex: 1 }}
            >
              <DatePicker
                format="MM/YYYY"
                picker="month"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Đến Tháng"
              name="endDate"
              style={{ flex: 1 }}
              dependencies={["isCurrentJob"]}
              rules={[
                ({ getFieldValue }) => ({
                  required: !getFieldValue("isCurrentJob"),
                  message: "Vui lòng chọn ngày kết thúc",
                }),
              ]}
            >
              <DatePicker
                format="MM/YYYY"
                picker="month"
                style={{ width: "100%" }}
                disabled={workHistoryForm.getFieldValue("isCurrentJob")}
              />
            </Form.Item>
          </div>

          <Form.Item name="isCurrentJob" valuePropName="checked">
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  workHistoryForm.setFieldsValue({ endDate: null });
                }
              }}
            >
              Công Việc Hiện Tại
            </Checkbox>
          </Form.Item>

          <Form.Item
            label={
              <>
                Mô Tả <span style={{ color: "#ff4d4f" }}>*</span>
              </>
            }
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <ReactQuill
              theme="snow"
              style={{ height: "200px", marginBottom: "50px" }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Kỹ năng */}
      <Card
        title="Kỹ Năng"
        style={{ marginBottom: 24 }}
        extra={
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => setIsSkillModalVisible(true)}
            disabled={loadingAllSkills} // Disable nút thêm khi đang load danh sách skills
          >
            Thêm kỹ năng
          </Button>
        }
      >
        {loadingCandidateSkills ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin />
          </div>
        ) : (
          <Space wrap>
            {candidateSkills.length > 0 ? (
              candidateSkills.map((skill) => (
                <Tag
                  key={skill.id}
                  closable
                  onClose={(e) => {
                    // Ngăn chặn sự kiện mặc định
                    e.preventDefault();
                    handleDeleteSkill(skill.skillId);
                  }}
                  color="blue"
                >
                  {skill.skillName} (
                  {PROFICIENCY_LEVELS[skill.proficiencyLevel].label})
                </Tag>
              ))
            ) : (
              <Empty description="Chưa có kỹ năng" />
            )}
          </Space>
        )}
      </Card>

      {/* Modal Thêm Kỹ Năng */}
      <Modal
        title="Thêm Kỹ Năng"
        visible={isSkillModalVisible}
        onCancel={() => setIsSkillModalVisible(false)}
        width={800}
        modalRender={(modal) => (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "800px",
            }}
          >
            {modal}
          </div>
        )}
        styles={{
          body: {
            maxHeight: "calc(90vh - 200px)",
            overflowY: "auto",
          },
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsSkillModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
            <div style={{ flex: 2 }}>
              <div style={{ marginBottom: "8px" }}>
                <span>
                  Tên Kỹ Năng <span style={{ color: "#ff4d4f" }}>*</span>
                </span>
              </div>
              <Select
                showSearch
                style={{ width: "100%", height: "40px" }}
                placeholder="Nhập tên kỹ năng"
                value={skillName || undefined}
                onChange={(value, option) => {
                  setSkillName(value);
                  setFilteredSkills([]);
                }}
                onSearch={handleSkillInputChange}
                filterOption={false}
                notFoundContent={null}
              >
                {filteredSkills.map((skill) => (
                  <Select.Option key={skill.id} value={skill.skillName}>
                    {skill.skillName}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div style={{ flex: 2 }}>
              <div style={{ marginBottom: "8px" }}>
                <span>
                  {selectedLevel
                    ? `Mức độ thông thạo: ${PROFICIENCY_LEVELS[selectedLevel].label}`
                    : "Mức Độ Thành Thạo"}
                  <span style={{ color: "#ff4d4f" }}>*</span>
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", height: "40px" }}>
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    onClick={() => {
                      setSelectedLevel(enumValues[level]);
                    }}
                    style={{
                      flex: 1,
                      height: "40px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      backgroundColor: (() => {
                        const currentLevel =
                          {
                            BEGINNER: 1,
                            INTERMEDIATE: 2,
                            ADVANCED: 3,
                            EXPERT: 4,
                          }[selectedLevel] || 0;

                        return level <= currentLevel
                          ? PROFICIENCY_LEVELS[enumValues[level]].color
                          : PROFICIENCY_LEVELS[enumValues[level]].lightColor;
                      })(),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    {PROFICIENCY_LEVELS[enumValues[level]].icon}{" "}
                    {PROFICIENCY_LEVELS[enumValues[level]].label}
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="primary"
              style={{ height: "40px" }}
              onClick={handleAddSkill}
              disabled={!skillName || !selectedLevel}
            >
              Thêm
            </Button>
          </div>
        </div>

        <div>
          <div style={{ marginTop: 16 }}>
            <Text strong>Kỹ Năng Được Đề Xuất</Text>
            <div style={{ marginTop: 8 }}>
              {allSkills.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {allSkills
                    .slice(0, showAllSkills ? undefined : 24)
                    .map((skill) => (
                      <Tag
                        key={skill.id}
                        color="blue"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSuggestedSkillClick(skill)}
                      >
                        {skill.skillName}
                      </Tag>
                    ))}
                  {allSkills.length > 24 && (
                    <Button
                      type="link"
                      onClick={() => setShowAllSkills(!showAllSkills)}
                    >
                      {showAllSkills
                        ? "Thu gọn"
                        : `Xem thêm (${allSkills.length - 24} kỹ năng)`}
                    </Button>
                  )}
                </div>
              ) : (
                <Empty description="Không có kỹ năng để hiển thị" />
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Người tham khảo */}
      <Card
        title="Người Tham Khảo"
        style={{ marginBottom: 24 }}
        extra={
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => setIsReferenceModalVisible(true)}
          >
            Thêm người tham khảo
          </Button>
        }
      >
        <Text>Thông tin người có thể xác nhận năng lực làm việc của bạn</Text>
      </Card>

      {/* Modal Thêm Người Tham Khảo */}
      <Modal
        title="Thêm Người Tham Khảo"
        visible={isReferenceModalVisible}
        onCancel={() => setIsReferenceModalVisible(false)}
        width={800}
        modalRender={(modal) => (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "800px",
            }}
          >
            {modal}
          </div>
        )}
        styles={{
          body: {
            maxHeight: "calc(90vh - 200px)",
            overflowY: "auto",
          },
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsReferenceModalVisible(false)}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => setIsReferenceModalVisible(false)}
          >
            Lưu
          </Button>,
        ]}
      >
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "8px" }}>
              <span>
                Họ Tên <span style={{ color: "#ff4d4f" }}>*</span>
              </span>
            </div>
            <Input style={{ width: "100%" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "8px" }}>
              <span>
                Chức Danh <span style={{ color: "#ff4d4f" }}>*</span>
              </span>
            </div>
            <Input style={{ width: "100%" }} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ marginBottom: "8px" }}>
            <span>
              Công Ty <span style={{ color: "#ff4d4f" }}>*</span>
            </span>
          </div>
          <Input style={{ width: "100%" }} />
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "8px" }}>
              <span>
                Email <span style={{ color: "#ff4d4f" }}>*</span>
              </span>
            </div>
            <Input style={{ width: "100%" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "8px" }}>
              <span>Điện thoại</span>
            </div>
            <Input
              addonBefore={
                <Select defaultValue="+84" style={{ width: 80 }}>
                  <Select.Option value="+84">+84</Select.Option>
                </Select>
              }
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "8px",
            color: "#ff4d4f",
            fontSize: "12px",
            fontStyle: "italic",
          }}
        >
          * Thông tin bắt buộc
        </div>
      </Modal>

      {/* Thay thế phần CV bằng component mới */}
      <CVSection
        profile={profile}
        onUpdateProfile={handleUpdateProfileFromCV}
      />
    </div>
  );
};

export default ProfileSection;
