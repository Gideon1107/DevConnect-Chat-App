import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import logo from '../assets/devconnect-logo-black.png'
import Background from "../assets/login1.png"
import Victory from "../assets/victory.svg"
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Home_Bg from '../assets/background_3.jpg'


const Auth = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [tab, setTab] = useState("login")

    const handleLogin = async () => {

    }

    const handleSignup = async () => {
        
    }


    return (

        <div className="bg-[url('../src/assets/pattern_1.jpg')] bg-cover bg-no-repeat bg-center ">
            {/* NavBar */}
            <nav className='p-4 z-50'>
                <img src={logo} alt="logo" height={200} width={200} />
            </nav>

            {/* Login/SignUp */}
            <div className="h-[calc(100vh-60px)] overflow-y-auto flex items-center justify-center ">
                <div className='bg-white bg-opacity-60 border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[80vw] rounded-xl grid xl:grid-cols-2 items-center justify-center py-2 '>
                    
                    <div className=' xl:flex justify-center items-center'>
                        <img src={Background} alt="background"  className='h-[400px] xl:h-[600px] max-sm:h-[300px]'/>
                    </div>

                    <div className='flex flex-col gap-10 items-center justify-center'>
                        <div className='flex items-center justify-center flex-col'>
                            <div className='flex items-center justify-center'>
                                <h1 className='poiret-one-regular max-sm:text-4xl text-5xl font-bold md:text-6xl pb-3 max-sm:pb-2 text-center'><span className='text-green-400 poiret-one-regular'>Connect </span>Now</h1>
                                {/* <img src={Victory} alt="" className='h-[100px] max-sm:h-[80px]' /> */}
                            </div>
                            <p className='max-sm:p-2 max-sm:text-sm font-normal text-center '>Enter your details to start connecting with developers like you!</p>
                        </div>
                        <div className='flex items-center justify-center w-full'>
                            <Tabs className='w-3/4' value={tab}>
                                <TabsList className="bg-transparent rounded-none w-full gap-2">
                                    <TabsTrigger onClick={() => setTab("login")} value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-green-500 p-3 transition-all duration-300">Login</TabsTrigger>

                                    <TabsTrigger onClick={() => setTab("signup")}value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-green-500 p-3 transition-all duration-300">Sign Up</TabsTrigger>
                                </TabsList>
                                <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                                    <Input 
                                    placeholder="Email" 
                                    type="email" 
                                    value={email}
                                    className="rounded-md p-5" 
                                    onChange={(e) => setEmail(e.target.value)}/>

                                    <Input 
                                    placeholder="Password" 
                                    type="password" 
                                    value={password}
                                    className="rounded-md p-5" 
                                    onChange={(e) => setPassword(e.target.value)}/>  

                                    <Button className="p-6 bg-green-400 text-base font-extrabold hover:bg-green-500 active:bg-green-400 " onClick={handleLogin}>LOGIN</Button>  
                                </TabsContent>
                                <TabsContent className="flex flex-col gap-5" value="signup">
                                <Input 
                                    placeholder="Email" 
                                    type="email" 
                                    value={email}
                                    className="rounded-md p-5" 
                                    onChange={(e) => setEmail(e.target.value)}/>

                                    <Input 
                                    placeholder="Password" 
                                    type="password" 
                                    value={password}
                                    className="rounded-md p-5" 
                                    onChange={(e) => setPassword(e.target.value)}/> 

                                    <Input 
                                    placeholder="Confirm Password" 
                                    type="password" 
                                    value={confirmPassword}
                                    className="rounded-md p-5" 
                                    onChange={(e) => setConfirmPassword(e.target.value)}/> 

                                    <Button className="p-6 bg-green-400 text-base font-extrabold hover:bg-green-500 active:bg-green-400" onClick={handleSignup}>SIGN UP</Button>  
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    
        
                    
                </div>
            </div>
        </div>
    )
}

export default Auth