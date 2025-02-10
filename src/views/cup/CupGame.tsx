import {
  Avatar,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Switch,
  Tag,
  Timeline,
  Typography,
} from "antd";
import SearchForm from "@/components/SearchForm";
import { useEffect, useState } from "react";
import cupApi from "@/api/cup";
import dayjs from "dayjs";
export default function CupGame() {
  const { Title, Text } = Typography;
  const [form] = Form.useForm();
  const [cupGames, setCupGames] = useState<any>([]);
  const [gameStatus, setGameStatus] = useState<any>({});

  useEffect(() => {
    getCupGames();
  }, []);

  const getCupGames = async (params?: { name: string }) => {
    const _cupGames = await cupApi.getCupGames(params);
    setCupGames(_cupGames);

    const _gameStatus: any = {};
    _cupGames.forEach((item: any) => {
      item.games.forEach((game: any) => {
        _gameStatus[game.id] = game.status;
      });
    });
    setGameStatus(_gameStatus);
  };

  const searchCup = () => {
    getCupGames({ ...form.getFieldsValue() });
  };

  const updateCupGame = async (params: {
    id: number;
    home_goal?: any;
    away_goal?: any;
    home_goal_penalty?: any;
    away_goal_penalty?: any;
    game_time?: any;
    status?: any;
  }) => {
    await cupApi.updateCupGame(params);
  };

  return (
    <div>
      <SearchForm
        form={form}
        submit={searchCup}
        reset={() => {
          form.resetFields();
          getCupGames();
        }}
      >
        <Form.Item name="name" label="カップ戦名">
          <Input placeholder="カップ戦名を入力してください。" />
        </Form.Item>
      </SearchForm>
      <div className="base-table">
        <div className="header-wrapper">
          <div className="title">カップ戦日程</div>
        </div>
        <Timeline
          style={{ padding: "20px" }}
          items={cupGames.map((item: any) => {
            return {
              children: (
                <>
                  <Tag color="success">第{item.round}回</Tag>
                  <Flex wrap gap="middle" style={{ marginTop: "12px" }}>
                    {item.games.map((game: any) => {
                      return (
                        <Card
                          key={game.id}
                          size="small"
                          title={
                            <DatePicker
                              disabled={gameStatus[game.id] === 1}
                              allowClear={false}
                              size="small"
                              showTime
                              defaultValue={dayjs(game.game_time)}
                              onChange={(_, dateString) =>
                                updateCupGame({
                                  id: game.id,
                                  game_time: dateString,
                                })
                              }
                            />
                          }
                          extra={
                            <Switch
                              size="small"
                              defaultValue={game.status === 1}
                              onChange={(checked) => {
                                setGameStatus({
                                  ...gameStatus,
                                  [game.id]: checked ? 1 : 0,
                                });
                                updateCupGame({
                                  id: game.id,
                                  status: checked ? 1 : 0,
                                });
                              }}
                            />
                          }
                          style={{ width: 300 }}
                        >
                          <Row gutter={8}>
                            <Col
                              className="gutter-row"
                              span={6}
                              style={{ textAlign: "center" }}
                            >
                              <Space direction="vertical" align="center">
                                <Avatar
                                  shape="square"
                                  size={50}
                                  src={game.head_image_home}
                                />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {game.nickname_home}
                                </Text>
                              </Space>
                            </Col>
                            <Col className="gutter-row" span={5}>
                              <Space direction="vertical" align="center">
                                <InputNumber
                                  disabled={gameStatus[game.id] === 1}
                                  controls={false}
                                  style={{
                                    width: "50px",
                                    height: "38px",
                                    fontSize: "18px",
                                  }}
                                  min={0}
                                  max={20}
                                  defaultValue={game.home_goal}
                                  onBlur={(e) =>
                                    updateCupGame({
                                      id: game.id,
                                      home_goal: e.target.value,
                                    })
                                  }
                                />
                                <InputNumber
                                  disabled={gameStatus[game.id] === 1}
                                  controls={false}
                                  style={{
                                    width: "50px",
                                    height: "38px",
                                    fontSize: "18px",
                                  }}
                                  min={0}
                                  max={20}
                                  defaultValue={game.home_goal_penalty}
                                  onBlur={(e) =>
                                    updateCupGame({
                                      id: game.id,
                                      home_goal_penalty: e.target.value,
                                    })
                                  }
                                />
                              </Space>
                            </Col>
                            <Col className="gutter-row" span={2}>
                              <Space direction="vertical" align="center">
                                <Title
                                  style={{ textAlign: "center" }}
                                  level={3}
                                >
                                  -
                                </Title>
                                <Text type="secondary">PK</Text>
                              </Space>
                            </Col>
                            <Col className="gutter-row" span={5}>
                              <Space direction="vertical" align="center">
                                <InputNumber
                                  disabled={gameStatus[game.id] === 1}
                                  controls={false}
                                  style={{
                                    width: "50px",
                                    height: "38px",
                                    fontSize: "18px",
                                  }}
                                  min={0}
                                  max={20}
                                  defaultValue={game.away_goal}
                                  onBlur={(e) =>
                                    updateCupGame({
                                      id: game.id,
                                      away_goal: e.target.value,
                                    })
                                  }
                                />
                                <InputNumber
                                  disabled={gameStatus[game.id] === 1}
                                  controls={false}
                                  style={{
                                    width: "50px",
                                    height: "38px",
                                    fontSize: "18px",
                                  }}
                                  min={0}
                                  max={20}
                                  defaultValue={game.away_goal_penalty}
                                  onBlur={(e) =>
                                    updateCupGame({
                                      id: game.id,
                                      away_goal_penalty: e.target.value,
                                    })
                                  }
                                />
                              </Space>
                            </Col>
                            <Col
                              className="gutter-row"
                              span={6}
                              style={{ textAlign: "center" }}
                            >
                              <Space direction="vertical" align="center">
                                <Avatar
                                  shape="square"
                                  size={50}
                                  src={game.head_image_away}
                                />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {game.nickname_away}
                                </Text>
                              </Space>
                            </Col>
                          </Row>
                        </Card>
                      );
                    })}
                  </Flex>
                </>
              ),
            };
          })}
        />
      </div>
    </div>
  );
}
