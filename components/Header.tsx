import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Image 
            src="/ezql.svg" 
            alt="EZQL Logo" 
            width={20} 
            height={20}
            priority
          />
          <span className="font-medium text-sm">EZQL</span>
        </div>
        <span className="text-gray-600 text-sm">Chat with your database.</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm">Github</span>
        <Link 
          href="https://github.com/login" 
          className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Sign in
        </Link>
      </div>
    </header>
  )
} 