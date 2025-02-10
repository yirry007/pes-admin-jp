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
import leagueApi from "@/api/league";
import dayjs from "dayjs";
export default function LeagueGame() {
  const { Title, Text } = Typography;
  const [form] = Form.useForm();
  const [leagueGames, setLeagueGames] = useState<any>([]);
  const [gameStatus, setGameStatus] = useState<any>({});

  useEffect(() => {
    getLeagueGames();
  }, []);

  const getLeagueGames = async (params?: { name: string }) => {
    const _leagueGames = await leagueApi.getLeagueGames(params);
    setLeagueGames(_leagueGames);

    const _gameStatus: any = {};
    _leagueGames.forEach((item: any) => {
      item.games.forEach((game: any) => {
        _gameStatus[game.id] = game.status;
      });
    });
    setGameStatus(_gameStatus);
  };

  const searchLeague = () => {
    getLeagueGames({ ...form.getFieldsValue() });
  };

  const updateLeagueGame = async (params: {
    id: number;
    home_goal?: any;
    away_goal?: any;
    game_time?: any;
    status?: any;
  }) => {
    await leagueApi.updateLeagueGame(params);
  };

  return (
    <div>
      <SearchForm
        form={form}
        submit={searchLeague}
        reset={() => {
          form.resetFields();
          getLeagueGames();
        }}
      >
        <Form.Item name="name" label="リーグ名">
          <Input placeholder="リーグ名を入力してください。" />
        </Form.Item>
      </SearchForm>
      <div className="base-table">
        <div className="header-wrapper">
          <div className="title">リーグ日程</div>
        </div>
        <Timeline
          style={{ padding: "20px" }}
          items={leagueGames.map((item: any) => {
            return {
              children: (
                <>
                  <Tag color="success">{item.date}</Tag>
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
                                updateLeagueGame({
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
                                updateLeagueGame({
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
                              <InputNumber
                                disabled={gameStatus[game.id] === 1}
                                controls={false}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  fontSize: "24px",
                                }}
                                min={0}
                                max={20}
                                defaultValue={game.home_goal}
                                onBlur={(e) =>
                                  updateLeagueGame({
                                    id: game.id,
                                    home_goal: e.target.value,
                                  })
                                }
                              />
                            </Col>
                            <Col className="gutter-row" span={2}>
                              <Title style={{ textAlign: "center" }} level={2}>
                                -
                              </Title>
                            </Col>
                            <Col className="gutter-row" span={5}>
                              <InputNumber
                                disabled={gameStatus[game.id] === 1}
                                controls={false}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  fontSize: "24px",
                                }}
                                min={0}
                                max={20}
                                defaultValue={game.away_goal}
                                onBlur={(e) =>
                                  updateLeagueGame({
                                    id: game.id,
                                    away_goal: e.target.value,
                                  })
                                }
                              />
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
