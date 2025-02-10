import { Modal, Form, Input, Select, Upload } from "antd";
import type { SelectProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useImperativeHandle, useState } from "react";
import storage from "@/utils/storage";
import { message } from "@/utils/AntdGlobal";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { IAction, IModalProp } from "@/types/modal";
import { User } from "@/types/api";
import api from "@/api/user";
const UserForm = (props: IModalProp) => {
  const [form] = Form.useForm();
  const [visible, setVisbile] = useState(false);
  const [action, setAction] = useState<IAction>("create");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);

  const options: SelectProps['options'] = [];

  // 暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open,
    };
  });

  // 调用弹框显示方法
  const open = (type: IAction, data?: User.UserItem) => {
    setAction(type);
    setVisbile(true);
    if (type === "edit" && data) {
      form.setFieldsValue(data);
      setImg(data.head_image_url);
    }
  };

  const handleSubmit = async () => {
    const valid = await form.validateFields();

    if (valid) {
      const params = {
        ...form.getFieldsValue(),
        head_image_url: img,
      };
      if (action === "create") {
        await api.createUser(params);
      } else {
        await api.editUser(params);
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
      title={action === "create" ? "ユーザー追加" : "ユーザー編集"}
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
          label="電話番号"
          name="phone"
          rules={[
            { required: true, len: 11, message: "11桁の携帯電話番号を入力してください" },
            { pattern: /1[1-9]\d{9}/, message: "1から始まる11桁の携帯電話番号を入力してください" },
          ]}
        >
          <Input type="number" placeholder="電話番号を入力してください。"></Input>
        </Form.Item>
        <Form.Item
          label="名前"
          name="nickname"
          rules={[
            { required: true, message: "名前を入力してください。" },
            { min: 2, max: 12, message: "名前は最小5文字、最大12文字です" },
          ]}
        >
          <Input placeholder="名前を入力してください。"></Input>
        </Form.Item>
        <Form.Item label="ラベル" name="tags">
          <Select
            mode="tags"
            style={{ width: "100%" }}
            onChange={handleChange}
            tokenSeparators={[","]}
            options={options}
          />
        </Form.Item>
        <Form.Item label="ユーザー画像">
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
              <img src={img} style={{ width: "100%", borderRadius: "100%" }} />
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

export default UserForm;
