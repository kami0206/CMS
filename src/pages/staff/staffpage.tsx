import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Button,
  Dropdown,
  Menu,
  Tag,
  Input,
  Spin,
  Alert,
  Modal,
  notification,
  Pagination,
  Flex,
} from "antd";
import {
  EllipsisOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import useFetch from "@/services/useFetch";
import EmployeeForm from "@/components/actionhandlers/create";
import EmployeeEditForm from "@/components/actionhandlers/edit";
import Api from "@/services/api";

const { Content, Footer } = Layout;

interface Employee {
  staffId: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  gender: string;
  status: string;
}

const StaffPage: React.FC = () => {
  const { data, error } = useFetch<Employee[]>("/staff");
  const [loading, setLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
  }, [data]);

  const handleMenuClick = (key: string, record: Employee) => {
    if (key === "edit") {
      setIsEditModalVisible(true);
      setEmployeeToEdit(record);
    } else if (key === "delete") {
      setEmployeeToDelete(record);
      setIsModalVisible(true);
    }
  };

  const handleDelete = async () => {
    if (employeeToDelete) {
      try {
        await Api.delete(`/staff/${employeeToDelete.staffId}`);
        setEmployees(employees.filter((emp) => emp.staffId !== employeeToDelete.staffId));
        setIsModalVisible(false);
        notification.success({
          message: "Thành công",
          description: `Nhân viên ${employeeToDelete.name} đã được xóa!`,
        });
      } catch {
        notification.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra khi xóa nhân viên. Vui lòng thử lại!",
        });
      }
    }
  };

  const handleEditSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await Api.put(`/staff/${employeeToEdit?.staffId}`, values);
      const updatedEmployee = response.data;
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.staffId === updatedEmployee.id ? updatedEmployee : emp
        )
      );
      setIsEditModalVisible(false);
      notification.success({
        message: "Thành công",
        description: "Cập nhật thông tin nhân viên thành công!",
      });
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật thông tin!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = async () => {
    setIsCreateModalVisible(false);
    try {
      const response = await Api.get("/staff");
      setEmployees(response.data);
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải lại danh sách nhân viên sau khi tạo mới!",
      });
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (_: unknown, __: unknown, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    { title: "Mã nhân viên", dataIndex: "staffId" },
    { title: "Tên nhân viên", dataIndex: "name" },
    { title: "Số điện thoại", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    { title: "Chức vụ", dataIndex: "role" },
    { title: "Giới tính", dataIndex: "gender" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) =>
        status === "active" ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ngừng</Tag>
        ),
    },
    {
      title: "Thao tác",
      render: (_: unknown, record: Employee) => {
        const menu = (
          <Menu onClick={({ key }) => handleMenuClick(key, record)}>
            <Menu.Item key="edit" icon={<EditOutlined />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
              Xóa
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Content className="p-6 bg-gray-50 flex-grow flex flex-col">
        <div className="flex flex-wrap justify-end mb-4 w-full px-4 gap-3">
          <Button
            size="large"
            icon={<FilterOutlined />}
            className="px-4 py-2 h-auto"
          >
            Bộ lọc
          </Button>
          <Input.Search
            placeholder="Tìm kiếm"
            allowClear
            size="large"
            className="w-full md:max-w-xs flex-1"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="px-4 py-2 h-auto"
            onClick={() => setIsCreateModalVisible(true)}
          >
            Thêm mới
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert
            type="error"
            message="Lỗi khi tải dữ liệu"
            description={error}
            showIcon
          />
        ) : (
          <div className="p-4 bg-white rounded-md shadow-sm overflow-x-auto flex-grow">
            <Table
              rowSelection={{}}
              dataSource={employees.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              columns={columns}
              pagination={false}
              scroll={{ x: "max-content" }}
            />
          </div>
        )}

        {/* Footer phân trang */}
      </Content>
      <Footer
        className="bg-white "
       
      >
        <Flex
          align="center"
          wrap="wrap"
          className="w-full justify-center gap-x-4 gap-y-2 sm:justify-between"
        >
          <div className="font-semibold text-gray-500">
            Hiển thị từ
            <span className="mx-1 text-black">
              {(currentPage - 1) * pageSize + 1}
            </span>
            đến
            <span className="mx-1 text-black">
              {Math.min(currentPage * pageSize, employees.length)}
            </span>
            của
            <span className="mx-1 text-black">{employees.length}</span> kết quả
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={employees.length}
            showSizeChanger
            pageSizeOptions={[5, 10, 15]}
            onChange={(page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            }}
          />
        </Flex>
      </Footer>
      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa nhân viên{" "}
          <strong>{employeeToDelete?.name}</strong>?
        </p>
      </Modal>

      {/* Modal tạo nhân viên */}
      <Modal
        title="Thêm nhân viên mới"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <EmployeeForm onSuccess={handleCreateSuccess} />
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa thông tin nhân viên"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <EmployeeEditForm
          initialValues={employeeToEdit}
          onSuccess={handleEditSubmit}
        />
      </Modal>
    </Layout>
  );
};

export default StaffPage;
