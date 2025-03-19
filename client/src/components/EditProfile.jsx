import { RxCross1 } from "react-icons/rx";
import { useAppStore } from "@/store/store";
import { GrEdit } from "react-icons/gr";



const EditProfile = ({ isOpen, handleIsOpen }) => {

    const { user, setUser } = useAppStore();

    if (!isOpen) {
        return
    }


    return (


        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-slate-900 p-4 rounded-xl w-full max-w-2xl border border-slate-800 flex flex-col gap-20">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl">Profile</h1>
                    <button onClick={handleIsOpen}>
                      <RxCross1 />
                    </button>
                </div>

                <div className="flex flex-row justify-around ">
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <img src={user.profilePicture} alt="avatar" className="w-[150px] rounded-full" />
                        <div className="space-x-4 flex items-center">
                            <button className="p-3 " title="Change avatar">
                                <GrEdit size={20} className="text-slate-200"/>
                            </button>
                            <button className="p-3" title="Delete avatar">
                                <RxCross1 size={22} className="text-red-400"/>
                            </button>
                        </div>
                    </div>
                    <div>
                        <form action="" className="flex flex-col gap-6 w-60">
                            {/* Username Field */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="">Username</label>
                                <input type="text" className="flex-1 pl-3 p-2 text-slate-900 focus:outline-none rounded-[5px]" defaultValue={user.username}/>
                            </div>

                            {/* Email field */}
                            <div className="flex flex-col gap-2" >
                                <label htmlFor="">Email</label>
                                <input type="text" className="flex-1 pl-3 p-2 text-slate-900 focus:outline-none rounded-[5px] cursor-not-allowed"
                                value={user.email}
                                disabled
                                />
                            </div>

                            <button className="p-4 bg-slate-700 rounded-[5px]">Save Changes</button>

                        </form>
                    </div>
                </div>


                {/* Change Password */}

                <a href="" className="font-light text-sm underline leading-normal">Click here to Change Password</a>

            </div>
        </div>
    );
}

export default EditProfile