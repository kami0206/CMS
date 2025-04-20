import React from "react";
import { Layout, Table, Button, Dropdown, Menu, Tag, Input } from "antd";
import {
  EllipsisOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Content } = Layout;

interface Employee {
  key: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  gender: string;
  status: "active" | "inactive";
}

const employees: Employee[] = [
  {
    key: "1",
    id: "E001",
    name: "Nguyễn Văn Nam",
    phone: "+84901234567",
    email: "nguyenvannam@example.com",
    role: "Quản trị viên",
    gender: "Nam",
    status: "active",
  },
  {
    key: "2",
    id: "E002",
    name: "Trần Thị Mai",
    phone: "+84987654321",
    email: "tranthimai@example.com",
    role: "Thành viên",
    gender: "Nữ",
    status: "active",
  },
  {
    key: "3",
    id: "E003",
    name: "Lê Minh Phúc",
    phone: "+84881223344",
    email: "leminhphuc@example.com",
    role: "Nhân viên bán hàng",
    gender: "Khác",
    status: "inactive",
  },
];

const StaffPage: React.FC = () => {
  const handleMenuClick = (key: string, record: Employee) => {
    if (key === "edit") {
      console.log("Edit:", record);
    } else if (key === "delete") {
      console.log("Delete:", record);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Mã nhân viên",
      dataIndex: "id",
      render: (id: string) => <a className="text-blue-600 font-medium">{id}</a>,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
    },
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
    <Content className="p-6 bg-gray-50 min-h-screen">
      {/* Responsive Header */}
      <div className="flex flex-wrap justify-end mb-4 w-full px-4 gap-3">
        <Button
          size="large"
          icon={<FilterOutlined />}
          className="px-4 py-2 h-auto text-sm md:text-base"
        >
          Bộ lọc
        </Button>
        <Input.Search
          placeholder="Tìm kiếm"
          allowClear
          className="w-full md:max-w-xs flex-1 h-auto"
          size="large"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="px-4 py-2 h-auto text-sm md:text-base"
          size="large"
        >
          Thêm mới
        </Button>
      </div>

      {/* Table */}
      <div className="p-4 bg-white rounded-md shadow-sm overflow-x-auto">
        <Table
          dataSource={employees}
          columns={columns}
          pagination={false}
          rowSelection={{}}
          className="employee-table"
          scroll={{ x: "max-content" }} // Kích hoạt cuộn ngang
        />
      </div>
    </Content>
    
  );
};

export default StaffPage;
