import { Table, Form, Input, Avatar, Typography } from "antd";
import { useEffect, useState } from "react";
import cupApi from "@/api/cup";
import SearchForm from "@/components/SearchForm";
import { UserOutlined } from "@ant-design/icons";
export default function CupRanking() {
  const [form] = Form.useForm();
  const [cupRanking, setCupRanking] = useState<any>([]);

  const { Text } = Typography;

  useEffect(() => {
    getCupRanking();
  }, []);

  const getCupRanking = async (params?: { name: string }) => {
    const _cupRanking = await cupApi.getCupRanking(params);
    setCupRanking(_cupRanking);
  };

  const searchCup = () => {
    getCupRanking({ ...form.getFieldsValue() });
  };

  const columns: any = [
    {
      title: "番号",
      dataIndex: "index",
      key: "index",
      width: 40,
      render: (_: any, __: any, index: number) => `${index + 1}`,
    },
    {
      title: "画像",
      dataIndex: "head_image_url",
      key: "head_image_url",
      width: 80,
      render(record: string) {
        return record ? (
          <Avatar shape="square" size={48} src={record} />
        ) : (
          <Avatar shape="square" size={48} icon={<UserOutlined />} />
        );
      },
    },
    {
      title: "氏名",
      dataIndex: "nickname",
      key: "nickname",
      width: 160,
    },
    {
      title: "回数",
      dataIndex: "round",
      key: "round",
      width: 80,
      render(record: string) {
        return <Text strong style={{fontSize: 16}}>{record}</Text>
      }
    },
    {
      title: "得点",
      dataIndex: "goal",
      key: "goal",
      width: 80,
      render(record: string) {
        return <Text strong style={{fontSize: 16}}>{record}</Text>
      }
    },
    {
      title: "失点",
      dataIndex: "conceded",
      key: "conceded",
      width: 80,
      render(record: string) {
        return <Text strong style={{fontSize: 16}}>{record}</Text>
      }
    },
  ];
  return (
    <div>
      <SearchForm
        form={form}
        submit={searchCup}
        reset={() => {
          form.resetFields();
          getCupRanking();
        }}
      >
        <Form.Item name="name" label="カップ戦名">
          <Input placeholder="カップ戦名を入力してください。" />
        </Form.Item>
      </SearchForm>
      <div className="base-table">
        <div className="header-wrapper">
          <div className="title">カップ戦順位</div>
        </div>
        <Table
          bordered
          rowKey="id"
          columns={columns}
          dataSource={cupRanking}
          pagination={false}
        />
      </div>
    </div>
  );
}
