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
import { League } from "@/types/api";
import leagueApi from '@/api/league'
const LeagueUser = (props: IDetailProp) => {
  const [visible, setVisbile] = useState(false);
  const [leagueData, setLeagueData] = useState<League.LeagueItem>();
  const [leagueViewData, setLeagueViewData] = useState<any>();
  const [allUsers, setAllUsers] = useState<any>([]);
  const [leagueUsers, setLeagueUsers] = useState<any>([]);

  const { Text } = Typography;

  // 暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open,
    };
  });

  const keyMap: any = {
    name: "リーグ名",
    user_number: "参加人数",
    game_mode: "リーグ形式",
    start_date: "開始日",
    end_date: "終了日",
  };

  // 调用弹框显示方法
  const open = (data: any) => {
    const _league = data.league;

    setLeagueData(_league);
    setAllUsers(data.all_users);
    setLeagueUsers(data.league_users);
    setVisbile(true);

    const _leagueViewData: DescriptionsProps["items"] = [];
    for (let k in _league) {
      if (
        ["name", "user_number", "start_date", "end_date"].includes(
          k
        )
      ) {
        _leagueViewData.push({
          key: k,
          label: keyMap[k],
          children: _league[k],
        });
      }
      if (k === "game_mode") {
        _leagueViewData.push({
          key: k,
          label: keyMap[k],
          children: _league[k] === 1 ? '一回': 'ホーム・アウェイ',
        });
      }
    }
    setLeagueViewData(_leagueViewData);
  };

  const addLeagueUser = (item: any) => {
    const _leagueUsers = leagueUsers.filter((v: any) => v.id !== item.id)
    setLeagueUsers([..._leagueUsers, item])
  }
  const removeLeagueUser = (item: any) => {
    setLeagueUsers(leagueUsers.filter((v: any) => v.id !== item.id))
  }

  const updateLeagueData = async (create_game: boolean) => {
    await leagueApi.updateLeagueData({id: leagueData?.id, users: leagueUsers, create_game: create_game});

    create_game && handleCancel()
  }

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
      <Descriptions items={leagueViewData} />
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
                <List.Item style={{cursor: 'pointer'}} onClick={() => {addLeagueUser(item)}}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.head_image_url}
                      />
                    }
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
              dataSource={leagueUsers}
              renderItem={(item: any) => (
                <List.Item style={{cursor: 'pointer'}} onClick={() => {removeLeagueUser(item)}}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.head_image_url}
                      />
                    }
                    title={item.nickname}
                    description={item.phone}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
      <Divider />
      <Flex gap="small" justify="flex-end">
        <Button type="primary" onClick={() => {updateLeagueData(false)}}>確認する</Button>
        <Button type="primary" onClick={() => {updateLeagueData(true)}}>確認して試合を作成する</Button>
      </Flex>
    </Modal>
  );
};

export default LeagueUser;
