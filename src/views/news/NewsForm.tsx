import { Modal, Form, Input, Upload, Radio, InputNumber } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useImperativeHandle, useState } from "react";
import storage from "@/utils/storage";
import { message } from "@/utils/AntdGlobal";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { IAction, IModalProp } from "@/types/modal";
import { News } from "@/types/api";
import api from "@/api/news";
const NewsForm = (props: IModalProp<News.NewsItem>) => {
  const [form] = Form.useForm();
  const [visible, setVisbile] = useState(false);
  const [action, setAction] = useState<IAction>("create");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);

  // 暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open,
    };
  });

  // 调用弹框显示方法
  const open = (type: IAction, data?: News.NewsItem) => {
    setAction(type);
    setVisbile(true);
    if (type === "create") {
      form.setFieldsValue({ is_banner: 0, sort: 9, is_use: 1 });
    }
    if (type === "edit" && data) {
      form.setFieldsValue(data);
      setImg(data.image);
    }
  };

  const handleSubmit = async () => {
    const valid = await form.validateFields();

    if (valid) {
      const params = {
        ...form.getFieldsValue(),
        image: img,
      };
      if (action === "create") {
        await api.createNews(params);
      } else {
        await api.editNews(params);
      }
      handleCancel();
      props.update();
    }
  };
  const handleCancel = () => {
    setVisbile(false);
    setImg("");
    form.resetFields();
  };

  // 上传之前，接口处理
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("pngまたはjpeg形式の画像のみアップロードできます");
      return false;
    }
    const isLt500K = file.size / 1024 / 1024 < 0.5;
    if (!isLt500K) {
      message.error("画像は500Kを超えることができません");
    }
    return isJpgOrPng && isLt500K;
  };

  // 上传后，图片处理
  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file?.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file?.status === "done") {
      setLoading(false);
      const { code, result, message } = info.file.response;
      if (code === '') {
        setImg(result);
      } else {
        message.error(message);
      }
    } else if (info.file.status === "error") {
      message.error("サーバー異常です。少し後で再試行してください");
    }
  };
  return (
    <Modal
      title={action === "create" ? "ニュース追加" : "ニュース編集"}
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
        <Form.Item name="is_banner" label="横幅にする">
          <Radio.Group>
            <Radio value={1}>横幅</Radio>
            <Radio value={0}>一般</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="タイトル"
          name="title"
          rules={[
            { required: true, message: "タイトルを入力してください。" },
          ]}
        >
          <Input placeholder="タイトルを入力してください。"></Input>
        </Form.Item>
        <Form.Item name="subject" label="概要">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="リンクURL" name="url">
          <Input placeholder="リンクURLを入力してください。"></Input>
        </Form.Item>
        <Form.Item
          label="ソート"
          name="sort"
        >
          <InputNumber placeholder="ソートを入力してください。"></InputNumber>
        </Form.Item>
        <Form.Item name="is_use" label="使用する">
          <Radio.Group>
            <Radio value={1}>使用する</Radio>
            <Radio value={0}>使用禁止</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="画像">
          <Upload
            listType="picture-card"
            showUploadList={false}
            headers={{
              Authorization: "Bearer " + storage.get("token").access_token,
            }}
            action="/api/admin/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {img ? (
              <img src={img} style={{ width: "100%" }} />
            ) : (
              <div>
                {loading ? (
                  <LoadingOutlined rev={undefined} />
                ) : (
                  <PlusOutlined rev={undefined} />
                )}
                <div style={{ marginTop: 5 }}>画像をアップロードする</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewsForm;
