export default function Docs({ params }:{
    params :{
        slug : string[]
    }
}){
    if(params.slug?.length == 2){
        return <>
        <div>
            Viewing {params.slug[0]} Page and Final :  {params.slug[1]}  Path
        </div>
        </>
    }
    else if(params.slug?.length == 1){
        return <>
        <div>
        Viewing {params.slug[0]}  Paths
        </div>
        </>
    } else{
        return (
            <>
            <div>
           Default Page
            </div>
            </>
        )
    }
}