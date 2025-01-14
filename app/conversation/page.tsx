import Header from '../../components/Header'
import ChatInterface from '../../components/ChatInterface'

export const dynamic = 'force-static'

export default function ConversationPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <ChatInterface />
    </div>
  )
} 