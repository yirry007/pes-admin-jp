import { Form, Space, Button } from 'antd'
/**
 * 搜索表单容器组件封装
 * @param props
 * @returns
 */
export default function SearchForm(props: any) {
  return (
    <Form className='search-form' form={props.form} layout='inline' initialValues={props.initialValues}>
      {props.children}
      <Form.Item>
        <Space>
          <Button type='primary' onClick={props.submit}>
            検索
          </Button>
          <Button type='default' onClick={props.reset}>
            リセット
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
