

const AwaitingAccountVerification = () => {
  return (
    <div className="flex h-[50dvh] justify-center items-center bg-slate-900 flex-col gap-5 p-6">
        <div className="rounded-full border-t-2 border-b-2 border-blue-400 w-10 h-10 animate-spin">
        </div>
        <p className="text-white font-light sm:text-base text-sm sm:max-w-96">Activation link has been sent to your email. Please check your inbox and click on the link to activate your account.</p>
    </div>
  )
}

export default AwaitingAccountVerification