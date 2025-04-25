import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import TableList from "@/components/table/TableList";
import { getEmployees } from "@/services/satffservices";
import { useNavigate } from "react-router-dom";

const StaffPage = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "code",
      render: (text: string) => (
        <a className="text-blue-600 font-medium hover:underline">{text}</a>
      ),
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
      dataIndex: "position",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
    },
  ];

  return (
    <Layout>
      <Content className="p-6 relative min-h-screen">
        <div className="bg-white rounded mb-16">
          
          <TableList
            columns={columns}
            getListService={getEmployees}
            defaultSearchParams={{ page: 1, pageSize: 10 }} 
            onAddNew={() => navigate("/create")} 
            onFilter={() => console.log("Filter clicked")}
            onSearch={(value) => console.log('/Search:', value)}
            onSelectedRowsChange={(rows) =>
              console.log("Selected rows:", rows)
            }
            paginationFullWidth={true} 
          />
        </div>
      </Content>
    </Layout>
  );
};

export default StaffPage;