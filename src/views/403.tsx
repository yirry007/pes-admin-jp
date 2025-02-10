import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
function NotFound() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/')
  }
  return (
    <Result
      status={403}
      title='403'
      subTitle='申し訳ありませんが、現在このページにアクセスする権限がありません。'
      extra={
        <Button type='primary' onClick={handleClick}>
          ホームに戻る
        </Button>
      }
    />
  )
}

export default NotFound
