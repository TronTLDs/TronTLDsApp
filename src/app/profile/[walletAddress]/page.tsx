import Image from 'next/image';

interface DomainCardProps {
  domain: string
}

const DomainCard: React.FC<DomainCardProps> = ({ domain }) => (
  <div className="bg-[#2a3b2a] rounded-lg p-4 flex items-center space-x-4">
    <Image
      src="/placeholder.svg?height=48&width=48"
      alt="Avatar"
      width={48}
      height={48}
      className="rounded-full"
    />
    <div>
      <h3 className="text-white font-semibold">{domain}</h3>
      <p className="text-gray-300 text-sm">Domain details</p>
    </div>
  </div>
)

export default function DomainManager() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-[#A8F981] text-2xl font-medium mb-4">TLD</h2>
          <DomainCard domain="spiderman.base" />
        </section>

        <section>
          <h2 className="text-[#A8F981] text-2xl font-medium mb-4">Domain</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DomainCard domain="spiderman.base" />
            <DomainCard domain="spiderman.base" />
            <DomainCard domain="spiderman.base" />
          </div>
        </section>
      </div>
    </div>
  )
}