// components/ProfileImage.tsx
type Props = {
  alt: string
  className?: string
  bust?: number
}

export default function ProfileImage({ alt, className, bust }: Props) {
  const v = bust ?? Date.now()
  return <img src={`/api/asset/profile?v=${v}`} alt={alt} className={className} />
}
