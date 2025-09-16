export default function FeatureCard({ title, subtitle }) {
  return (
    <div className="glass rounded-lg p-4">
      <div className="badge mb-2">{subtitle}</div>
      <div className="font-medium text-gray-900">{title}</div>
    </div>
  )
}
