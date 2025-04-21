import Lottie from 'react-lottie';
import animation from '../../assets/animation.json'

const animationData = {
    loop: true,
    autoplay: true,
    animationData: animation
}

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:flex md:flex-col gap-4 bg-slate-900/50 justify-center items-center duration-1000 transition-all hidden">
        <Lottie
          isClickToPauseDisabled={true}
          height={150}
          width={150}
          options={animationData}
          speed={0.5}
        />

        <div>
            <h3 className='font-light'>Select a chat to start messaging</h3>
        </div>
    </div>
  )
}

export default EmptyChatContainer