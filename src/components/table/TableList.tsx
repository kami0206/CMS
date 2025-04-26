import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Pagination,
  Tag,
  Dropdown,
  Button,
  Input,
  Space,
  Modal,
} from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useListing } from "@/hooks/useListing";
import {
  deleteEmployee,
  deleteMultipleEmployees,
} from "@/services/satffservices";

type TableListProps = {
  columns: any[];
  paginationFullWidth: boolean;
  getListService: (searchParams: any) => Promise<{
    data: any[];
    totalRecords: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }>;
  defaultSearchParams?: any;
  onSelectedRowsChange?: (selectedRows: any[]) => void;
  onSearch?: (value: string) => void;
  onAddNew?: () => void;
  onFilter?: () => void;
  onDeleteSelected?: (selectedRows: any[]) => void; // New prop for delete functionality
};

const TableList: React.FC<TableListProps> = ({
  columns,
  getListService,
  defaultSearchParams = {},
  onSelectedRowsChange,
  onSearch,
  onAddNew,
  onFilter,
  paginationFullWidth,
  // Deletion handler passed as a prop
}) => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // Track selected row keys

  // Sử dụng useListing để quản lý dữ liệu
  const {
    data,
    totalRecords,
    page,
    pageSize,
    isLoading,
    searchParams,
    setSearchParams,
    handleGetList,
  } = useListing({
    defaultSearchParams,
    getListService,
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      if (onSelectedRowsChange) {
        onSelectedRowsChange(selectedRows);
      }
    },
  };

  const enhanceColumns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 30,
      render: (_: any, __: any, index: number) =>
        (page - 1) * pageSize + index + 1,
    },
    ...columns.map((col) => {
      if (col.dataIndex === "status") {
        return {
          ...col,
          render: (status: string) => {
            const isActive = status === "active";
            return (
              <Tag color={isActive ? "green" : "red"}>
                {isActive ? "Hoạt động" : "Ngừng hoạt động"}
              </Tag>
            );
          },
        };
      }

      if (col.dataIndex === "actions") {
        return {
          ...col,
          fixed: "right",
          render: (_: any, record: any) => (
            <Dropdown
              getPopupContainer={() => document.body}
              menu={{
                items: [
                  {
                    key: "edit",
                    label: "Chỉnh sửa",
                    icon: <EditOutlined />,
                    onClick: () => navigate(`/edit/${record.id}`),
                  },
                  {
                    key: "delete",
                    label: "Xóa",
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleDeleteSingle(record), // Handle single delete
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Button icon={<EllipsisOutlined />} />
            </Dropdown>
          ),
        };
      }

      return col;
    }),
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setSearchParams((prev: any) => ({
      ...prev,
      page,
      pageSize,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onSearch) {
      onSearch(value);
    }
    setSearchParams((prev: any) => ({
      ...prev,
      search: value,
    }));
  };

  const handleDeleteSingle = (record: any) => {
    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa mục: ${record.name}?`,
      icon: <DeleteOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await deleteEmployee(record.id);
          console.log("Xóa thành công");
          await handleGetList(); // Fetch lại danh sách
        } catch (error) {
          console.error("Lỗi khi xóa:", error);
          throw error; // Ném lỗi để Modal không tự đóng nếu có lỗi
        }
      },
    });
  };

  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      alert("Vui lòng chọn ít nhất một mục để xóa.");
      return;
    }

    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} mục?`,
      icon: <DeleteOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          const payload = selectedRowKeys.map((key) => ({ id: String(key) }));
          await deleteMultipleEmployees(payload);
          console.log("Xóa thành công các mục đã chọn");
          await handleGetList();
          setSelectedRowKeys([]);
        } catch (error) {
          console.error("Lỗi khi xóa:", error);
          throw error; // Nếu lỗi thì Modal sẽ không tự đóng
        }
      },
    });
  };

  useEffect(() => {
    handleGetList();
  }, [searchParams]);

  return (
    <div className="flex flex-col flex-grow">
      {/* Bộ lọc, Tìm kiếm, Thêm mới, Xóa đã chọn */}
      <div className="flex justify-end items-center py-3 gap-3 mb-4">
        {/* Delete button */}
        {selectedRowKeys.length > 0 && (
          <Button
            type="primary"
            danger
            size="large"
            icon={<DeleteOutlined />}
            onClick={handleDeleteSelected} // Trigger delete for selected rows
            className="flex items-center"
          >
            Xóa đã chọn ({selectedRowKeys.length})
          </Button>
        )}

        <div className="flex items-center gap-3">
          <Space>
            <Button
              icon={<FilterOutlined />}
              onClick={onFilter}
              size="large"
              className="flex items-center"
            >
              Bộ lọc
            </Button>
            <Input
              placeholder="Tìm kiếm"
              onChange={handleSearchChange}
              prefix={<SearchOutlined />}
              size="large"
              className="w-64"
            />
          </Space>
          <Button
            type="primary"
            danger
            size="large"
            icon={<PlusOutlined />}
            onClick={onAddNew}
            className="flex items-center"
          >
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="p-4 bg-white rounded-md shadow-sm overflow-x-auto flex-grow">
          <Table
            rowKey="id"
            columns={enhanceColumns}
            dataSource={data}
            rowSelection={rowSelection}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </div>
      )}

      {/* Phân trang */}
      {!isLoading && (
        <div
          className={`${
            paginationFullWidth
              ? "absolute bottom-0 left-0 right-0 bg-white shadow-md p-4 z-10"
              : "p-4 bg-white border-t border-gray-200"
          }`}
        >
          <div
            className={`${
              paginationFullWidth ? "max-w-screen-xl mx-auto" : "w-full"
            } flex flex-wrap justify-between items-center text-sm`}
          >
            <div className="font-semibold text-gray-500">
              Hiển thị từ
              <span className="mx-1 text-black">
                {(page - 1) * pageSize + 1}
              </span>
              đến
              <span className="mx-1 text-black">
                {Math.min(page * pageSize, totalRecords)}
              </span>
              của
              <span className="mx-1 text-black">{totalRecords}</span> kết quả
            </div>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={totalRecords}
              showSizeChanger
              pageSizeOptions={["5", "10", "15"]}
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableList;
