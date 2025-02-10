import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import { useImperativeHandle, useState } from "react";
import { IAction, IModalProp } from "@/types/modal";
import { Cup } from "@/types/api";
import api from "@/api/cup";
import dayjs from "dayjs";
const CupForm = (props: IModalProp<Cup.CupItem>) => {
  const [form] = Form.useForm();
  const [visible, setVisbile] = useState(false);
  const [action, setAction] = useState<IAction>("create");

  const { RangePicker } = DatePicker;
  const rangeConfig = {
    rules: [{ type: 'array' as const, required: true, message: '日付を選択してください' }],
  };

  // 暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open,
    };
  });

  // 调用弹框显示方法
  const open = (type: IAction, data?: Cup.CupItem) => {
    setAction(type);
    setVisbile(true);
    if (type === "create") {
      form.setFieldsValue({ game_mode: 1 });
    }
    if (type === "edit" && data) {
      const gameDate = [
        dayjs(data.start_date),
        dayjs(data.end_date)
      ];
      form.setFieldsValue({...data, game_date: gameDate});
    }
  };

  const handleSubmit = async () => {
    const valid = await form.validateFields();

    if (valid) {
      const params = {
        ...form.getFieldsValue(),
      };
      params['start_date'] = dayjs(params.game_date[0]).format('YYYY-MM-DD');
      params['end_date'] = dayjs(params.game_date[1]).format('YYYY-MM-DD');
      delete params['game_date'];

      if (action === "create") {
        await api.createCup(params);
      } else {
        await api.editCup(params);
      }
      handleCancel();
      props.update();
    }
  };
  const handleCancel = () => {
    setVisbile(false);
    form.resetFields();
  };

  return (
    <Modal
      title={action === "create" ? "カップ戦追加" : "カップ戦編集"}
      okText="確認する"
      cancelText="中止する"
      width={800}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign="right">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="カップ戦名"
          name="name"
          rules={[{ required: true, message: "カップ戦名を入力してください。" }]}
        >
          <Input placeholder="カップ戦名を入力してください。"></Input>
        </Form.Item>
        <Form.Item
          label="参加人数"
          name="user_number"
          rules={[{ required: true, message: "参加人数を入力してください。" }]}
        >
          <InputNumber placeholder="参加人数を入力してください。"></InputNumber>
        </Form.Item>
        <Form.Item name="game_date" label="試合日程" {...rangeConfig}>
          <RangePicker />
        </Form.Item>
        <Form.Item name="memo" label="備考">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CupForm;
