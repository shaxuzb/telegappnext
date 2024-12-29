import React from 'react'
import { Skeleton } from '../ui/skeleton';
interface SkletonCardProps {
    lengths: number;
  }
const SkletonCard:React.FC<SkletonCardProps> = ({lengths}) => {
  return (
    <div className='grid grid-cols-2 gap-x-3 gap-y-5'>
      {
        Array.from({length: lengths}).map((_,i) =>(
            <div key={i}>
                <div>
                    <Skeleton className='aspect-square rounded-[30px]' />
                </div>
                <div className='flex gap-4 mt-3'>
                    <Skeleton className='h-[18px] w-full mt-2 rounded-[4px]' />  
                    <Skeleton className='h-[18px] w-8 mt-2 rounded-[4px]' />  
                </div>
                <div>
                    <Skeleton className='h-[40px] mt-2 rounded-[4px]' />  
                </div>
                <div className='flex gap-4'>
                    <Skeleton className='h-[18px] w-8 mt-2 rounded-[4px]' />  
                    <Skeleton className='h-[18px] w-full mt-2 rounded-[4px]' />  
                </div>
            </div>
        ))
      }
    </div>
  )
}

export default SkletonCard
