import React, { useState, useEffect, useMemo } from "react";
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
} from "antd";
import {
  EllipsisOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import useFetch from "@/services/useFetch";
import {
  fetchEmployees,
  deleteEmployee,
  updateEmployee,
} from "@/services/staffApi";
import EmployeeForm from "@/components/actionhandlers/create";
import EmployeeEditForm from "@/components/actionhandlers/edit";
import { Employee } from "@/types/employeetype";
const { Content, Footer } = Layout;

const StaffPage: React.FC = () => {
  const { data, error, loading } = useFetch<Employee[]>("/staff"); // Using the custom hook here
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
      if (selectedRowKeys.length > 1) {
        // Nếu đang chọn nhiều checkbox → xóa tất cả
        setEmployeeToDelete(null); // Reset nhân viên riêng lẻ
        setIsModalVisible(true);
      } else {
        // Nếu không chọn nhiều → chỉ xóa nhân viên được bấm
        setEmployeeToDelete(record);
        setIsModalVisible(true);
      }
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedKeys);
    },
  };
  const handleDelete = async () => {
    try {
      if (selectedRowKeys.length > 1) {
        // Xóa nhiều
        const promises = selectedRowKeys.map((id) =>
          deleteEmployee(id as string)
        );
        await Promise.all(promises);
        setEmployees((prev) =>
          prev.filter((emp) => !selectedRowKeys.includes(emp.id))
        );
        setSelectedRowKeys([]);
        notification.success({
          message: "Thành công",
          description: `Đã xóa ${selectedRowKeys.length} nhân viên.`,
        });
      } else if (employeeToDelete) {
        // Xóa 1
        await deleteEmployee(employeeToDelete.id);
        setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
        notification.success({
          message: "Thành công",
          description: `Nhân viên ${employeeToDelete.name} đã được xóa!`,
        });
      }
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xóa. Vui lòng thử lại!",
      });
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (employeeToEdit) {
      try {
        const updatedEmployee = await updateEmployee(employeeToEdit.id, values); // Using the service function
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.id === updatedEmployee.id ? updatedEmployee : emp
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
      }
    }
  };

  const handleCreateSuccess = async () => {
    setIsCreateModalVisible(false);
    try {
      const newEmployees = await fetchEmployees(); // Fetch updated employee list
      setEmployees(newEmployees);
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải lại danh sách nhân viên sau khi tạo mới!",
      });
    }
  };

  const columns = useMemo(
    () => [
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
            <Tag color="red">Ngừng hoạt động</Tag>
          ),
      },
      {
        title: "Thao tác",
        fixed: "right" as "left" | "right",
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
    ],
    [currentPage, pageSize]
  );
  return (
    <Layout className="">
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
              rowKey="id"
              rowSelection={rowSelection}
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
      <Footer className="bg-white ">
        <div className="w-full flex justify-between items-center">
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
        </div>
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
        {selectedRowKeys.length > 1 ? (
          <p>
            Bạn có chắc chắn muốn xóa <strong>{selectedRowKeys.length}</strong>{" "}
            nhân viên đã chọn?
          </p>
        ) : (
          <p>
            Bạn có chắc chắn muốn xóa nhân viên{" "}
            <strong>{employeeToDelete?.name}</strong>?
          </p>
        )}
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
