import { Avatar, Card, Drawer, Descriptions, Divider } from "antd";
import type { DescriptionsProps } from "antd";
import { useImperativeHandle, useState } from "react";
import { IAction, IModalProp } from "@/types/modal";
import { Player } from "@/types/api";
const Detail = (props: IModalProp<Player.PlayerItem>) => {
  const [visible, setVisbile] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<Player.PlayerItem>();
  const [playerData, setPlayerData] = useState<DescriptionsProps["items"]>([]);

  // 暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open,
    };
  });

  // 调用弹框显示方法
  const open = (type: IAction, data: any) => {
    console.log(type);
    setPlayerInfo(data);
    setVisbile(true);

    const _playerData: DescriptionsProps["items"] = [];
    for (let k in data) {
        if (['id', 'user_id', 'code', 'name', 'headimg', 'nation_abbr', 'point', 'images', 'status', 'image_url', 'nation_image'].includes(k)) continue;
        if (k === 'data') {
            for (let k1 in data[k]) {
                _playerData.push({
                    key: k1,
                    label: k1,
                    children: <div style={{width: '100%', textAlign: 'right'}}>{data[k][k1]}</div>,
                    span: 3,
                });
            }
            continue;
        }

        _playerData.push({
            key: k,
            label: k,
            children: <div style={{width: '100%', textAlign: 'right'}}>{data[k]}</div>,
            span: 3,
        });
    }
    setPlayerData(_playerData)
  };

  return (
    <Drawer title="選手資料" onClose={() => setVisbile(false)} open={visible}>
      <Card>
        <Card.Meta
          avatar={<Avatar src={playerInfo?.image_url} size={60} />}
          title={playerInfo?.name_en}
          description={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <img width={24} src={playerInfo?.nation_image} alt="" />
              <p style={{ marginLeft: "10px" }}>{playerInfo?.nation}</p>
            </div>
          }
        />
      </Card>
      <Divider />
      <Descriptions title={false} items={playerData} />
    </Drawer>
  );
};

export default Detail;
