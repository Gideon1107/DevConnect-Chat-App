

const ConfirmDelete = ({isModalOpen, title, body, buttonText, onConfirm, onCancel}) => {

    return (
        <div className={`fixed inset-0 bg-transparent backdrop-blur-[2px] flex items-center justify-center z-[9999] duration-300 transition-transform ${isModalOpen ? "scale-100" : "scale-0"}`}>
            <div className={`bg-slate-800 p-4 rounded-tr-xl rounded-bl-xl w-[80vw] max-w-sm sm:border border-slate-700 flex flex-col gap-5  shadow-2xl ` }>
                <h3 className="text-base  text-center text-gray-200 font-bold">{title}</h3>
                <p className="text-sm text-gray-500 text-center">{body} This action cannot be undone. </p>
                <div className="flex gap-4 items-center justify-center">

                    <button className="p-2 px-8 bg-slate-700 rounded-tr-md rounded-bl-md font-medium text-sm"
                    onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button className="p-2 px-6 bg-red-700 rounded-tr-md rounded-bl-md font-medium text-sm"
                    onClick={onConfirm}
                    >
                       {buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDelete