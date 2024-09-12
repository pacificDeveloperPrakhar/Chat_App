export default async function ImageExtractor(imageObjs){
    return await Promise.all(
        Object.values(imageObjs).map(async(objs)=>{
            const img=await objs()
            return img.default
        })
    )
}
// this is to import the images dynamically that is only when it is being rendered on to the screen