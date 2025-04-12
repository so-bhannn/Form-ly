import { FormCard } from "../components"
import { DashboardLayout } from "../layouts"

const Dashboard = ()=>{
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
            <FormCard
                title="My Form"
                description="This is my first form on Formly. I'm very much excited after using this wonderful application. Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus modi qui sit, quod fuga incidunt ex aut perspiciatis corrupti, rem natus blanditiis accusamus officiis veritatis eos! Aut sapiente inventore ducimus? Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus modi qui sit, quod fuga incidunt ex aut perspiciatis corrupti, rem natus blanditiis accusamus officiis veritatis eos! Aut sapiente inventore ducimus?"
                responses={10}
                lastUpdated={3}
            />
        </DashboardLayout>
    )
}

export default Dashboard