import { FormCard } from "../components"
import { DashboardLayout } from "../layouts"

const Dashboard = ()=>{

    const formDetails=[{ id: "",
            title: "Form A",
            description: `Lorem ipsum dolor sit amet,consectetur adipisicing elit. Dignissimos vitae commodi fugit in porro,assumenda adipisci repellat ea natus dicta voluptate tempora. Odit et saepe laborum ratione esse,eos facere!` ,
            lastUpdated: "3",
            responses: "15" },
        { id: "", title: "Form Q", description: "", lastUpdated: "1", responses: 5 },
        { id: "", title: "Form U", description: "", lastUpdated: "4", responses: 12 },
        { id: "", title: "Form P", description: "", lastUpdated: "14", responses: 20 },
        { id: "", title: "Form H", description: "", lastUpdated: "14", responses: 20 },
        { id: "", title: "Form D", description: "", lastUpdated: "14", responses: 20 },
        ]

        const sortedForm=[...formDetails].sort((a,b)=>(
            a.lastUpdated-b.lastUpdated
        ))

    return(
        <DashboardLayout
            pageTitle='Dashboard'
        >
            <div className="grid md:grid-cols-3 gap-6 w-full pb-3">
                <div className="rounded-lg outline-1 outline-gray-200 shadow-sm p-6">
                    <div className="w-full pb-2 space-y-1.5">
                        <h1 className="text-sm tracking-tight font-medium">Total Forms</h1>
                    </div>
                    <div className="pt-0">
                        <span className="text-3xl font-bold">3</span>
                    </div>
                </div>
                <div className="rounded-lg outline-1 outline-gray-200 shadow-sm p-6">
                    <div className="w-full pb-2 space-y-1.5">
                        <h1 className="text-sm tracking-tight font-medium">Total Responses</h1>
                    </div>
                    <div className="pt-0">
                        <span className="text-3xl font-bold">103</span>
                    </div>
                </div>
                <div className="rounded-lg outline-1 outline-gray-200 shadow-sm p-6">
                    <div className="w-full pb-2 space-y-1.5">
                        <h1 className="text-sm tracking-tight font-medium">Top Performing Card</h1>
                    </div>
                    <div className="pt-0">
                        <span className="text-3xl font-bold">My Form</span>
                    </div>
                </div>
            </div>
            <span className="w-full text-2xl font-bold py-5">
                Recent Forms
            </span>
            <div className="grid grid-cols-2 gap-6 w-full">
                {formDetails.length && (
                    sortedForm.map((formDetail)=>{
                        return(
                            <FormCard
                                title={formDetail.title}
                                description={formDetail.description}
                                lastUpdated={formDetail.lastUpdated}
                                responses={formDetail.responses}
                                formID={formDetail.id}
                            />
                        )
                    })
                )}
            </div>
        </DashboardLayout>
    )
}

export default Dashboard