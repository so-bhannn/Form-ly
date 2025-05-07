import { 
    FormCard,
    CustomSelect,
    Button,
 } from "../components";
import {
    DashboardLayout
} from "../layouts"
import { useState } from "react";

const AllForms = () => {
    const [formDetails, setFormDetails] = useState([{ id: "",
        title: "Form A",
        description: `Lorem ipsum dolor sit amet,consectetur adipisicing elit. Dignissimos vitae commodi fugit in porro,assumenda adipisci repellat ea natus dicta voluptate tempora. Odit et saepe laborum ratione esse,eos facere!` ,
        lastUpdated: "3",
        responses: "15" },
    { id: "", title: "Form Q", description: "", lastUpdated: "1", responses: 5 },
    { id: "", title: "Form U", description: "", lastUpdated: "4", responses: 12 },
    { id: "", title: "Form P", description: "", lastUpdated: "14", responses: 20 },
    { id: "", title: "Form H", description: "", lastUpdated: "14", responses: 20 },
    { id: "", title: "Form D", description: "", lastUpdated: "14", responses: 20 },
    ])

    const sortOptions = [
        { value: "recent", text: "Most Recent" },
        { value: "responses", text: "Most Responses" },
        { value: "alpha", text: "Alphabetical" }
    ];

    const handleSortChange = (value) => {
        const setForm = [...formDetails].sort((a,b)=>{
            if(value==='recent')
                return a.lastUpdated-b.lastUpdated
            else if(value==='responses')
                return b.responses-a.responses
            else if(value==='alpha')
                return a.title.localeCompare(b.title)
            return 0
        })
        setFormDetails(setForm)
    };

    return(
        <DashboardLayout>
            <div className="flex flex-wrap justify-between w-full pb-3.5">
                <h1 className="text-4xl font-bold mb-2 md:mb-0">My Forms</h1>
                <Button
                    icon='bx bx-plus'
                    content='Create Form'
                />
            </div>
            <div className="w-full flex justify-between items-center mb-6">
                <CustomSelect
                    options={sortOptions}
                    defaultValue={sortOptions[0]}
                    onChange={handleSortChange}
                    label="Sort by"
                    icon='sort'
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {formDetails && (
                    formDetails.map((formDetail, index)=>{
                        return(
                        <FormCard
                            key={index}
                            title={formDetail.title}
                            description={formDetail.description}
                            formID={formDetail.id}
                            lastUpdated={formDetail.lastUpdated}
                            responses={formDetail.responses}
                        />
                    )                
                    })
                )}
            </div>

        </DashboardLayout>
    )
}

export default AllForms