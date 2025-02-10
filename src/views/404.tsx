import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
function NotFound() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/')
  }
  return (
    <Result
      status={404}
      title='404'
      subTitle='申し訳ありませんが、アクセスしたページは存在しません。'
      extra={
        <Button type='primary' onClick={handleClick}>
          ホームに戻る
        </Button>
      }
    />
  )
}

export default NotFound
