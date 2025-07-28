import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "../layouts"

const Dashboard = ()=>{

    const navigate = useNavigate()

    const openAllForms = () =>{
        navigate('/forms');
    }

    
   const formDetails = [{ id: "",
           title: "Form A",
           description: `Lorem ipsum dolor sit amet,consectetur adipisicing elit. Dignissimos vitae commodi fugit in porro,assumenda adipisci repellat ea natus dicta voluptate tempora. Odit et saepe laborum ratione esse,eos facere!` ,
           lastUpdated: "3",
           responses: "15",
           color: "red"
       },
       { id: "", title: "Form Q", description: "", lastUpdated: "1", responses: 5, color: "blue" },
       { id: "", title: "Form U", description: "", lastUpdated: "4", responses: 12, color: "violet" },
       { id: "", title: "Form P", description: "", lastUpdated: "14", responses: 20, color: "green" },
       { id: "", title: "Form H", description: "", lastUpdated: "14", responses: 20,color: "yellow" },
       { id: "", title: "Form D", description: "", lastUpdated: "14", responses: 20, color: "indigo" },
       ]

        const sortedForm=[...formDetails].sort((a,b)=>(
            a.lastUpdated-b.lastUpdated
        ))

        const getColorClass = (color) =>{
        const mapColor = {
            'gray': 'text-gray-500',
            'red': 'text-red-500',
            'blue': 'text-blue-500',
            'green': 'text-green-500',
            'yellow': 'text-yellow-500',
            'violet': 'text-violet-500',
            'pink': 'text-pink-500',
            'indigo': 'text-indigo-500'
        }

        return mapColor[color] || 'text-gray-500'
    }

    return(
        <DashboardLayout
            pageName={'Dashboard'}
        >
            <div className="grid md:grid-cols-3 gap-6 w-full pb-3">
                <div className="bg-white rounded-xl outline-1 outline-gray-200 shadow-sm p-6">
                    <div className="w-full pb-2 space-y-1.5">
                        <h1 className="text-sm tracking-tight font-medium">Total Forms</h1>
                    </div>
                    <div className="pt-0">
                        <span className="text-3xl font-bold">3</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl outline-1 outline-gray-200 shadow-sm p-6">
                    <div className="w-full pb-2 space-y-1.5">
                        <h1 className="text-sm tracking-tight font-medium">Total Responses</h1>
                    </div>
                    <div className="pt-0">
                        <span className="text-3xl font-bold">103</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl outline-1 outline-gray-200 shadow-sm p-6">
                    <div className="w-full pb-2 space-y-1.5">
                        <h1 className="text-sm tracking-tight font-medium">Top Performing Form</h1>
                    </div>
                    <div className="pt-0">
                        <span className="text-3xl font-bold">My Form</span>
                    </div>
                </div>
            </div>
            <div className="bg-white w-full mt-6 rounded-xl outline-1 outline-gray-200 shadow-sm box-border">
                <div className="w-full p-6">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-semibold mb-0.5">
                            Recent Forms
                        </h1>
                        <button
                        onClick={() => openAllForms()}
                        className="flex items-center text-sm text-black/50 font-semibold hover:text-black hover:cursor-pointer hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors duration-200 ease-in-out">
                            View All
                            <i className='bx bx-chevron-right text-xl'></i>
                        </button>
                    </div>
                    <div className="text-black/50 text-sm">
                        Overview of your forms' performance
                    </div>
                </div>
                
                <div className="flex flex-col px-6 pb-6">
                    {formDetails.length && (
                        sortedForm.map((formDetail, index) => {
                            return(
                                <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-xl hover:cursor-pointer hover:bg-gray-50 hover:translate-x-1 transition-all duration-350 ease-in-out">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex justify-center items-center bg-gray-100 rounded-full p-2`}>
                                            <i className={`bx bx-file text-xl ${getColorClass(formDetail.color)}`}></i>
                                        </div>
                                    <div>
                                        <h1 className="text-lg font-semibold">{formDetail.title}</h1>
                                        <h1 className="text-sm text-black/50">{formDetail.responses} responses</h1>
                                    </div>
                                    </div>
                                    <button
                                onClick={() => {}}
                                className={`w-7 h-7 inline-flex justify-center items-center rounded-lg hover:bg-gray-100 cursor-pointer group`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 group-hover:stroke-red-500 transition-colors">
                                    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>
                                </svg>
                            </button>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {formDetails.length && (
                        sortedForm.map((formDetail,index)=>{
                            return(
                                <FormCard
                                    key={index}
                                    title={formDetail.title}
                                    description={formDetail.description}
                                    lastUpdated={formDetail.lastUpdated}
                                    responses={formDetail.responses}
                                    formID={formDetail.id}
                                />
                            )
                        })
                    )}
                </div> */}
            </div>
        </DashboardLayout>
    )
}

export default Dashboard