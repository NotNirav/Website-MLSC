import Image from 'next/image'
import { MlscLogo } from '@/components/mlsc-logo'

export function TheaterScene({ replayKey }: { replayKey: number }) {
  return (
    <div className="theater-scene" aria-hidden="true">
      <div className="room-space">
        <Image
          src="/images/cinema-room.webp"
          width={1024}
          height={640}
          alt=""
          className="room-image"
          priority
          sizes="100vw"
          draggable={false}
        />
        <div className="screen-halo" />
        <div className="cinema-screen">
          <div className="screen-light" />
          <div className="screen-texture" />
          <div className="projection" key={replayKey}>
            <MlscLogo animated light />
            <p className="screen-caption">Learn. Build. Belong.</p>
          </div>
          <div className="screen-glint" />
        </div>
        <div className="room-light-spill" />
      </div>
      <div className="cinema-vignette" />
      <div className="cinema-grain" />
    </div>
  )
}
