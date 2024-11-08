import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import logo from '../assets/devconnect-high-resolution-logo-transparent.png'
import Background from "../assets/login2.png"
import Victory from "../assets/victory.svg"

const Auth = () => {
    return (

        <>
            {/* NavBar */}
            <nav className='p-4'>
                <img src={logo} alt="logo" height={180} width={180} />
            </nav>

            {/* Login/SignUp */}
            <div className="h-[calc(100vh-56px)] flex items-center justify-center">
                <div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-xl grid xl:grid-cols-2 '>
                    <div className='flex flex-col gap-10 items-center justify-center'>
                        <div className='flex items-center justify-center flex-col'>
                            <div className='flex items-center justify-center'>
                                <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
                                <img src={Victory} alt="" className='h-[100px]' />
                            </div>
                            <p className='font-medium text-center'>Enter your details to start connecting with developers like you!</p>
                        </div>
                        <div className='flex items-center justify-center w-full'>
                            <Tabs className='w-3/4'>
                                <TabsList className="bg-transparent rounded-none w-full gap-2">
                                    <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-green-500 p-3 transition-all duration-300">Login</TabsTrigger>
                                    <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-green-500 p-3 transition-all duration-300">Sign Up</TabsTrigger>
                                </TabsList>
                                <TabsContent className="" value="login"></TabsContent>
                                <TabsContent className="" value="signup"></TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth