import { Table, Form, Input, Avatar, Typography } from "antd";
import { useEffect, useState } from "react";
import leagueApi from "@/api/league";
import SearchForm from "@/components/SearchForm";
import { UserOutlined } from "@ant-design/icons";
export default function LeagueRanking() {
  const [form] = Form.useForm();
  const [leagueRanking, setLeagueRanking] = useState<any>([]);

  const { Text } = Typography;

  useEffect(() => {
    getLeagueRanking();
  }, []);

  const getLeagueRanking = async (params?: { name: string }) => {
    const _leagueRanking = await leagueApi.getLeagueRanking(params);
    setLeagueRanking(_leagueRanking);
  };

  const searchLeague = () => {
    getLeagueRanking({ ...form.getFieldsValue() });
  };

  const getRowClassName = (_: any/*, index: number*/) => {
    // 根据条件判断是否需要变色

    // if (index === 0) {
    //   return "ranking-first";
    // } else if (index === 1) {
    //   return "ranking-second";
    // } else if (index === 2) {
    //   return "ranking-third";
    // } else {
    //   return "ranking-other";
    // }

    return "ranking-other";
  };

  const columns: any = [
    {
      title: "順位",
      dataIndex: "ranking",
      key: "ranking",
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
      width: 100,
    },
    {
      title: "回数",
      dataIndex: "games",
      key: "games",
      width: 40,
      render(record: string) {
        return <Text strong style={{fontSize: 16}}>{record}</Text>
      }
    },
    {
      title: "勝",
      dataIndex: "win",
      key: "win",
      width: 40,
      render(record: string) {
        return <Text strong style={{fontSize: 16}}>{record}</Text>
      }
    },
    {
      title: "分",
      dataIndex: "draw",
      key: "draw",
      width: 40,
      render(record: string) {
        return <Text strong style={{fontSize: 16}}>{record}</Text>
      }
    },
    {
      title: "負",
      dataIndex: "lose",
      key: "lose",
      width: 40,
      render(record: string) {
        return <Text strong style={{fontSize: 16}}>{record}</Text>
      }
    },
    {
      title: "得点",
      dataIndex: "goal",
      key: "goal",
      width: 40,
      render(record: string) {
        return <Text strong style={{fontSize: 16}}>{record}</Text>
      }
    },
    {
      title: "失点",
      dataIndex: "conceded",
      key: "conceded",
      width: 40,
      render(record: string) {
        return <Text strong style={{fontSize: 16}}>{record}</Text>
      }
    },
    {
      title: "勝点",
      dataIndex: "score",
      key: "score",
      width: 40,
      render(record: string) {
        return <Text strong style={{fontSize: 16}}>{record}</Text>
      }
    },
  ];
  return (
    <div>
      <SearchForm
        form={form}
        submit={searchLeague}
        reset={() => {
          form.resetFields();
          getLeagueRanking();
        }}
      >
        <Form.Item name="name" label="リーグ名">
          <Input placeholder="リーグ名を入力してください。" />
        </Form.Item>
      </SearchForm>
      <div className="base-table">
        <div className="header-wrapper">
          <div className="title">リーグ順位</div>
        </div>
        <Table
          bordered
          rowKey="id"
          rowClassName={getRowClassName}
          columns={columns}
          dataSource={leagueRanking}
          pagination={false}
        />
      </div>
    </div>
  );
}
