import Image from 'next/image'
import { cn } from '@/lib/utils'

type MlscLogoProps = {
  animated?: boolean
  light?: boolean
  className?: string
}

export function MlscLogo({ animated = false, light = false, className }: MlscLogoProps) {
  const tone = light ? 'light' : 'dark'

  return (
    <div className={cn('mlsc-logo', animated && 'mlsc-logo-animated', className)} role="img" aria-label="Microsoft Learn Student Chapter, PCCoE">
      <Image
        src={`/images/mlsc-${animated ? 'letters-' : ''}${tone}.png`}
        width={485}
        height={184}
        alt=""
        className="mlsc-lettering"
        priority
        draggable={false}
      />
      {animated && (
        <span className="mlsc-tiles" aria-hidden="true">
          <span className="mlsc-tile mlsc-tile-red" />
          <span className="mlsc-tile mlsc-tile-green" />
          <span className="mlsc-tile mlsc-tile-blue" />
          <span className="mlsc-tile mlsc-tile-yellow" />
        </span>
      )}
    </div>
  )
}
