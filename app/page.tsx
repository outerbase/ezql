import Header from '../components/Header'
import ChatInterface from '../components/ChatInterface'
import Footer from '../components/Footer'

// Config options should be exported at the page level
export const dynamic = 'force-static'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <Header />
      <ChatInterface />
      {/* Footer only shows on landing */}
    </div>
  )
} 