import styles from "./index.module.less";
import type { CalendarProps } from "antd";
import { Calendar, Tag } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import api from "@/api/schedule";
import { CrownOutlined, TrophyOutlined } from "@ant-design/icons";
export default function Welcome() {
  const [currentYearMonth, setCurrentYearMonth] = useState(dayjs());
  const [games, setGames] = useState<any>([]);
  const [leagueCup, setLeagueCup] = useState<any>([]);

  useEffect(() => {
    getSchedule({
      year: currentYearMonth.format("YYYY"),
      month: currentYearMonth.format("MM"),
    });
  }, []);

  const getSchedule = async (param: { year: any; month: any }) => {
    const data: any = await api.getSchedule(param);
    setGames(data.games);
    setLeagueCup(data.league_cup);
  };

  const resetCurrentYearMonth = async (current: Dayjs) => {
    const _year = current.format("YYYY");
    const _month = current.format("MM");
    const currentYear = currentYearMonth.format("YYYY");
    const currentMonth = currentYearMonth.format("MM");

    if (_year === currentYear && _month === currentMonth) return;

    await getSchedule({ year: _year, month: _month });

    setCurrentYearMonth(current);
  };

  const monthCellRender = (value: Dayjs) => {
    const listData = leagueCup[value.format("YYYY-MM")] || [];
    return (
      <ul className="events">
        {listData.map((item: any) => (
          <li key={item.index} style={{ margin: "4px 0" }}>
            {item.game_mode ? (
              <Tag icon={<CrownOutlined />} color="warning">
                {item.name}&nbsp;{item.start_date}
              </Tag>
            ) : (
              <Tag icon={<TrophyOutlined />} color="success">
                {item.name}&nbsp;{item.start_date}
              </Tag>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = games[value.format("YYYY-MM-DD")] || [];
    return (
      <ul className="events">
        {listData.map((item: any) => (
          <li key={item.index} style={{ margin: "6px 0" }}>
            {item.league_id ? (
              <Tag icon={<CrownOutlined />} color="warning">
                {item.time}&nbsp;{item.league_name}
                <br />
                {item.nickname_home}&nbsp;
                {item.status === 1
                  ? item.home_goal + " - " + item.away_goal
                  : "-"}
                &nbsp;{item.nickname_away}
              </Tag>
            ) : (
              <Tag icon={<TrophyOutlined />} color="success">
                {item.time}&nbsp;{item.cup_name}
                <br />
                {item.nickname_home}&nbsp;
                {item.status === 1
                  ? item.home_goal + " - " + item.away_goal
                  : "-"}
                &nbsp;{item.nickname_away}
              </Tag>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <div className={styles.schedule}>
      <Calendar cellRender={cellRender} onChange={resetCurrentYearMonth} />
    </div>
  );
}
