import { useEffect } from "react";
import { 
    FormCard,
    CustomSelect,
 } from "../components";
import {
    DashboardLayout
} from "../layouts"
import {useForms} from '../hooks'

const AllForms = () => {
    const {forms, setForms, isLoading, error, fetchForms} = useForms()
    
    useEffect(()=>{
        fetchForms()
    },[fetchForms])

    const sortOptions = [
        { value: "recent", text: "Most Recent" },
        { value: "responses", text: "Most Responses" },
        { value: "alpha", text: "Alphabetical" }
    ];

    const handleSortChange = (value) => {
        const sortedForms = [...forms].sort((a,b)=>{
            if(value==='recent')
                return new Date(b.updated_at)- new Date(a.updated_at)
            else if(value==='responses')
                return b.responses-a.responses
            else if(value==='alpha')
                return a.title.localeCompare(b.title)
            return 0
        })
        setForms(sortedForms)
    };

    return(
        <DashboardLayout
            pageName={'My Forms'}
        >
            {isLoading && (
                <div>
                    Loading...
                </div>
            )}
            {!isLoading && (
                <div className="w-full">
                {forms && forms.length>0 && (
                    <div>
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
                            {forms.map((formDetail)=>{
                                return(
                                <FormCard
                                    key={formDetail.form_id}
                                    title={formDetail.title}
                                    description={formDetail.description}
                                    accentColor={formDetail.accentColor}
                                    formID={formDetail.form_id}
                                    lastUpdated={formDetail.lastUpdated}
                                    responses={formDetail.responses}
                                />
                                )
                            })}
                        </div>
                    </div>)}
                    {error && (
                        <h1 className={'text-red-500'}>{error}</h1>
                    )}
                    {!error && (!forms || forms.length ===0) && (
                        <div className="w-full">
                            <h1 className="text-center text-md text-black/60 ">No Forms to view</h1>
                        </div>
                    )}
                </div>
                )
            }
        </DashboardLayout>
    )
}

export default AllForms