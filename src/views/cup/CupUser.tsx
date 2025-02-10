import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Divider,
  Flex,
  List,
  Modal,
  Row,
  Typography,
} from "antd";
import type { DescriptionsProps } from "antd";
import { useImperativeHandle, useState } from "react";
import { IDetailProp } from "@/types/modal";
import { Cup } from "@/types/api";
import cupApi from "@/api/cup";
const CupUser = (props: IDetailProp) => {
  const [visible, setVisbile] = useState(false);
  const [cupData, setCupData] = useState<Cup.CupItem>();
  const [cupViewData, setCupViewData] = useState<any>();
  const [allUsers, setAllUsers] = useState<any>([]);
  const [cupUsers, setCupUsers] = useState<any>([]);

  const { Text } = Typography;

  // 暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open,
    };
  });

  const keyMap: any = {
    name: "カップ戦名",
    user_number: "参加人数",
    start_date: "開始日",
    end_date: "終了日",
  };

  // 调用弹框显示方法
  const open = (data: any) => {
    const _cup = data.cup;

    setCupData(_cup);
    setAllUsers(data.all_users);
    setCupUsers(data.cup_users);
    setVisbile(true);

    const _cupViewData: DescriptionsProps["items"] = [];
    for (let k in _cup) {
      if (["name", "user_number", "start_date", "end_date"].includes(k)) {
        _cupViewData.push({
          key: k,
          label: keyMap[k],
          children: _cup[k],
        });
      }
    }
    setCupViewData(_cupViewData);
  };

  const addCupUser = (item: any) => {
    const _cupUsers = cupUsers.filter((v: any) => v.id !== item.id);
    setCupUsers([..._cupUsers, item]);
  };
  const removeCupUser = (item: any) => {
    setCupUsers(cupUsers.filter((v: any) => v.id !== item.id));
  };

  const updateCupData = async (create_game: boolean) => {
    await cupApi.updateCupData({
      id: cupData?.id,
      users: cupUsers,
      create_game: create_game,
    });

    create_game && handleCancel();
  };

  const handleCancel = () => {
    setVisbile(false);
  };

  return (
    <Modal
      title="参加ユーザー"
      width={800}
      open={visible}
      onCancel={handleCancel}
      footer={[]}
    >
      <Descriptions items={cupViewData} />
      <Divider />
      <div
        style={{ height: "500px", overflowY: "scroll", overflowX: "hidden" }}
      >
        <Row gutter={120}>
          <Col span={12}>
            <Text type="secondary">ユーザー一覧</Text>
            <List
              itemLayout="horizontal"
              dataSource={allUsers}
              renderItem={(item: any) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    addCupUser(item);
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.head_image_url} />}
                    title={item.nickname}
                    description={item.phone}
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col span={12}>
            <Text type="secondary">参加ユーザー</Text>
            <List
              itemLayout="horizontal"
              dataSource={cupUsers}
              renderItem={(item: any, key: number) => (
                <>
                  <List.Item
                    style={{ cursor: "pointer", border: 'none' }}
                    onClick={() => {
                      removeCupUser(item);
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.head_image_url} />}
                      title={item.nickname}
                      description={item.phone}
                    />
                  </List.Item>
                  {key % 2 ? <Divider /> : ''}
                </>
              )}
            />
          </Col>
        </Row>
      </div>
      <Divider />
      <Flex gap="small" justify="flex-end">
        <Button
          type="primary"
          onClick={() => {
            updateCupData(false);
          }}
        >
          確認する
        </Button>
        <Button
          type="primary"
          onClick={() => {
            updateCupData(true);
          }}
        >
          確認して試合を作成する
        </Button>
      </Flex>
    </Modal>
  );
};

export default CupUser;
